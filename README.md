![ParseForge Banner](https://github.com/ParseForge/apify-assets/blob/ad35ccc13ddd068b9d6cba33f323962e39aed5b2/banner.jpg?raw=true)

# 🅱️ Bing Search Scraper

> 🚀 **Pull Bing organic search results without paying for the official API.** Country, language, and freshness filters. Pagination past 100 results per query. No API key, no quota negotiation.

> 🕒 **Last updated:** 2026-05-01 · **📊 8 fields** per result · **🌍 50 countries** · **🔄 paginated to 100+** · **🆓 free Bing data**

The **Bing Search Scraper** runs an organic Bing search and returns the ranked results page with title, URL, snippet, displayed URL, and posted date. Each query paginates past the visible first 10 listings using rotating Apify residential proxies, so a single run can return 100 or more organic results without triggering anti-bot.

Bing reaches roughly a quarter of global desktop search and powers default search inside Microsoft Edge, Windows Copilot, and ChatGPT search. SEO teams and competitive analysts need Bing data to track rankings outside Google. The official Bing Search API was retired for new customers, leaving a real gap. This Actor is the cheapest path to clean Bing organic data with country, market, language, freshness, and safe-search filters.

| 🎯 Target Audience | 💡 Primary Use Cases |
|---|---|
| SEO agencies, content marketers, competitive analysts, brand teams, researchers | Rank tracking, SERP monitoring, content gap analysis, brand surveillance, regional SEO |

---

## 📋 What the Bing Search Scraper does

Five filtering workflows in a single run:

- 🔍 **Multi-query batches.** Submit a list of queries, the Actor runs each as a separate search.
- 🌍 **Country filter.** 50-country enum routes each search through Bing's regional index.
- 🗣️ **Language filter.** ISO 639-1 codes set the result language preference.
- 📅 **Freshness filter.** Restrict to results from the last day, week, or month.
- 🔄 **Pagination.** Walks past the first page using `&first=` offsets and rotates proxies between pages.

Each row reports the originating query, rank position, full title, the Bing redirect URL, the displayed source URL Bing shows under the title, the snippet text, and any visible posted date.

> 💡 **Why it matters:** Google dominates the western SEO conversation but a quarter of all desktop searches happen on Bing. New AI-driven surfaces like Copilot and ChatGPT search rely on Bing's index. If you only track Google rankings you miss a sizable chunk of intent-driven traffic, especially in B2B and finance.

---

## 🎬 Full Demo

_🚧 Coming soon: a 3-minute walkthrough showing how to go from sign-up to a downloaded dataset._

---

## ⚙️ Input

<table>
<thead>
<tr><th>Input</th><th>Type</th><th>Default</th><th>Behavior</th></tr>
</thead>
<tbody>
<tr><td><code>maxItems</code></td><td>integer</td><td><code>10</code></td><td>Results to return. Free plan caps at 10, paid plan at 1,000,000.</td></tr>
<tr><td><code>queries</code></td><td>array of strings</td><td><code>["apify scraper"]</code></td><td>One or more search queries. Each is run as a separate search.</td></tr>
<tr><td><code>country</code></td><td>string</td><td><code>"us"</code></td><td>Two-letter country code from a 50-country enum. Routes the search through that regional index.</td></tr>
<tr><td><code>language</code></td><td>string</td><td><code>"en"</code></td><td>Two-letter language code.</td></tr>
<tr><td><code>safeSearch</code></td><td>string</td><td><code>"moderate"</code></td><td><code>strict</code>, <code>moderate</code>, or <code>off</code>.</td></tr>
<tr><td><code>freshness</code></td><td>string</td><td>empty</td><td><code>day</code>, <code>week</code>, or <code>month</code>. Empty returns all-time results.</td></tr>
</tbody>
</table>

**Example: 100 organic results for "web scraping" in the US.**

```json
{
    "maxItems": 100,
    "queries": ["web scraping"],
    "country": "us",
    "language": "en"
}
```

**Example: this-week news for two queries in Germany.**

```json
{
    "maxItems": 60,
    "queries": ["KI Agenten", "Web Scraping API"],
    "country": "de",
    "language": "de",
    "freshness": "week"
}
```

> ⚠️ **Good to Know:** the `url` field returns Bing's tracking-redirect URL because that is what appears on the SERP. Follow the redirect or read the `displayedUrl` field for the source domain. Pagination beyond 60 results sometimes triggers proxy rotation; the Actor handles this automatically.

---

## 📊 Output

Each result row contains **8 fields**. Download as CSV, Excel, JSON, or XML.

### 🧾 Schema

| Field | Type | Example |
|---|---|---|
| 🔍 `query` | string | `"web scraping"` |
| 🏆 `rank` | integer | `1` |
| 📰 `title` | string | `"Hands-On Web Scraping with Python"` |
| 🔗 `url` | string | `"https://www.bing.com/ck/a?..."` |
| 🌐 `displayedUrl` | string | `"https://pythoncourses.azurewebsites.net › eBooks › ..."` |
| 📝 `snippet` | string | `"Apr 1, 2023 · We will learn what exactly web scraping is..."` |
| 📅 `date` | string \| null | `"Apr 1, 2023"` |
| 🕒 `scrapedAt` | ISO 8601 | `"2026-05-01T01:15:40.193Z"` |

### 📦 Sample records

<details>
<summary><strong>📄 Educational PDF result with explicit posted date</strong></summary>

```json
{
    "query": "web scraping",
    "rank": 1,
    "title": "Hands-On Web Scraping with Python",
    "url": "https://www.bing.com/ck/a?!&&p=79d7bbf2b0011c18...",
    "displayedUrl": "https://pythoncourses.azurewebsites.net › eBooks › Hands-On...",
    "snippet": "Apr 1, 2023 · We will learn what exactly web scraping is, explore the techniques and technologies it is associated with...",
    "date": "Apr 1, 2023",
    "scrapedAt": "2026-05-01T01:15:40.193Z"
}
```

</details>

<details>
<summary><strong>🔵 Result without an explicit date</strong></summary>

```json
{
    "query": "web scraping",
    "rank": 2,
    "title": "Web Scraping with Python: Collecting Data from the Modern Web",
    "url": "https://www.bing.com/ck/a?!&&p=aafc90f5a07044f1...",
    "displayedUrl": "https://archive.org › download › py-web-scraping-book › ...",
    "snippet": "This section focuses on the basic mechanics of web scraping: how to use Python to request information from a web server",
    "date": null,
    "scrapedAt": "2026-05-01T01:15:40.213Z"
}
```

</details>

<details>
<summary><strong>🌐 Multi-query batch with rank reset per query</strong></summary>

```json
{
    "query": "apify scraper",
    "rank": 1,
    "title": "Apify Store",
    "url": "https://www.bing.com/ck/a?!&&p=...",
    "displayedUrl": "apify.com › store",
    "snippet": "Build, deploy, and monetize web scrapers and AI agents...",
    "date": null,
    "scrapedAt": "2026-05-01T01:15:42.110Z"
}
```

</details>

---

## ✨ Why choose this Actor

| | Capability |
|---|---|
| 🆓 | **No Bing API account.** Reads the public SERP HTML, no Microsoft credential setup. |
| 🔄 | **Past page 1.** Rotates proxies per page so you get 100+ results per query. |
| 🌍 | **50-country index.** Match your audience's actual regional search index. |
| 🗣️ | **Language and locale.** Aligns SERP language and locale headers. |
| 📅 | **Freshness slice.** Day, week, or month windows for news and trend tracking. |
| 📦 | **Multi-query batching.** Submit dozens of queries in a single run. |
| 🛡️ | **Anti-bot handled.** Proxy rotation and retry logic mask single-IP throttling. |

> 📊 In a single 41-second run the Actor returned 100 organic results for the query "web scraping".

---

## 📈 How it compares to alternatives

| Approach | Cost | Coverage | Refresh | Filters | Setup |
|---|---|---|---|---|---|
| Direct browser scraping | Free | Hits captchas | Live | Manual | Engineer hours |
| Paid SERP APIs | $$$ subscription | Full | Live | Built-in | Account setup |
| Generic search-data brokers | $$ subscription | Aggregated | Daily | Limited | Account setup |
| **⭐ Bing Search Scraper** *(this Actor)* | Pay-per-event | Past page 1 | Live | Country, language, freshness | None |

Same data the Bing SERP serves to a regular user, exposed as clean structured records with proxy rotation built in.

---

## 🚀 How to use

1. 🆓 **Create a free Apify account.** [Sign up here](https://console.apify.com/sign-up?fpr=vmoqkp) and get $5 in free credit.
2. 🔍 **Open the Actor.** Search for "Bing Search" in the Apify Store.
3. ⚙️ **Set queries and filters.** Add one or more queries, pick country and language.
4. ▶️ **Click Start.** A 100-result run typically completes in 30 to 60 seconds.
5. 📥 **Download.** Export as CSV, Excel, JSON, or XML.

> ⏱️ Total time from sign-up to first dataset: under five minutes.

---

## 💼 Business use cases

<table>
<tr>
<td width="50%">

### 📈 SEO & content
- Track Bing rankings as a complement to Google
- Monitor competitor visibility on Microsoft Edge default search
- Build keyword research feeds for B2B niches where Bing matters
- Audit how Bing surfaces your own pages over time

</td>
<td width="50%">

### 🛡️ Brand protection
- Detect knock-off pages ranking for your brand terms
- Track impersonation domains in fresh search results
- Monitor unauthorized resale listings
- Surface negative coverage early through freshness filters

</td>
</tr>
<tr>
<td width="50%">

### 🤖 AI & search products
- Build retrieval-augmented generation pipelines on Bing data
- Train rerankers on real SERP order
- Cross-reference ChatGPT search citations with Bing rank
- Power internal "where does X rank" dashboards

</td>
<td width="50%">

### 📰 Research & journalism
- Quote rank position with a stable methodology
- Compare regional SERPs across 50 country indexes
- Track news cycle freshness using the day or week filter
- Pull reproducible SERP snapshots for case studies

</td>
</tr>
</table>

---

## 🌟 Beyond business use cases

Data like this powers more than commercial workflows. The same structured records support research, education, civic projects, and personal initiatives.

<table>
<tr>
<td width="50%">

### 🎓 Research and academia
- Empirical datasets for papers, thesis work, and coursework
- Longitudinal studies tracking changes across snapshots
- Reproducible research with cited, versioned data pulls
- Classroom exercises on data analysis and ethical scraping

</td>
<td width="50%">

### 🎨 Personal and creative
- Side projects, portfolio demos, and indie app launches
- Data visualizations, dashboards, and infographics
- Content research for bloggers, YouTubers, and podcasters
- Hobbyist collections and personal trackers

</td>
</tr>
<tr>
<td width="50%">

### 🤝 Non-profit and civic
- Transparency reporting and accountability projects
- Advocacy campaigns backed by public-interest data
- Community-run databases for local issues
- Investigative journalism on public records

</td>
<td width="50%">

### 🧪 Experimentation
- Prototype AI and machine-learning pipelines with real data
- Validate product-market hypotheses before engineering spend
- Train small domain-specific models on niche corpora
- Test dashboard concepts with live input

</td>
</tr>
</table>

---

## 🔌 Automating Bing Search Scraper

Run this Actor on a schedule, from your codebase, or inside another tool:

- **Node.js** SDK: see [Apify JavaScript client](https://docs.apify.com/api/client/js/) for programmatic runs and dataset exports.
- **Python** SDK: see [Apify Python client](https://docs.apify.com/api/client/python/) for the same flow in Python.
- **HTTP API**: see [Apify API docs](https://docs.apify.com/api/v2) for raw REST integration.

Schedule daily, weekly, or monthly runs from the Apify Console. Pipe results into Google Sheets, S3, BigQuery, or your own webhook with the built-in [integrations](https://docs.apify.com/platform/integrations).

---

## ❓ Frequently Asked Questions

<details>
<summary><strong>🔍 Why does the URL field look like a Bing tracking link?</strong></summary>

The Actor returns the exact URL Bing renders in the result link, which is the click-tracking redirect. Follow it once to reach the actual destination, or read the `displayedUrl` field which shows the source domain Bing displays under the title.

</details>

<details>
<summary><strong>🌍 Which countries are supported?</strong></summary>

The country enum includes 50 codes covering all major Western markets, every G20 member, and most APAC and Latin America regions. If your specific country is missing, [open a request](https://tally.so/r/BzdKgA) and we'll add it.

</details>

<details>
<summary><strong>📦 How many results can I get per query?</strong></summary>

Up to 100 organic results per query in a typical run. Bing tightens anti-bot beyond that, but the Actor's proxy rotation extends past the default first-page cap.

</details>

<details>
<summary><strong>🔄 Can I run multiple queries in one run?</strong></summary>

Yes. The `queries` input is a string array. Rank position resets per query in the dataset.

</details>

<details>
<summary><strong>📅 What does the freshness filter actually do?</strong></summary>

It maps to Bing's `&filters=ex1:"ez1_..."` parameter. `day` returns last-24-hour content, `week` returns last-7-day content, `month` returns last-30-day content.

</details>

<details>
<summary><strong>🛡️ Why does the Actor use a residential proxy?</strong></summary>

Bing rate-limits aggressive scraping from datacenter IPs. Apify residential proxies route each page through a fresh consumer IP, which keeps the SERP HTML clean.

</details>

<details>
<summary><strong>🤖 Are images, videos, and ads included?</strong></summary>

No. This Actor focuses on the organic results list. Image, video, and ad blocks render under different selectors and are out of scope for v1.

</details>

<details>
<summary><strong>💼 Can I use this for commercial work?</strong></summary>

Yes. The Actor reads only what Bing publicly serves to any browser. Always honor each downstream site's terms of service when republishing snippets or titles.

</details>

<details>
<summary><strong>💳 Do I need a paid Apify plan?</strong></summary>

The free plan returns up to 10 results per run. Paid plans return up to 1,000,000. Pay-per-event pricing means you only pay for the results returned.

</details>

<details>
<summary><strong>⚠️ What if a run fails or returns thin results?</strong></summary>

The Actor retries with proxy rotation when Bing returns a thin response. If a query genuinely has fewer than expected results, that reflects the SERP itself. [Open a contact form](https://tally.so/r/BzdKgA) and include the run URL if you suspect a bug.

</details>

<details>
<summary><strong>🔁 How fresh is the data?</strong></summary>

Live. Each run hits Bing at run time, so you get whatever the SERP shows right now.

</details>

<details>
<summary><strong>⚖️ Is scraping Bing legal?</strong></summary>

Reading public SERP HTML is widely accepted as fair use for SEO research. The Actor does not bypass paywalls, does not sign in, and respects per-page proxy rotation to avoid undue load.

</details>

---

## 🔌 Integrate with any app

- [**Make**](https://apify.com/integrations/make) - drop run results into 1,800+ apps with a no-code visual builder.
- [**Zapier**](https://apify.com/integrations/zapier) - trigger automations off completed runs.
- [**Slack**](https://apify.com/integrations/slack) - post run summaries to a channel.
- [**Google Sheets**](https://apify.com/integrations/google-sheets) - sync each run into a spreadsheet.
- [**Webhooks**](https://docs.apify.com/platform/integrations/webhooks) - notify your own services on run finish.
- [**Airbyte**](https://apify.com/integrations/airbyte) - load runs into Snowflake, BigQuery, or Postgres.

---

## 🔗 Recommended Actors

- [**🦆 DuckDuckGo Search Scraper**](https://apify.com/parseforge/duckduckgo-search-scraper) - a privacy-first SERP signal alongside Bing.
- [**📚 Wikipedia Pageviews Scraper**](https://apify.com/parseforge/wikipedia-pageviews-scraper) - cross-reference rank shifts with public-interest spikes.
- [**🕰️ Wayback Machine CDX Scraper**](https://apify.com/parseforge/wayback-cdx-scraper) - audit historical versions of pages that rank.
- [**🐙 GitHub Trending Repos Scraper**](https://apify.com/parseforge/github-trending-scraper) - capture the developer-attention layer.
- [**📰 Substack Publication Scraper**](https://apify.com/parseforge/substack-publication-scraper) - track newsletter content that ranks against your queries.

> 💡 **Pro Tip:** browse the complete [ParseForge collection](https://apify.com/parseforge) for more pre-built scrapers and data tools.

---

**🆘 Need Help?** [**Open our contact form**](https://tally.so/r/BzdKgA) and we'll route the question to the right person.

---

> Bing is a registered trademark of Microsoft Corporation. This Actor is not affiliated with or endorsed by Microsoft. It reads only publicly visible SERP HTML the same way a normal browser does.
