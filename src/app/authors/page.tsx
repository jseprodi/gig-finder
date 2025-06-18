import { getConcertReviews } from "@/utils/kontentClient";
import { styled } from "@/styles/stitches.config";
import Link from "next/link";
import type { Person } from "@/models/content-types/person";
import Breadcrumbs from "../../components/Breadcrumbs";

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

const AuthorList = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
});

const AuthorCard = styled('li', {
  borderRadius: '$xl',
  border: '1px solid $cardBorder',
  background: '$card',
  boxShadow: '0 2px 8px $cardShadow',
  padding: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  transition: 'box-shadow 0.2s',
  '&:hover': {
    boxShadow: '0 4px 16px $cardShadow',
  },
});

const AuthorName = styled('span', {
  fontWeight: '$bold',
  color: '$heading',
  fontSize: '$lg',
});

export default async function AuthorsListPage() {
  // Get all reviews, extract all unique authors with vocation 'Author'
  const reviews = await getConcertReviews("");
  const authorsMap = new Map<string, Person>();
  for (const review of reviews) {
    const author = review.elements.author.linkedItems?.[0];
    if (
      author &&
      author.elements.vocation?.value?.some((v: unknown) => typeof v === 'string' && v.toLowerCase().includes('author'))
    ) {
      authorsMap.set(author.system.id, author);
    }
  }
  const authors = Array.from(authorsMap.values());
  if (authors.length === 0) return <div style={{ padding: '4rem 0', textAlign: 'center', color: '#6b7280', fontSize: '1.125rem' }}>No authors found.</div>;

  return (
    <Main>
      <Breadcrumbs />
      <Heading>Concert Review Authors</Heading>
      <AuthorList>
        {authors.map(author => (
          <AuthorCard key={author.system.id}>
            <Link href={`/authors/${author.system.id}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>
              <AuthorName>{author.elements.first_name.value} {author.elements.last_name.value}</AuthorName>
            </Link>
          </AuthorCard>
        ))}
      </AuthorList>
    </Main>
  );
}
