import { getConcertsByVenueSlug } from "@/utils/kontentClient";
import { styled } from "@/styles/stitches.config";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

const Main = styled('main', {
  maxWidth: '64rem',
  margin: '0 auto',
  padding: '3rem 1.5rem',
  background: 'linear-gradient(135deg, #1e293b 80%, #2563eb 100%)',
  minHeight: '80vh',
  color: '#fff',
  borderRadius: '2rem',
  boxShadow: '0 4px 32px #0003',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.5rem',
});

const Heading = styled('h1', {
  fontSize: '2.2rem',
  fontWeight: 800,
  marginBottom: '2rem',
  textAlign: 'center',
  color: '#60a5fa',
  letterSpacing: '-0.01em',
  textShadow: '0 2px 8px #0002',
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

const InfoRow = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "$6",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "$base",
  color: "$muted",
  marginBottom: "$2",
  flexWrap: "wrap",
});

const InfoLabel = styled("span", {
  color: "$muted",
  fontWeight: "$medium",
});

const InfoValue = styled("span", {
  color: "$text",
  fontWeight: "$normal",
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

const StyledLink = styled("a", {
  color: "$accent",
  textDecoration: "underline",
  fontWeight: "$medium",
  cursor: "pointer",
  "&:hover": { color: "#1d4ed8" },
});

const Paragraph = styled("div", {
  fontSize: "$base",
  color: "$text",
  margin: "1.5rem 0",
  width: "100%",
  textAlign: "left",
});

export default async function VenueConcertsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concerts = await getConcertsByVenueSlug(slug);
  if (!concerts || concerts.length === 0)
    return <div style={{ padding: "4rem 0", textAlign: "center", color: "#6b7280", fontSize: "1.125rem" }}>No concerts found for this venue.</div>;

  return (
    <Main>
      <Breadcrumbs />
      <Heading>Concerts at this Venue</Heading>
      <ConcertList>
        {concerts.map(concert => {
          // Get main band (headliner) info
          const mainBand = concert.elements.supporting_artist.linkedItems?.[0] || null;
          const promoImage = mainBand?.elements.promotional_image?.value?.[0]?.url || concert.elements.hero_image.value[0]?.url || "";
          const bandName = mainBand?.elements.band_name?.value || concert.elements.band?.value || "";
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
                <Image src={promoImage} alt={concert.elements.title.value} width={600} height={300} style={{ width: '100%', height: '16rem', objectFit: 'cover', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }} />
              )}
              <CardBody>
                {/* Concert Title */}
                <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '1.5rem 0 0.5rem 0', color: '#1e3a8a', letterSpacing: '-0.01em', textAlign: 'center' }}>{concert.elements.title.value}</h2>
                {/* Date and Time */}
                <InfoRow>
                  <InfoLabel>Date & Time:</InfoLabel>
                  <InfoValue>{eventDate}</InfoValue>
                </InfoRow>
                {/* Venue (link) */}
                <InfoRow>
                  <InfoLabel>Venue:</InfoLabel>
                  <StyledLink href={venueSlug ? `/venues/${venueSlug}` : '#'} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline', borderBottom: '2px solid #2563eb' }}>
                    <InfoValue>{venueName}</InfoValue>
                  </StyledLink>
                </InfoRow>
                {/* Band (headliner) */}
                <InfoRow>
                  <InfoLabel>Band:</InfoLabel>
                  <InfoValue>{bandName}</InfoValue>
                </InfoRow>
                {/* Supporting Artist (link) */}
                {supporting && (
                  <InfoRow>
                    <InfoLabel>Supporting Artist:</InfoLabel>
                    <StyledLink href={supportingSlug ? `/bands/${supportingSlug}` : '#'} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline', borderBottom: '2px solid #2563eb' }}>
                      <InfoValue>{supportingName}</InfoValue>
                    </StyledLink>
                  </InfoRow>
                )}
                {/* Lead Paragraph */}
                {concert.elements.lead_paragraph.value && (
                  <Paragraph dangerouslySetInnerHTML={{ __html: concert.elements.lead_paragraph.value }} />
                )}
                {/* Body Paragraph with second image (from rich text) floated left */}
                {concert.elements.untitled_rich_text?.value ? (
                  (() => {
                    const html = concert.elements.untitled_rich_text.value;
                    const imgRegex = /<img [^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/i;
                    const match = html.match(imgRegex);
                    let imgHtml = null;
                    let textHtml = html;
                    if (match) {
                      const [imgTag, src, alt] = match;
                      imgHtml = (
                        <img
                          src={src}
                          alt={alt}
                          style={{ float: 'left', margin: '0 2rem 1rem 0', maxWidth: '40%', borderRadius: '0.75rem', boxShadow: '0 2px 8px #0001', objectFit: 'cover' }}
                        />
                      );
                      textHtml = html.replace(imgTag, '');
                    }
                    return (
                      <Paragraph style={{ margin: 0, overflow: 'hidden', width: '100%' }}>
                        {imgHtml}
                        <span dangerouslySetInnerHTML={{ __html: textHtml }} />
                      </Paragraph>
                    );
                  })()
                ) : null}
                {/* Buy Tickets Button (centered, own line) */}
                {concert.elements.ticket_purchasing.value && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0 0.5rem 0' }}>
                    <StyledLink href={concert.elements.ticket_purchasing.value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', fontWeight: 600, background: '#2563eb', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px #2563eb22', textDecoration: 'none', textAlign: 'center', minWidth: 160 }}>
                      Buy Tickets
                    </StyledLink>
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
