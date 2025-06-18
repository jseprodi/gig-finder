"use client";

import { useState } from "react";
import { getBands } from "../utils/kontentClient";
import type { Band } from "../models/content-types/band";
import styles from "../app/page.module.css";
import { BandItem } from "./BandItem";
import Fuse from "fuse.js";

export default function BandSearch({ onResults, containerClass }: { onResults?: (results: Band[]) => void, containerClass?: string }) {
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
    if (onResults) onResults(filtered);
  }

  return (
    <div className={containerClass} style={{ display: 'block', width: '100%' }}>
      {/* Always stack search bar and no-results vertically at the top, outside the results grid */}
      <form
        onSubmit={handleSearch}
        className={styles.searchForm}
        style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
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
      {results && results.length === 0 && !loading && (
        <div className={styles.noResultsMsg} style={{ width: '100%', marginBottom: '1.5rem', display: 'block' }}>No bands found</div>
      )}
      {/* Only render the band grid if there are results */}
      {results && results.length > 0 && (
        <div style={{ width: '100%', display: 'block' }}>
          <div className={styles.main + " flex-col md:flex-row md:gap-8 w-full max-w-7xl mx-auto"}>
            <section className="flex-1">
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
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
