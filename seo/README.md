# Overseas SEO Research Workflow

This directory is the human-review layer between Semrush keyword data and published content.

The goal is **not** to mass-publish AI articles. The workflow is:

1. Collect keyword data from Semrush.
2. Rank opportunities by relevance, difficulty, volume, intent, and CPC.
3. Let Codex inspect the existing `content/` tree for overlap/cannibalization.
4. Research the current SERP before choosing a topic.
5. Produce a content brief first.
6. Create an English draft only when the topic has a clear search intent and a differentiated angle.
7. Keep generated articles as drafts and review them before publishing.

## MVP: use a Semrush CSV export

Export keyword data from Semrush and save it locally, for example:

```text
seo/input/semrush.csv
```

The scorer requires these fields (common aliases are accepted):

- `Keyword`
- `Volume`
- `Keyword Difficulty` or `KD %`

Optional fields improve prioritization:

- `CPC`
- `Intent`
- `Relevance` — a 0-100 manual score for how well the keyword fits maoxunxing.com

Run:

```bash
python3 scripts/seo_keyword_score.py seo/input/semrush.csv
```

Outputs:

```text
seo/output/opportunities.csv
seo/output/opportunities.md
```

Default filters:

- minimum monthly search volume: 20
- maximum KD: 70
- Markdown report: top 30 keywords

You can override them:

```bash
python3 scripts/seo_keyword_score.py seo/input/semrush.csv \
  --min-volume 50 \
  --max-kd 55 \
  --top 20
```

## Opportunity score

The current MVP score is deliberately simple and explainable:

| Signal | Weight |
| --- | ---: |
| Site/content relevance | 30% |
| Lower keyword difficulty | 25% |
| Search volume | 20% |
| Search intent | 15% |
| CPC/commercial signal | 10% |

Do not publish based on the score alone. A high-scoring keyword can still be a bad target if the SERP intent does not match the site, the topic is already covered, or the result requires authority/data the site cannot credibly provide.

## Recommended first topic pools

Start from areas where the site already has first-hand knowledge and supporting internal content:

- AI coding workflows / AI engineering
- AI indie hacking / micro-SaaS building
- long-term investing and household asset allocation
- options education for long-term investors
- gold / RWA / portfolio construction

Existing Chinese posts can be used as research material, but English pages should be rewritten for English-language search intent rather than translated mechanically.

## What Codex should do next

Use [`CODEX_PROMPT.md`](./CODEX_PROMPT.md) after the opportunity report has been generated. Codex should select only a small number of topics, inspect current site content, research the SERP, and create briefs before drafting pages.

## Next automation step

Once the Semrush API/connector is callable in the execution environment, replace the manual CSV export with an automated data-fetch step. Keep the scorer, cannibalization check, brief stage, and human review gate unchanged.
