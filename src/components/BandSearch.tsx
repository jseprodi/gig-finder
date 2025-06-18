"use client";

import { useState } from "react";
import { getBands } from "../utils/kontentClient";
import type { Band } from "../models/content-types/band";
import styles from "../app/page.module.css";
import { BandItem } from "./BandItem";
import Fuse from "fuse.js";

// Placeholder: You should fetch or define your taxonomies array
const taxonomies: unknown[] = [];
// Placeholder: You should implement this function to render filter options
const renderFilterOption = (taxonomy: unknown) => {
  if (typeof taxonomy === 'object' && taxonomy && 'codename' in taxonomy && 'name' in taxonomy) {
    return <li key={(taxonomy as { codename: string }).codename}>{(taxonomy as { name: string }).name}</li>;
  }
  return null;
};

export default function BandSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Band[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const bands = await getBands();
    let filtered: Band[];
    if (query) {
      const fuse = new Fuse(bands, {
        keys: ["elements.band_name.value"],
        threshold: 0.4,
      });
      filtered = fuse.search(query).map(result => result.item);
    } else {
      filtered = bands;
    }
    setResults(filtered);
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter band name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className={styles.main + " flex-col md:flex-row md:gap-8 w-full max-w-7xl mx-auto"}>
        {/* Filter Sidebar */}
        <aside className="flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6 md:mb-0 md:w-64 border border-gray-200 dark:border-gray-800">
          <h4 className="m-0 py-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Category</h4>
          <ul className="m-0 min-h-full gap-2 p-0 list-none">
            {Array.isArray(taxonomies) && taxonomies.map(renderFilterOption)}
          </ul>
        </aside>
        {/* Band Grid */}
        <section className="flex-1">
          {results && results.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 p-0 list-none">
              {results.map(band => {
                console.log('Band:', band.elements.band_name.value, 'Slug:', band.elements.slug.value);
                return (
                  <li key={band.system.id} className="p-0 bg-transparent shadow-none rounded-none flex flex-col h-full">
                    <BandItem
                      bandName={band.elements.band_name.value}
                      bandLogo={band.elements.band_logo.value[0]?.url || "/file.svg"}
                      promotionalImage={band.elements.promotional_image.value[0]?.url || "/file.svg"}
                      bandBio={band.elements.band_bio}
                      bandMember={
                        Array.isArray(band.elements.band_member.linkedItems) && band.elements.band_member.linkedItems.length > 0
                          ? band.elements.band_member.linkedItems
                              .map((member) => {
                                if (
                                  typeof member === "object" &&
                                  member !== null &&
                                  "elements" in member &&
                                  member.elements &&
                                  typeof member.elements.first_name?.value === "string"
                                ) {
                                  const first = member.elements.first_name.value;
                                  const last = member.elements.last_name?.value || "";
                                  return `${first}${last ? ` ${last}` : ""}`.trim();
                                }
                                return "";
                              })
                              .filter((name: string) => name !== "")
                          : []
                      }
                      socialMedia={band.elements.social_media}
                      bandPlaylist={
                        Array.isArray(band.elements.band_playlist.linkedItems) && band.elements.band_playlist.linkedItems[0]
                          ? band.elements.band_playlist.linkedItems[0].elements.song_title.value &&
                            band.elements.band_playlist.linkedItems[0].elements.song_link.value
                            ? `${band.elements.band_playlist.linkedItems[0].elements.song_title.value} ${band.elements.band_playlist.linkedItems[0].elements.song_link.value}`
                            : ""
                          : ""
                      }
                      bandGenre={
                        Array.isArray(band.elements.band_genre.value)
                          ? band.elements.band_genre.value
                              .map((g: unknown) => {
                                if (typeof g === "object" && g !== null && "name" in g) {
                                  return g.name;
                                }
                                return "";
                              })
                              .join(", ")
                          : ""
                      }
                      bandSlug={band.elements.slug.value}
                      bandId={band.system.id}
                      detailUrl={`/bands/${band.elements.slug.value}`}
                      envId={""}
                      variant="list"
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="self-center text-center w-full h-10 pt-2 text-gray-500">No bands found</div>
          )}
        </section>
      </div>
    </div>
  );
}
