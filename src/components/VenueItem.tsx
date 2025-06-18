import Image from "next/image";
import Link from "next/link";
import type { Venue } from "../models/content-types/venue";
import type { Location } from "../models/content-types/location";

interface VenueItemProps {
  venue: Venue;
  showDetailsLink?: boolean; // Optional prop to control 'View Details' button
}

export function VenueItem({ venue, showDetailsLink = true }: VenueItemProps) {
  const heroImage = venue.elements.hero_image.value[0]?.url || "/file.svg";
  const venueName = venue.elements.venue_name.value;
  const venueSlug = venue.elements.venue_slug.value;
  // Fix: ensure location is a Location, not false
  const location = Array.isArray(venue.elements.location.linkedItems) && venue.elements.location.linkedItems[0] as Location | undefined;
  const address = location
    ? `${location.elements.street_address.value}, ${location.elements.city.value}, ${location.elements.state_province.value} ${location.elements.zipcode.value}`
    : "";
  const phone = location ? location.elements.telephone_number.value : undefined;
  const directions = location ? location.elements.directions.value : undefined;

  return (
    <div className="min-w-full m-0 p-0 relative rounded-lg shadow hover:shadow-xl transition-shadow border border-gray-200 min-h-full overflow-hidden">
      <figure className="w-full m-0 h-40 not-prose relative">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={venueName || "Venue Image"}
            width={320}
            height={160}
            className="object-cover h-full w-full m-0 p-0 rounded-t-lg"
            priority={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">No Image</div>
        )}
      </figure>
      <div className="p-4">
        <div className="font-bold text-lg mb-1">{venueName}</div>
        <div className="text-sm text-gray-600 mb-2">{address}</div>
        {phone && (
          <div className="text-sm text-gray-600 mb-2">Phone: {phone}</div>
        )}
        {directions && (
          <div className="mb-2">
            <a href={directions} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Get Directions</a>
          </div>
        )}
        {showDetailsLink && (
          <div className="mb-2">
            <Link href={`/venues/${venueSlug}`} className="text-blue-600 underline">
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

VenueItem.displayName = "VenueItem";
