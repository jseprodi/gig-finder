import { getConcertReviewsForConcertSlug } from "@/utils/kontentClient";
import { styled } from "@/styles/stitches.config";
import Link from "next/link";

const Main = styled('main', {
  maxWidth: '40rem',
  margin: '0 auto',
  padding: '$12 $4',
});

const Heading = styled('h1', {
  fontSize: '$4xl',
  fontWeight: '$bold',
  marginBottom: '$12',
  textAlign: 'center',
  color: '$heading',
  letterSpacing: '-0.01em',
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
