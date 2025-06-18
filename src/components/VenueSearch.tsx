"use client";

import { useState } from "react";
import { getVenues } from "../utils/kontentClient";
import type { Venue } from "../models/content-types/venue";
import styles from "../app/page.module.css";
import { VenueItem } from "./VenueItem";
import Fuse from "fuse.js";

export default function VenueSearch({
  onResults,
  containerClass,
}: {
  onResults?: (results: Venue[]) => void;
  containerClass?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const venues = await getVenues(""); // get all venues
    let filtered: Venue[];
    if (query) {
      const fuse = new Fuse(venues, {
        keys: ["elements.venue_name.value"],
        threshold: 0.4,
      });
      filtered = fuse.search(query).map((result) => result.item);
    } else {
      filtered = venues;
    }
    setResults(filtered);
    setLoading(false);
    if (onResults) onResults(filtered);
  }

  return (
    <div className={containerClass} style={{ display: "block", width: "100%" }}>
      <form
        onSubmit={handleSearch}
        className={styles.searchForm}
        style={{
          width: "100%",
          marginBottom: "0.5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <input
          className={styles.input}
          type="text"
          placeholder="Enter venue name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {results && results.length === 0 && !loading && (
        <div
          className={styles.noResultsMsg}
          style={{
            width: "100%",
            marginBottom: "1.5rem",
            display: "block",
          }}
        >
          No venues found
        </div>
      )}
      {/* Only render the venue grid if there are results */}
      {results && results.length > 0 && (
        <div style={{ width: "100%", display: "block" }}>
          <div className="flex flex-col md:flex-row mt-6 md:gap-6">
            {/* Venue Grid */}
            <section className="flex-1">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 p-0 list-none">
                {results.map((venue) => (
                  <li
                    key={venue.system.id}
                    className="bg-white rounded-lg shadow p-4 flex flex-col h-full"
                  >
                    <VenueItem venue={venue} />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
