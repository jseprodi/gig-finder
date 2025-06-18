import { getConcertReviewsForConcertSlug } from "@/utils/kontentClient";
import { styled } from "@/styles/stitches.config";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

const Main = styled('main', {
  maxWidth: '48rem',
  margin: '2rem auto',
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
  fontSize: '2.5rem',
  fontWeight: 800,
  marginBottom: '1.5rem',
  textAlign: 'center',
  color: '#60a5fa',
  letterSpacing: '-0.01em',
  textShadow: '0 2px 8px #0002',
});

const ReviewList = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
});

const Card = styled('li', {
  borderRadius: '$xl',
  border: '1px solid $cardBorder',
  background: '$card',
  boxShadow: '0 2px 8px $cardShadow',
  padding: '$8',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  transition: 'box-shadow 0.2s',
  '&:hover': {
    boxShadow: '0 4px 16px $cardShadow',
  },
});

const ReviewTitle = styled('h2', {
  fontSize: '$2xl',
  fontWeight: '$medium',
  color: '$heading',
  marginBottom: '$2',
  lineHeight: '1.2',
});

const Author = styled('div', {
  fontSize: '$sm',
  color: '$muted',
  marginBottom: '$4',
  span: { fontWeight: '$medium', color: '$text' },
});

const ReviewBody = styled('div', {
  fontSize: '$base',
  color: '$text',
  marginBottom: '$2',
});

const ConcertInfo = styled('div', {
  fontSize: '$sm',
  color: '$muted',
  marginTop: '$2',
  span: { fontWeight: '$medium', color: '$text' },
});

export default async function ConcertReviewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reviews = await getConcertReviewsForConcertSlug(slug);
  if (!reviews || reviews.length === 0) return <div style={{ padding: '4rem 0', textAlign: 'center', color: '#6b7280', fontSize: '1.125rem' }}>No reviews found for this concert.</div>;

  return (
    <Main>
      <Breadcrumbs />
      <Heading>Concert Reviews</Heading>
      <ReviewList>
        {reviews.map(review => {
          const concert = review.elements.concert.linkedItems?.[0];
          const author = review.elements.author.linkedItems?.[0];
          const authorFirst = author?.elements?.first_name?.value || "Unknown";
          const authorLast = author?.elements?.last_name?.value || "Author";
          return (
            <Card key={review.system.id}>
              <ReviewTitle>{review.elements.headline.value}</ReviewTitle>
              <Author>By <Link href={`/authors/${author?.system.id}`}><span style={{ cursor: 'pointer', color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>{authorFirst} {authorLast}</span></Link></Author>
              <ReviewBody dangerouslySetInnerHTML={{ __html: review.elements.review_body.value }} />
              {concert && (
                <ConcertInfo>Concert: <span>{concert.elements.title?.value}</span></ConcertInfo>
              )}
            </Card>
          );
        })}
      </ReviewList>
    </Main>
  );
}
