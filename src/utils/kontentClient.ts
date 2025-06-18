import { createDeliveryClient } from '@kontent-ai/delivery-sdk';
import type { Band } from '../models/content-types/band';
import type { Venue } from '../models/content-types/venue';
import type { ConcertReview } from '../models/content-types/concertReview';
import type { Concert } from '../models/content-types/concert';

// Kontent.ai project ID
const projectId = 'c1ad4901-f748-000b-2b83-2c4fa51e2983';

export const deliveryClient = createDeliveryClient({
  environmentId: projectId,
  // Add other config options here if needed (e.g., preview API key)
});

export async function getBands(): Promise<Band[]> {
  const response = await deliveryClient.items<Band>()
    .type('band')
    .toPromise();
  return response.data.items;
}

export async function getVenues(query: string): Promise<Venue[]> {
  const response = await deliveryClient.items<Venue>()
    .type('venue')
    .toPromise();
  console.log('Kontent.ai venue response:', response.data); // Debug log (no circular structure)
  const venues = response.data.items;
  if (!query) return venues;
  return venues.filter(venue =>
    venue.elements.venue_name.value.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getConcertReviews(query: string): Promise<ConcertReview[]> {
  let request = deliveryClient.items<ConcertReview>()
    .type('concert_review')
    .elementsParameter(['concert', 'author', 'headline', 'review_body']);
  if (query) {
    request = request.containsFilter('elements.review_body', [query]);
  }
  const response = await request.toPromise();
  return response.data.items;
}

export async function getConcerts(): Promise<Concert[]> {
  const response = await deliveryClient.items<Concert>()
    .type('concert')
    .toPromise();
  return response.data.items;
}

export async function getConcertsByVenueSlug(slug: string): Promise<Concert[]> {
  const response = await deliveryClient.items<Concert>()
    .type('concert')
    .toPromise();
  return response.data.items.filter(concert => {
    const venue = concert.elements.venue.linkedItems?.[0];
    return venue && venue.elements.venue_slug?.value === slug;
  });
}

export async function getConcertsByBandSlug(slug: string): Promise<Concert[]> {
  const response = await deliveryClient.items<Concert>()
    .type('concert')
    .toPromise();
  return response.data.items.filter(concert => {
    // Headliner
    const band = concert.elements.band?.value?.toLowerCase();
    // Supporting artist (linkedItems)
    const supporting = concert.elements.supporting_artist?.linkedItems || [];
    const isHeadliner = band === slug;
    const isSupporting = supporting.some(bandItem => bandItem.elements.slug?.value === slug);
    return isHeadliner || isSupporting;
  });
}

export async function getConcertReviewsForConcertSlug(slug: string): Promise<ConcertReview[]> {
  const response = await deliveryClient.items<ConcertReview>()
    .type('concert_review')
    .toPromise();
  const reviews = response.data.items as ConcertReview[];
  // Debug: log the full structure of the concert field for each review
  reviews.forEach(review => {
    const concert = review.elements.concert.linkedItems?.[0];
    // eslint-disable-next-line no-console
    console.log('DEBUG review id:', review.system.id, '\nconcert element:', JSON.stringify(concert, null, 2));
  });
  return reviews.filter(review => {
    const concert = review.elements.concert.linkedItems?.[0];
    const concertSlug = concert?.elements.concert?.value;
    return concertSlug === slug;
  });
}

// TEMP DEBUG: Fetch all concertReview items and log them
export async function debugFetchAllConcertReviews() {
  const response = await deliveryClient.items<ConcertReview>()
    .type('concert_review')
    .toPromise();
  // eslint-disable-next-line no-console
  console.log('DEBUG ALL concertReview items:', JSON.stringify(response.data.items, null, 2));
  return response.data.items;
}

// DEBUG: Function to print all published concert slugs and all concert reviews with their linked concert slugs
export async function debugConcertAndReviewSlugs() {
  // Fetch all published concerts
  const concertsResponse = await deliveryClient.items<Concert>()
    .type('concert')
    .toPromise();
  const concerts = concertsResponse.data.items;
  console.log('DEBUG: Published concert slugs:');
  concerts.forEach(concert => {
    console.log(`Concert: ${concert.system.name}, slug: ${concert.elements.concert.value}`);
  });

  // Fetch all published concert reviews
  const reviewsResponse = await deliveryClient.items<ConcertReview>()
    .type('concert_review')
    .toPromise();
  const reviews = reviewsResponse.data.items as ConcertReview[];
  console.log('DEBUG: Concert reviews and their linked concert slugs:');
  reviews.forEach(review => {
    const linkedConcert = review.elements.concert.linkedItems?.[0];
    const linkedConcertSlug = linkedConcert?.elements.concert?.value;
    console.log(`Review: ${review.system.name}, review slug: ${review.elements.untitled_url_slug.value}, linked concert slug: ${linkedConcertSlug}`);
  });
}
