import { notFound } from "next/navigation";
import { getVenues } from "@/utils/kontentClient";
import { VenueItem } from "@/components/VenueItem";
import { styled } from "@/styles/stitches.config";

const Main = styled("main", {
  maxWidth: "48rem",
  margin: "2rem auto",
  padding: "$12 $4",
  background: "linear-gradient(135deg, #f0f4ff 90%, #dbeafe 100%)",
  minHeight: "80vh",
  borderRadius: "$xl",
  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
});

const Heading = styled("h1", {
  fontSize: "$4xl",
  fontWeight: "$bold",
  marginBottom: "$8",
  textAlign: "center",
  color: "#2563eb",
  letterSpacing: "-0.01em",
  textShadow: "0 2px 8px #0001",
});

const Center = styled("div", {
  display: "flex",
  justifyContent: "center",
  marginTop: "$8",
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
