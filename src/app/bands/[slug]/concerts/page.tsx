import { getConcertsByBandSlug, getBands } from "@/utils/kontentClient";
import { styled } from "@/styles/stitches.config";
import Breadcrumbs from "../../../components/Breadcrumbs";

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
  boxShadow: "0 4px 24px 0 rgba(30, 58, 138, 0.08)",
  border: "1px solid $cardBorder",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  margin: "0",
  padding: "0",
  transition: "box-shadow 0.2s, transform 0.2s",
  alignItems: "center",
  maxWidth: "40rem",
  marginLeft: "auto",
  marginRight: "auto",
  marginBottom: "$12",
  "&:hover": {
    boxShadow: "0 8px 32px 0 rgba(30, 58, 138, 0.16)",
    transform: "translateY(-2px) scale(1.01)",
  },
});

const CardBody = styled("div", {
  padding: "$6",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: "$4",
  alignItems: "center",
  width: "100%",
  background: "linear-gradient(135deg, #f8fafc 80%, #e0e7ef 100%)",
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

const ReviewsLink = styled("a", {
  display: "inline-block",
  marginTop: "$2",
  background: "linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)",
  color: "#fff",
  padding: "0.4rem 1.1rem",
  borderRadius: "$lg",
  fontSize: "$sm",
  fontWeight: "$medium",
  textDecoration: "none",
  boxShadow: "0 2px 8px #2563eb22",
  transition: "background 0.2s, box-shadow 0.2s",
  "&:hover": {
    background: "linear-gradient(90deg, #1d4ed8 60%, #60a5fa 100%)",
    boxShadow: "0 4px 16px #2563eb33",
  },
});

export default async function BandConcertsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [concerts, bands] = await Promise.all([
    getConcertsByBandSlug(slug),
    getBands(),
  ]);
  if (!concerts || concerts.length === 0)
    return <div style={{ padding: "4rem 0", textAlign: "center", color: "#6b7280", fontSize: "1.125rem" }}>No concerts found for this band.</div>;

  return (
    <Main>
      <Breadcrumbs />
      <Heading>Concerts for this Band</Heading>
      <ConcertList>
        {concerts.map(concert => {
          // Find the main band by slug (from concert.elements.band.value)
          const mainBandSlug = concert.elements.band.value;
          const mainBand = bands.find(b => b.elements.slug.value === mainBandSlug) || null;
          const promoImage = mainBand?.elements.promotional_image?.value?.[0]?.url || concert.elements.hero_image.value[0]?.url || "";
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
                <img src={promoImage} alt={concert.elements.title.value} style={{ width: '100%', height: '16rem', objectFit: 'cover', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }} />
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
                  <StyledLink href={venueSlug ? `/venues/${venueSlug}` : '#'}
                  style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline', borderBottom: '2px solid #2563eb' }}>
                    <InfoValue>{venueName}</InfoValue>
                  </StyledLink>
                </InfoRow>
                {/* Supporting Artist (link) */}
                {supporting && (
                  <InfoRow>
                    <InfoLabel>Supporting Artist:</InfoLabel>
                    <StyledLink href={supportingSlug ? `/bands/${supportingSlug}` : '#'}
                    style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline', borderBottom: '2px solid #2563eb' }}>
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
                    // SSR-safe: extract first <img> with regex, float it, and remove from HTML string
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
