#!/usr/bin/env python3
"""Rank Semrush keyword exports for maoxunxing.com content research."""

from __future__ import annotations

import argparse
import csv
import math
import re
import sys
from pathlib import Path

ALIASES = {
    "keyword": {"keyword", "phrase", "search term", "query"},
    "volume": {"volume", "search volume", "monthly volume"},
    "kd": {"keyword difficulty", "keyword difficulty %", "kd", "kd %", "difficulty"},
    "cpc": {"cpc", "cpc usd", "cpc (usd)", "cost per click"},
    "intent": {"intent", "search intent"},
    "relevance": {"relevance", "relevance score", "site relevance"},
}

INTENT_SCORES = {
    "commercial": 100.0,
    "transactional": 95.0,
    "informational": 85.0,
    "navigational": 50.0,
    "c": 100.0,
    "t": 95.0,
    "i": 85.0,
    "n": 50.0,
}


def normalize_header(value: str) -> str:
    value = value.strip().lower().replace("_", " ")
    return re.sub(r"\s+", " ", value)


def resolve_columns(fieldnames: list[str]) -> dict[str, str | None]:
    normalized = {normalize_header(name): name for name in fieldnames}
    resolved: dict[str, str | None] = {}
    for canonical, aliases in ALIASES.items():
        resolved[canonical] = next(
            (normalized[alias] for alias in aliases if alias in normalized), None
        )
    return resolved


def parse_number(value: str | None, default: float = 0.0) -> float:
    if value is None:
        return default
    cleaned = value.strip().replace(",", "").replace("%", "").replace("$", "")
    if not cleaned:
        return default
    try:
        return float(cleaned)
    except ValueError:
        return default


def volume_score(volume: float) -> float:
    # 10 -> ~26, 100 -> ~50, 1k -> ~75, 10k+ -> 100.
    return min(100.0, 25.0 * math.log10(max(0.0, volume) + 1.0))


def cpc_score(cpc: float, max_cpc: float) -> float:
    if max_cpc <= 0:
        return 50.0
    return min(100.0, 100.0 * math.log1p(max(cpc, 0.0)) / math.log1p(max_cpc))


def intent_score(intent: str | None) -> float:
    if not intent:
        return 70.0
    raw = intent.strip().lower()
    if not raw:
        return 70.0
    candidates = re.split(r"[,;/|+\s]+", raw)
    scores = [INTENT_SCORES[item] for item in candidates if item in INTENT_SCORES]
    return max(scores, default=70.0)


def relevance_score(value: str | None) -> float:
    score = parse_number(value, default=70.0)
    return max(0.0, min(100.0, score))


def rank_keywords(
    rows: list[dict[str, str]], columns: dict[str, str | None]
) -> list[dict[str, object]]:
    keyword_col = columns["keyword"]
    volume_col = columns["volume"]
    kd_col = columns["kd"]
    if not keyword_col or not volume_col or not kd_col:
        missing = [name for name in ("keyword", "volume", "kd") if not columns[name]]
        raise ValueError(
            "Missing required Semrush columns: "
            + ", ".join(missing)
            + ". Expected Keyword, Volume, and Keyword Difficulty/KD."
        )

    max_cpc = max(
        (parse_number(row.get(columns["cpc"])) for row in rows)
        if columns["cpc"]
        else [0.0],
        default=0.0,
    )

    ranked: list[dict[str, object]] = []
    for row in rows:
        keyword = (row.get(keyword_col) or "").strip()
        if not keyword:
            continue
        volume = max(0.0, parse_number(row.get(volume_col)))
        kd = max(0.0, min(100.0, parse_number(row.get(kd_col))))
        cpc = (
            max(0.0, parse_number(row.get(columns["cpc"])))
            if columns["cpc"]
            else 0.0
        )
        intent = (row.get(columns["intent"]) or "").strip() if columns["intent"] else ""
        relevance = (
            relevance_score(row.get(columns["relevance"]))
            if columns["relevance"]
            else 70.0
        )

        components = {
            "relevance": relevance,
            "difficulty": 100.0 - kd,
            "volume": volume_score(volume),
            "intent": intent_score(intent),
            "cpc": cpc_score(cpc, max_cpc),
        }
        opportunity = (
            components["relevance"] * 0.30
            + components["difficulty"] * 0.25
            + components["volume"] * 0.20
            + components["intent"] * 0.15
            + components["cpc"] * 0.10
        )
        ranked.append(
            {
                "keyword": keyword,
                "volume": int(volume) if volume.is_integer() else volume,
                "kd": round(kd, 1),
                "cpc": round(cpc, 2),
                "intent": intent or "unknown",
                "relevance": round(relevance, 1),
                "opportunity_score": round(opportunity, 1),
            }
        )

    return sorted(
        ranked,
        key=lambda item: (
            -float(item["opportunity_score"]),
            -float(item["volume"]),
            float(item["kd"]),
            str(item["keyword"]).lower(),
        ),
    )


def read_csv(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        sample = handle.read(4096)
        handle.seek(0)
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
        except csv.Error:
            dialect = csv.excel
        reader = csv.DictReader(handle, dialect=dialect)
        if not reader.fieldnames:
            raise ValueError("CSV has no header row.")
        return list(reader), list(reader.fieldnames)


def write_csv(path: Path, rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = [
        "keyword",
        "volume",
        "kd",
        "cpc",
        "intent",
        "relevance",
        "opportunity_score",
    ]
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def write_markdown(path: Path, rows: list[dict[str, object]], top: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# SEO Keyword Opportunities",
        "",
        "Generated from a Semrush CSV export. Scores are prioritization aids, not publishing decisions.",
        "",
        "| # | Keyword | Volume | KD | CPC | Intent | Relevance | Score |",
        "|---:|---|---:|---:|---:|---|---:|---:|",
    ]
    for index, row in enumerate(rows[:top], start=1):
        keyword = str(row["keyword"]).replace("|", "\\|")
        intent = str(row["intent"]).replace("|", "\\|")
        lines.append(
            f"| {index} | {keyword} | {row['volume']} | {row['kd']} | "
            f"{row['cpc']} | {intent} | {row['relevance']} | "
            f"**{row['opportunity_score']}** |"
        )
    lines.extend(
        [
            "",
            "## Scoring",
            "",
            "- Site/content relevance: 30%",
            "- Lower keyword difficulty: 25%",
            "- Search volume: 20%",
            "- Search intent: 15%",
            "- CPC/commercial signal: 10%",
            "",
            "Before drafting, Codex should still check SERP intent, content gaps, and cannibalization against `content/`.",
            "",
        ]
    )
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Semrush CSV export")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("seo/output/opportunities.csv"),
        help="Ranked CSV output",
    )
    parser.add_argument(
        "--markdown",
        type=Path,
        default=Path("seo/output/opportunities.md"),
        help="Top opportunities Markdown report",
    )
    parser.add_argument("--top", type=int, default=30, help="Rows in Markdown report")
    parser.add_argument("--min-volume", type=float, default=20.0)
    parser.add_argument("--max-kd", type=float, default=70.0)
    args = parser.parse_args()

    try:
        rows, fieldnames = read_csv(args.input)
        columns = resolve_columns(fieldnames)
        ranked = rank_keywords(rows, columns)
    except (OSError, ValueError) as exc:
        print(f"seo_keyword_score: {exc}", file=sys.stderr)
        return 1

    filtered = [
        row
        for row in ranked
        if float(row["volume"]) >= args.min_volume and float(row["kd"]) <= args.max_kd
    ]
    write_csv(args.output, filtered)
    write_markdown(args.markdown, filtered, max(1, args.top))
    print(
        f"Ranked {len(rows)} keywords; kept {len(filtered)} "
        f"(volume >= {args.min_volume:g}, KD <= {args.max_kd:g})."
    )
    print(f"CSV: {args.output}")
    print(f"Report: {args.markdown}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
