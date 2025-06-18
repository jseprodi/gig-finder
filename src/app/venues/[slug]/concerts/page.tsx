import { getConcertsByVenueSlug } from "@/utils/kontentClient";
import { styled } from "@/styles/stitches.config";
import Image from "next/image";

const Main = styled("main", {
  maxWidth: "64rem",
  margin: "0 auto",
  padding: "$12 $4",
});

const Heading = styled("h1", {
  fontSize: "$3xl",
  fontWeight: "$bold",
  marginBottom: "$10",
  textAlign: "center",
  color: "$heading",
  letterSpacing: "-0.01em",
});

const ConcertList = styled("ul", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "$8",
  "@md": {
    gridTemplateColumns: "1fr 1fr",
  },
});

const Card = styled("li", {
  background: "$card",
  borderRadius: "$xl",
  boxShadow: "0 2px 8px $cardShadow",
  border: "1px solid $cardBorder",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: "box-shadow 0.2s",
  "&:hover": {
    boxShadow: "0 4px 16px $cardShadow",
  },
});

const CardBody = styled("div", {
  padding: "$6",
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

const Title = styled("h2", {
  fontSize: "$xl",
  fontWeight: "$bold",
  marginBottom: "$2",
  color: "$text",
});

const Info = styled("div", {
  fontSize: "$base",
  color: "$muted",
  marginBottom: "$1",
  span: { color: "$text", fontWeight: "$normal" },
});

const ReviewsLink = styled("a", {
  display: "inline-block",
  marginTop: "$2",
  background: "$accent",
  color: "#fff",
  padding: "0.25rem 0.75rem",
  borderRadius: "$lg",
  fontSize: "$sm",
  fontWeight: "$medium",
  textDecoration: "none",
  transition: "background 0.2s",
  "&:hover": {
    background: "#1d4ed8",
  },
});

export default async function VenueConcertsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concerts = await getConcertsByVenueSlug(slug);
  if (!concerts || concerts.length === 0)
    return <div style={{ padding: "4rem 0", textAlign: "center", color: "#6b7280", fontSize: "1.125rem" }}>No concerts found for this venue.</div>;

  return (
    <Main>
      <Heading>Concerts at this Venue</Heading>
      <ConcertList>
        {concerts.map(concert => {
          // Get main band (headliner) info
          const mainBand = concert.elements.supporting_artist.linkedItems?.[0] || null;
          const bandLogo = mainBand?.elements.band_logo?.value?.[0]?.url || "";
          const promoImage = mainBand?.elements.promotional_image?.value?.[0]?.url || concert.elements.hero_image.value[0]?.url || "";
          const bandName = mainBand?.elements.band_name?.value || concert.elements.band?.value || "";
          const bandSlug = mainBand?.elements.slug?.value || "";
          const venue = concert.elements.venue.linkedItems?.[0];
          const venueName = venue?.elements.venue_name?.value || "";
          const venueSlug = venue?.elements.venue_slug?.value || "";
          const supporting = concert.elements.supporting_artist.linkedItems?.[0];
          const supportingName = supporting?.elements.band_name?.value || "";
          const supportingSlug = supporting?.elements.slug?.value || "";
          const eventDate = concert.elements.event_date.value ? new Date(concert.elements.event_date.value).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) : 'TBA';
          return (
            <Card key={concert.system.id}>
              {/* Hero Image */}
              {promoImage && (
                <Image src={promoImage} alt={concert.elements.title.value} width={600} height={300} style={{ objectFit: 'cover', width: '100%', height: '12rem', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }} />
              )}
              <CardBody>
                <Title>{concert.elements.title.value}</Title>
                {/* Main Band Logo Centered */}
                {bandLogo && (
                  <Image src={bandLogo} alt="Band Logo" width={80} height={80} style={{ display: 'block', margin: '1.5rem auto', objectFit: 'contain', borderRadius: '50%', background: '#f3f4f6', boxShadow: '0 2px 8px #0001' }} />
                )}
                <Info>
                  Date: <span>{eventDate}</span>
                </Info>
                <Info>
                  Band: <span>{bandName}</span>
                </Info>
                <Info>
                  Venue: <a href={venueSlug ? `/venues/${venueSlug}` : '#'} style={{ color: '#2563eb', textDecoration: 'underline' }}>{venueName}</a>
                </Info>
                <Info>
                  Supporting Artist: <a href={supportingSlug ? `/bands/${supportingSlug}` : '#'} style={{ color: '#2563eb', textDecoration: 'underline' }}>{supportingName || 'None'}</a>
                </Info>
                {/* Lead Paragraph */}
                {concert.elements.lead_paragraph.value && (
                  <div style={{ fontSize: '0.95rem', color: '#444', marginTop: '0.75rem' }}>
                    <div dangerouslySetInnerHTML={{ __html: concert.elements.lead_paragraph.value }} />
                  </div>
                )}
                {/* Second Image Centered (main band promo image if available) */}
                {promoImage && (
                  <Image src={promoImage} alt="Promotional" width={400} height={200} style={{ display: 'block', margin: '2rem auto', maxWidth: '80%', borderRadius: '0.75rem', boxShadow: '0 2px 8px #0001' }} />
                )}
                {/* Body Paragraph */}
                {concert.elements.untitled_rich_text?.value && (
                  <div style={{ fontSize: '0.95rem', color: '#444', marginTop: '0.75rem' }}>
                    <div dangerouslySetInnerHTML={{ __html: concert.elements.untitled_rich_text.value }} />
                  </div>
                )}
                {/* Buy Tickets Button (centered, own line) */}
                {concert.elements.ticket_purchasing.value && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0 0.5rem 0' }}>
                    <a href={concert.elements.ticket_purchasing.value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', fontWeight: 600, background: '#2563eb', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px #2563eb22', textDecoration: 'none', textAlign: 'center', minWidth: 160 }}>
                      Buy Tickets
                    </a>
                  </div>
                )}
                {/* Read Reviews Button (centered, own line, below Buy Tickets) */}
                {concert.elements.event_date.value &&
                  new Date(concert.elements.event_date.value as string) < new Date() && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 0 0' }}>
                      <ReviewsLink href={`/concerts/${concert.elements.concert.value}/reviews`} style={{ minWidth: 160, textAlign: 'center' }}>
                        Read Reviews
                      </ReviewsLink>
                    </div>
                  )}
              </CardBody>
            </Card>
          );
        })}
      </ConcertList>
    </Main>
  );
}
