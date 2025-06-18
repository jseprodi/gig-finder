import { notFound } from "next/navigation";
import { getVenues } from "@/utils/kontentClient";
import { VenueItem } from "@/components/VenueItem";
import { styled } from "@/styles/stitches.config";
import Breadcrumbs from "@/components/Breadcrumbs";

const Main = styled("main", {
  maxWidth: "48rem",
  margin: "2rem auto",
  padding: "3rem 1.5rem",
  background: "linear-gradient(135deg, #1e293b 80%, #2563eb 100%)",
  minHeight: "80vh",
  color: "#fff",
  borderRadius: "2rem",
  boxShadow: "0 4px 32px #0003",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2.5rem",
});

const Heading = styled("h1", {
  fontSize: "2.5rem",
  fontWeight: 800,
  marginBottom: "1.5rem",
  textAlign: "center",
  color: "#60a5fa",
  letterSpacing: "-0.01em",
  textShadow: "0 2px 8px #0002",
});

const Center = styled("div", {
  display: "flex",
  justifyContent: "center",
  marginTop: "2rem",
});

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venues = await getVenues("");
  const venue = venues.find(
    (v) => v.elements.venue_slug.value === slug
  );

  if (!venue) return notFound();

  return (
    <Main>
      <Breadcrumbs />
      <Heading>{venue.elements.venue_name.value}</Heading>
      <VenueItem venue={venue} showDetailsLink={false} />
      <Center>
        <a
          href={`/venues/${venue.elements.venue_slug.value}/concerts`}
          style={{
            display: "inline-block",
            background: "#2563eb",
            color: "#fff",
            padding: "0.75rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: 600,
            fontSize: "1.125rem",
            boxShadow: "0 2px 8px #0002",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          View Concerts
        </a>
      </Center>
    </Main>
  );
}
