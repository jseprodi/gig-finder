import Image from "next/image";
import styles from "./page.module.css";
import BandSearch from "../components/BandSearch";
import VenueSearch from "../components/VenueSearch";
import ConcertReviews from "../components/ConcertReviews";

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.ctas}>
        <a className={styles.primary} href="#band-search">Search By Band</a>
        <a className={styles.primary} href="#venue-search">Search By Venue</a>
        <a className={styles.primary} href="#concert-reviews">Concert Reviews</a>
      </nav>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1>Welcome to Gig Finder</h1>
        <p>Discover concerts, search by your favorite bands or venues, and read reviews from past events.</p>
      </main>
      <section id="band-search" className={styles.section}>
        <h2>Search By Band</h2>
        <BandSearch />
      </section>
      <section id="venue-search" className={styles.section}>
        <h2>Search By Venue</h2>
        <VenueSearch />
      </section>
      <section id="concert-reviews" className={styles.section}>
        <h2>Concert Reviews</h2>
        <ConcertReviews />
      </section>
    </div>
  );
}
