"use client";

import { useState } from "react";
import { getConcertReviews } from "../utils/kontentClient";
import type { ConcertReview } from "../models/content-types/concertReview";
import styles from "../app/page.module.css";

export default function ConcertReviews({ onResults, containerClass }: { onResults?: (results: ConcertReview[]) => void, containerClass?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ConcertReview[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const reviews = await getConcertReviews(query);
    setResults(reviews);
    setLoading(false);
    if (onResults) onResults(reviews);
  }

  return (
    <div className={containerClass}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search reviews by band, venue, or keyword..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <ul className={styles.cardList}>
        {results.map((review) => (
          <li className={styles.card} key={review.system.id}>
            <strong>{review.elements.headline?.value || "Untitled Review"}</strong>
            <div style={{ color: '#666', fontSize: 14, margin: '6px 0' }}>
              {review.elements.review_body?.value?.replace(/<[^>]+>/g, '').slice(0, 120)}...
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
