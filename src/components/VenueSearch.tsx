"use client";

import { useState } from "react";
import { getVenues } from "../utils/kontentClient";
import type { Venue } from "../models/content-types/venue";
import styles from "../app/page.module.css";
import { VenueItem } from "./VenueItem";
import Fuse from "fuse.js";

export default function VenueSearch() {
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
  }

  return (
    <div>
      <form onSubmit={handleSearch} className={styles.searchForm}>
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
      <div className="flex flex-col md:flex-row mt-6 md:gap-6">
        {/* Filter Sidebar (placeholder for future filters) */}
        <aside className="flex-shrink-0 bg-white rounded-lg shadow p-4 mb-6 md:mb-0 md:w-64">
          <h4 className="m-0 py-2 text-lg font-semibold text-gray-800">
            Category
          </h4>
          <ul className="m-0 min-h-full gap-2 p-0 list-none">
            {/* No venue taxonomies yet */}
          </ul>
        </aside>
        {/* Venue Grid */}
        <section className="flex-1">
          {results && results.length > 0 ? (
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
          ) : (
            <div className="self-center text-center w-full h-10 pt-2 text-gray-500">
              No venues found
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
