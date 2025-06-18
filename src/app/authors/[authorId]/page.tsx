import { getConcertReviews } from "@/utils/kontentClient";
import { getPersonById } from "@/utils/getPersonById";
import { styled } from "@/styles/stitches.config";

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

export default async function AuthorReviewsPage({ params }: { params: Promise<{ authorId: string }> }) {
  const { authorId } = await params;
  // Get author details directly from Kontent by id
  const author = await getPersonById(authorId);
  const authorFirst = author?.elements?.first_name?.value || "Unknown";
  const authorLast = author?.elements?.last_name?.value || "Author";
  const vocationTerm = author?.elements?.vocation?.value?.[0];
  const vocation = typeof vocationTerm === 'string' ? vocationTerm : vocationTerm?.name || vocationTerm?.codename || '';

  // Fetch all reviews and filter by author system.id
  const allReviews = await getConcertReviews("");
  const reviews = allReviews.filter(review => {
    const authorLinked = review.elements.author.linkedItems?.[0];
    return authorLinked && String(authorLinked.system.id).trim() === String(authorId).trim();
  });
  // Do not return early if no reviews, always show author details

  return (
    <Main>
      <Heading>Reviews by {authorFirst} {authorLast}</Heading>
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
        {vocation && <span style={{ color: '#2563eb', fontWeight: 600 }}>{vocation}</span>}
      </div>
      {reviews.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: '#6b7280', fontSize: '1.125rem' }}>No reviews found for this author.</div>
      ) : (
        <ReviewList>
          {reviews.map(review => {
            const concert = review.elements.concert.linkedItems?.[0];
            return (
              <Card key={review.system.id}>
                <ReviewTitle>{review.elements.headline.value}</ReviewTitle>
                <ReviewBody dangerouslySetInnerHTML={{ __html: review.elements.review_body.value }} />
                {concert && (
                  <ConcertInfo>Concert: <span>{concert.elements.title?.value}</span></ConcertInfo>
                )}
              </Card>
            );
          })}
        </ReviewList>
      )}
    </Main>
  );
}
