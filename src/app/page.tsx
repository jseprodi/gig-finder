"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import BandSearch from "../components/BandSearch";
import VenueSearch from "../components/VenueSearch";
import ConcertReviews from "../components/ConcertReviews";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FaGuitar, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import clsx from "clsx";
import type { Band } from '../models/content-types/band';
import type { Venue } from '../models/content-types/venue';
import type { ConcertReview } from '../models/content-types/concertReview';

export default function Home() {
  const [activeSearch, setActiveSearch] = useState<"band" | "venue" | "reviews" | null>(null);
  const [bandResults, setBandResults] = useState<Band[]>([]);
  const [venueResults, setVenueResults] = useState<Venue[]>([]);
  const [reviewResults, setReviewResults] = useState<ConcertReview[]>([]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt="Gig Finder logo"
          width={180}
          height={60}
          style={{ objectFit: 'contain', height: '60px', width: '180px' }}
          priority
        />
        <h1 className={styles.title}>Gig Finder</h1>
        <p className={styles.tagline}>Discover concerts, search by your favorite bands or venues, and read reviews from past events.</p>
        <nav className={styles.menu}>
          <button className={styles.cta} onClick={() => setActiveSearch("band")}> <FaGuitar /> Search By Band</button>
          <button className={styles.cta} onClick={() => setActiveSearch("venue")}> <FaMapMarkerAlt /> Search By Venue</button>
          <button className={styles.cta} onClick={() => setActiveSearch("reviews")}> <FaStar /> Concert Reviews</button>
        </nav>
        {/* Only show the selected search section inside the hero box */}
        {activeSearch === "band" && (
          <section
            id="band-search"
            className={styles.section}
            style={{
              padding: '1.25rem 1rem',
              margin: '1.5rem 0',
              maxWidth: 520,
              minWidth: 320,
              width: '100%',
              boxShadow: '0 2px 16px #0002',
              background: 'rgba(30,41,59,0.92)',
              borderRadius: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'max-height 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
              overflow: 'hidden',
              minHeight: 'unset',
              height: 'auto',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#60a5fa', textAlign: 'center', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Search By Band
            </h2>
            <div
              className={clsx(styles.searchContainer, bandResults.length > 0 ? styles.searchContainerExpanded : styles.searchContainerCompact)}
            >
              <BandSearch onResults={setBandResults} containerClass={clsx(styles.searchContainer, bandResults.length > 0 ? styles.searchContainerExpanded : styles.searchContainerCompact)} />
            </div>
          </section>
        )}
        {activeSearch === "venue" && (
          <section id="venue-search" className={styles.section}>
            <h2>Search By Venue</h2>
            <div
              className={clsx(styles.searchContainer, venueResults.length > 0 ? styles.searchContainerExpanded : styles.searchContainerCompact)}
            >
              <VenueSearch onResults={setVenueResults} containerClass={clsx(styles.searchContainer, venueResults.length > 0 ? styles.searchContainerExpanded : styles.searchContainerCompact)} />
            </div>
          </section>
        )}
        {activeSearch === "reviews" && (
          <section id="concert-reviews" className={styles.section}>
            <h2>Concert Reviews</h2>
            <div
              className={clsx(styles.searchContainer, reviewResults.length > 0 ? styles.searchContainerExpanded : styles.searchContainerCompact)}
            >
              <ConcertReviews onResults={setReviewResults} containerClass={clsx(styles.searchContainer, reviewResults.length > 0 ? styles.searchContainerExpanded : styles.searchContainerCompact)} />
            </div>
          </section>
        )}
      </div>
      <Breadcrumbs />
    </div>
  );
}
