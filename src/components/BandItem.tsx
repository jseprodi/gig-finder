import Image from "next/image";
import Link from "next/link";
import { RichTextElement } from "./RichTextElement";

type Props = Readonly<{
  bandName: string;
  bandLogo: string;
  promotionalImage: string;
  bandBio: import("@kontent-ai/delivery-sdk").Elements.RichTextElement<import("../models/system/core.type").CoreContentType>;
  bandMember: string[];
  socialMedia: import("@kontent-ai/delivery-sdk").Elements.RichTextElement<import("../models/system/core.type").CoreContentType>;
  bandPlaylist: string;
  bandGenre: string;
  bandSlug: string;
  bandId: string;
  detailUrl: string;
  envId: string;
  variant?: "detail" | "list";
}>;

/**
 * Renders a single band item for a listing page, displaying the band's name, genre, logo, promotional image, and a detail button.
 *
 * @component
 * @param props - The properties for the BandItem component.
 * @param props.bandId - The unique identifier for the band, used by StandaloneSmartLinkButton.
 * @param props.bandName - The name of the band to display.
 * @param props.bandGenre - The genre of the band to display.
 * @param props.bandLogo - The URL of the band's logo image.
 * @param props.promotionalImage - The URL of the band's promotional image.
 * @param props.detailUrl - The URL to the band's detail page.
 *
 * @returns A list item element containing band information and a link to the detail page.
 */
export function BandItem(props: Props) {
  const isDetail = props.variant === "detail";
  if (isDetail) {
    return (
      <section className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900/90 to-gray-800/80 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden mt-8 mb-12">
        <figure className="w-full aspect-[16/7] relative">
          {props.promotionalImage ? (
            <Image
              src={props.promotionalImage}
              alt={props.bandName || 'Promotional Image'}
              width={1200}
              height={400}
              className="object-cover w-full h-full rounded-t-2xl"
              priority={false}
              style={{ objectPosition: 'center' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-700 text-gray-400">No Image</div>
          )}
        </figure>
        <div className="flex flex-col gap-8 px-8 py-10">
          <h2 className="font-extrabold text-4xl text-center text-white tracking-tight mb-2">{props.bandName}</h2>
          <div className="text-lg text-gray-100 text-center mb-2">{props.bandGenre}</div>
          <div className="text-base text-gray-200 text-center mb-4">
            <span className="font-semibold">Members:</span> {Array.isArray(props.bandMember) ? props.bandMember.join(", ") : ""}
          </div>
          {props.socialMedia && props.socialMedia.value && (
            <div className="prose prose-invert mx-auto text-center text-base max-w-none bg-gray-900/40 rounded-lg p-4 mb-4">
              <RichTextElement element={props.socialMedia} />
            </div>
          )}
          <article className="prose prose-invert mx-auto text-left text-base max-w-none bg-gray-900/60 rounded-lg p-6 mb-4">
            {props.bandBio && props.bandBio.value && <RichTextElement element={props.bandBio} />}
          </article>
          {props.bandPlaylist && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="font-semibold text-gray-100">Playlist:</span>
              {(() => {
                const [title, url] = props.bandPlaylist.split(/ (https?:\/\/\S+)/);
                return url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-bold text-xl hover:text-blue-300 transition-colors">{title.trim()}</a>
                ) : (
                  <span className="text-gray-200 text-lg">{props.bandPlaylist}</span>
                );
              })()}
            </div>
          )}
        </div>
      </section>
    );
  }
  // List/search variant (modern card style)
  return (
    <div className="min-w-full m-0 p-0 relative rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer min-h-full overflow-hidden transition-shadow hover:shadow-2xl">
      <figure className="w-full m-0 h-40 not-prose relative">
        {props.promotionalImage ? (
          <Image
            src={props.promotionalImage}
            alt={props.bandName || 'Promotional Image'}
            width={320}
            height={160}
            className="object-cover h-full w-full m-0 p-0 rounded-t-2xl"
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">No Image</div>
        )}
      </figure>
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-1">
          {props.bandLogo ? (
            <Image src={props.bandLogo} alt={props.bandName || 'Band Logo'} width={40} height={40} className="object-contain rounded-full border bg-white" />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 border">No Logo</div>
          )}
          <div className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">{props.bandName}</div>
        </div>
        <div className="text-xs text-gray-500 mb-1">{props.bandGenre}</div>
        <div className="text-xs text-gray-500 mb-1">Members: {Array.isArray(props.bandMember) ? props.bandMember.join(", ") : ""}</div>
        {props.bandBio && props.bandBio.value && (
          <div className="m-0 text-gray-700 dark:text-gray-300 text-sm not-prose line-clamp-3"> <RichTextElement element={props.bandBio} /> </div>
        )}
        {props.bandPlaylist && (
          <div className="mb-1 text-gray-700 dark:text-gray-300 text-xs truncate">Playlist: {props.bandPlaylist}</div>
        )}
        <div className="mt-2">
          <Link href={props.detailUrl} className="group-hover:bg-mainColorHover bg-mainButtonColor text-white block ml-auto w-fit font-semibold hover:bg-mainHoverColor border py-2 px-4 rounded-lg text-xs shadow transition-colors">Detail</Link>
        </div>
      </div>
    </div>
  );
}

BandItem.displayName = "ListItem";
