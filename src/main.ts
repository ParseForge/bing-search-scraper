import { Actor, log } from 'apify';
import c from 'chalk';
import * as cheerio from 'cheerio';
import { Impit } from 'impit';

interface Input {
    maxItems?: number;
    queries?: string[];
    country?: string;
    language?: string;
    safeSearch?: 'off' | 'moderate' | 'strict';
    freshness?: '' | 'Day' | 'Week' | 'Month';
}

const STARTUP = ['🔎 Querying Bing search…', '🌐 Pulling Bing organic results…', '📊 Crawling Bing SERPs…'];
const DONE = ['🎉 Bing results delivered.', '✅ SERP harvest complete.', '🚀 Search export ready.'];
const pick = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)] ?? arr[0]!;

const SAFE_MAP: Record<string, string> = { off: 'OFF', moderate: 'MODERATE', strict: 'STRICT' };

await Actor.init();
const input = (await Actor.getInput<Input>()) ?? {};
const userIsPaying = Boolean(Actor.getEnv()?.userIsPaying);
const isPayPerEvent = Actor.getChargingManager().getPricingInfo().isPayPerEvent;

let effectiveMaxItems = input.maxItems ?? 10;
if (!userIsPaying) {
    if (!effectiveMaxItems || effectiveMaxItems > 10) {
        effectiveMaxItems = 10;
        log.warning([
            '',
            `${c.dim('        *  .  ✦        .    *       .')}`,
            `${c.dim('  .        *')}    🛰️  ${c.dim('.        *   .    ✦')}`,
            `${c.dim('     ✦  .        .       *        .')}`,
            '',
            `${c.yellow("  You're on a free plan — limited to 10 items.")}`,
            `${c.cyan('  Upgrade to a paid plan for up to 1,000,000 items.')}`,
            '',
            `  ✦ ${c.green.underline('https://console.apify.com/sign-up?fpr=vmoqkp')}`,
            '',
        ].join('\n'));
    }
}

const queries = (input.queries && input.queries.length ? input.queries : ['apify scraper']).map((q) => q.trim()).filter(Boolean);
const country = (input.country ?? 'us').toLowerCase();
const language = (input.language ?? 'en').toLowerCase();
const safe = SAFE_MAP[input.safeSearch ?? 'moderate'] ?? 'MODERATE';
const freshness = input.freshness ?? '';

console.log(c.cyan('\n🛰️  Arguments:'));
console.log(c.green(`   🟩 queries : [${queries.length}] ${queries.slice(0, 3).join(', ')}${queries.length > 3 ? '…' : ''}`));
console.log(c.green(`   🟩 country : ${country}`));
console.log(c.green(`   🟩 language : ${language}`));
console.log(c.green(`   🟩 maxItems : ${effectiveMaxItems}`));
console.log('');
console.log(c.magenta(`📬 ${pick(STARTUP)}\n`));

const proxyConfig = await Actor.createProxyConfiguration({ groups: ['RESIDENTIAL'], countryCode: country.toUpperCase() }).catch(() => null);
const proxyUrl = proxyConfig ? await proxyConfig.newUrl() : undefined;
const impit = new Impit({ browser: 'chrome', proxyUrl });

function buildUrl(q: string, first: number): string {
    const params = new URLSearchParams();
    params.set('q', q);
    params.set('cc', country);
    params.set('setlang', `${language}-${country.toUpperCase()}`);
    params.set('count', '20');
    if (first > 0) params.set('first', String(first));
    if (freshness) params.set('filters', `ex1:"ez1_${freshness}"`);
    return `https://www.bing.com/search?${params.toString()}`;
}

function parseResults(html: string, query: string, startRank: number): any[] {
    const $ = cheerio.load(html);
    const items: any[] = [];
    let rank = startRank;
    $('li.b_algo').each((_, el) => {
        const $el = $(el);
        const titleA = $el.find('h2 > a').first();
        const title = titleA.text().trim();
        const url = titleA.attr('href') ?? null;
        if (!title || !url) return;
        const displayedUrl = $el.find('cite').first().text().trim() || null;
        const snippet = $el.find('.b_caption p, .b_lineclamp1, .b_lineclamp2, .b_lineclamp3').first().text().trim() || null;
        const date = $el.find('.news_dt').first().text().trim() || null;
        items.push({
            query,
            rank,
            title,
            url,
            displayedUrl,
            snippet,
            date: date || null,
            scrapedAt: new Date().toISOString(),
        });
        rank += 1;
    });
    return items;
}

let pushed = 0;
for (const q of queries) {
    if (pushed >= effectiveMaxItems) break;
    let first = 0;
    let rank = 1;
    let attempts = 0;
    while (pushed < effectiveMaxItems && attempts < 20) {
        const url = buildUrl(q, first);
        log.info(`📡 [${q}] page ${Math.floor(first / 20) + 1}…`);
        try {
            const r = await impit.fetch(url, {
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'accept-language': `${language}-${country.toUpperCase()},${language};q=0.9`,
                    'cookie': `SRCHHPGUSR=ADLT=${safe}&NRSLT=20`,
                },
            });
            const html = await r.text();
            if (html.length < 5000) {
                log.warning(`   thin response (${html.length} bytes), retrying…`);
                attempts += 1;
                await new Promise((res) => setTimeout(res, 1500));
                continue;
            }
            const results = parseResults(html, q, rank);
            if (!results.length) {
                log.info(`   no more results for "${q}"`);
                break;
            }
            for (const item of results) {
                if (pushed >= effectiveMaxItems) break;
                if (isPayPerEvent) await Actor.pushData([item], 'result-item');
                else await Actor.pushData([item]);
                pushed += 1;
                rank += 1;
            }
            first += 20;
            attempts = 0;
            await new Promise((res) => setTimeout(res, 600 + Math.random() * 400));
        } catch (err: any) {
            log.warning(`   ${err.message}`);
            attempts += 1;
            await new Promise((res) => setTimeout(res, 1500));
        }
    }
}

if (pushed === 0) await Actor.pushData([{ error: 'No results returned from Bing.' }]);
log.info(c.green(`✅ Pushed ${pushed} results`));
console.log(c.magenta(`\n${pick(DONE)}`));
await Actor.exit();
