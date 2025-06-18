import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import {
  PortableText,
  PortableTextReactComponents,
  PortableTextComponentProps,
  PortableTextMarkComponentProps,
} from "@portabletext/react";
import type { TypedObject, PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { ContentChunk } from "./ContentChunk";
// Placeholder for ConcertComponent (not implemented)
const ConcertComponent = () => null;
import { CTAButton } from "./internalLinks/CTAButton";
import { InternalLink } from "./internalLinks/InternalLink";
import { BuildError } from "./ui/BuildError";
import { contentTypes } from "../models/environment/contentTypes";
import { BandItem } from "./BandItem";
import React from "react";
import type { Elements } from "@kontent-ai/delivery-sdk";
import type { CoreContentType } from "../models/system/core.type";

interface RichTextValueProps {
  element: Elements.RichTextElement<CoreContentType>;
  value: TypedObject[];
  isInsideTable: boolean;
}

// Define RichTextValue above createDefaultResolvers
const RichTextValue: React.FC<RichTextValueProps> = (props) => (
  <PortableText
    value={props.value}
    components={createDefaultResolvers(props.element, props.isInsideTable)}
  />
);

export const createDefaultResolvers = (
  element: Elements.RichTextElement<CoreContentType>,
  isElementInsideTable: boolean = false
): PortableTextReactComponents => ({
  types: {
    image: ({ value }: { value: { asset: { _ref: string; url: string } } }) => {
      const asset = element.images.find((i) => i.imageId === value.asset._ref);
      if (!asset) {
        throw new Error(`Asset ${value.asset._ref} not found.`);
      }
      if (isElementInsideTable) {
        return (
          <div className="w-28 h-14 relative not-prose">
            <Image
              src={value.asset.url}
              alt={asset.description ?? ""}
              fill
              className="object-contain"
            />
          </div>
        );
      }
      return (
        <span className="flex justify-center not-prose">
          <Image
            src={value.asset.url}
            alt={asset.description ?? ""}
            width={asset.width ?? undefined}
            height={asset.height ?? undefined}
          />
        </span>
      );
    },
    table: (props: {
      value: {
        rows: Array<{
          _key: string;
          cells: Array<{ _key: string; content: TypedObject[] }>;
        }>;
      };
    }) => {
      const { value } = props;
      return (
        <table className="table-auto">
          <tbody>
            {value.rows.map((r) => (
              <tr key={r._key}>
                {r.cells.map((c) => (
                  <td key={c._key}>
                    <RichTextValue
                      isInsideTable={true}
                      value={c.content}
                      element={element}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
    componentOrItem: (props: { value: { componentOrItem: { _ref: string } } }) => {
      const { value } = props;
      if (!Array.isArray(element.linkedItems)) {
        return (
          <BuildError>
            Embedded content could not be rendered: linked items are missing from
            the rich text element.
          </BuildError>
        );
      }
      const ref = value.componentOrItem._ref;
      const available = element.linkedItems.map((i) => i.system.codename);
      const componentItem = element.linkedItems.find(
        (i) => i.system.codename === ref
      );
      if (!componentItem) {
        return (
          <BuildError>
            Embedded content could not be rendered: component item not found
            (possibly not enough depth requested).
            <br />
            Missing codename: {ref}
            <br />
            Available: {available.join(", ")}
          </BuildError>
        );
      }
      switch (componentItem.system.type) {
        case contentTypes.band.codename: {
          const band = componentItem;
          return (
            <BandItem
              bandName={band.elements.band_name.value}
              bandLogo={band.elements.band_logo.value[0]?.url || ""}
              promotionalImage={band.elements.promotional_image.value[0]?.url || ""}
              bandBio={band.elements.band_bio as Elements.RichTextElement<CoreContentType>}
              bandMember={
                Array.isArray(band.elements.band_member.value) &&
                band.elements.band_member.value.length > 0
                  ? band.elements.band_member.value
                      .map((member) => {
                        if (
                          typeof member === "object" &&
                          member !== null &&
                          "elements" in member &&
                          member.elements &&
                          typeof member.elements === "object" &&
                          member.elements.first_name &&
                          member.elements.last_name &&
                          typeof member.elements.first_name === "object" &&
                          typeof member.elements.last_name === "object" &&
                          typeof member.elements.first_name.value === "string" &&
                          typeof member.elements.last_name.value === "string"
                        ) {
                          return `${member.elements.first_name.value} ${member.elements.last_name.value}`;
                        }
                        return "";
                      })
                      .filter((name: string) => name !== "")
                  : []
              }
              socialMedia={band.elements.social_media as Elements.RichTextElement<CoreContentType>}
              bandPlaylist={
                Array.isArray(band.elements.band_playlist.value) &&
                band.elements.band_playlist.value[0]
                  ? band.elements.band_playlist.value[0].elements.song_title.value &&
                    band.elements.band_playlist.value[0].elements.song_link.value
                    ? `${band.elements.band_playlist.value[0].elements.song_title.value} ${band.elements.band_playlist.value[0].elements.song_link.value}`
                    : ""
                  : ""
              }
              bandGenre={
                Array.isArray(band.elements.band_genre.value)
                  ? band.elements.band_genre.value
                      .map((g: unknown) => {
                        if (typeof g === "object" && g !== null && "name" in g) {
                          return g.name;
                        }
                        return "";
                      })
                      .join(", ")
                  : ""
              }
              bandSlug={band.elements.slug.value}
              bandId={band.system.id}
              detailUrl={`/bands/${band.elements.slug.value}`}
              envId={""}
            />
          );
        }
        case contentTypes.action.codename:
          return <CTAButton reference={componentItem} />;
        case contentTypes.concert.codename:
          return <ConcertComponent />;
        case contentTypes.content_chunk.codename:
          return <ContentChunk item={componentItem} />;
        default:
          return (
            <BuildError>
              Unsupported content type &quot;{componentItem.system.type}&quot;
            </BuildError>
          );
      }
    },
  },
  block: {
    h1: (props: PortableTextComponentProps<PortableTextBlock>) => <h1>{props.children}</h1>,
    h2: (props: PortableTextComponentProps<PortableTextBlock>) => <h2>{props.children}</h2>,
    h3: (props: PortableTextComponentProps<PortableTextBlock>) => <h3>{props.children}</h3>,
    h4: (props: PortableTextComponentProps<PortableTextBlock>) => <h4>{props.children}</h4>,
    h5: (props: PortableTextComponentProps<PortableTextBlock>) => <h5>{props.children}</h5>,
    h6: (props: PortableTextComponentProps<PortableTextBlock>) => <h6>{props.children}</h6>,
    blockquote: (props: PortableTextComponentProps<PortableTextBlock>) => <blockquote>{props.children}</blockquote>,
    normal: (props: PortableTextComponentProps<PortableTextBlock>) => (
      <p style={{ marginBottom: '1em', whiteSpace: 'pre-line' }}>{props.children}</p>
    ),
  },
  list: (props: PortableTextComponentProps<TypedObject>) => <ul>{props.children}</ul>,
  listItem: (props: PortableTextComponentProps<TypedObject>) => <li>{props.children}</li>,
  hardBreak: () => <br />,
  unknownMark: (props: PortableTextMarkComponentProps<TypedObject>) => <span>{props.children}</span>,
  unknownType: (props: PortableTextComponentProps<TypedObject>) => <span>{props.children}</span>,
  unknownList: (props: PortableTextComponentProps<TypedObject>) => <ul>{props.children}</ul>,
  unknownListItem: (props: PortableTextComponentProps<TypedObject>) => <li>{props.children}</li>,
  unknownBlockStyle: (props: PortableTextComponentProps<TypedObject>) => <div>{props.children}</div>,
  marks: {
    contentItemLink: (props: PortableTextMarkComponentProps<TypedObject>) => {
      const { value, children } = props;
      const link = element.links.find(
        (l) => (l as { linkId?: string }).linkId === (value as { contentItemLink?: { _ref?: string } })?.contentItemLink?._ref
      );
      if (!link) {
        throw new Error("Cannot find link reference in links. This should never happen.");
      }
      return <InternalLink link={link}>{children}</InternalLink>;
    },
    link: (props: PortableTextMarkComponentProps<TypedObject>) => {
      const { value, children } = props;
      const target = ((value as { href?: string })?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={(value as { href?: string; rel?: string; title?: string })?.href}
          target={target}
          rel={(value as { rel?: string })?.rel}
          title={(value as { title?: string })?.title}
        >
          {children}
          {(value as unknown as { [key: string]: unknown })?.["data-new-window"] ? (
            <ArrowTopRightOnSquareIcon className="w-5 inline-block ml-1" />
          ) : null}
        </a>
      );
    },
  },
});

export function RichTextElement({ element, visitedCodenames = [] }: { element: Elements.RichTextElement<CoreContentType>, visitedCodenames?: string[] }) {
  // Defensive: Only process if element.value is a string
  let valueToRender: string | null = null;
  if (typeof element?.value === "string") {
    valueToRender = element.value;
  } else if (
    element?.value &&
    typeof element.value === "object" &&
    "value" in element.value &&
    typeof (element.value as { value: string }).value === "string"
  ) {
    // Sometimes value is nested (rare, but defensive)
    valueToRender = (element.value as { value: string }).value;
  }
  if (!valueToRender || valueToRender.trim() === "") {
    // Debug log to help trace the issue
    if (element && element.value !== undefined) {
      // console.warn("RichTextElement: element.value is not a string or is empty", element.value);
    }
    return null;
  }

  // Detect if valueToRender is a single modular content object
  const modularContentMatch = valueToRender.trim().match(/^<object[^>]+data-codename=["']([^"']+)["'][^>]*><\/object>$/);
  if (modularContentMatch && Array.isArray(element.linkedItems)) {
    const codename = modularContentMatch[1];
    // Prevent infinite recursion
    if (visitedCodenames.includes(codename)) {
      return (
        <div style={{ color: 'red', background: '#fff0f0', padding: '1em', border: '1px solid #f99', borderRadius: '4px' }}>
          <strong>Rich text rendering error:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>Detected recursive modular content reference: {codename}</pre>
        </div>
      );
    }
    const referenced = element.linkedItems.find(i => i.system.codename === codename);
    if (referenced) {
      // Try to find a rich text field in the referenced item
      const richTextField = Object.values(referenced.elements).find(
        (el): el is Elements.RichTextElement<CoreContentType> =>
          el && el.type === 'rich_text' && typeof el.value === 'string' && el.value.trim() !== ''
      );
      if (richTextField) {
        // Type guard: check if referenced.elements.content is a rich text element
        const contentElement = referenced.elements.content as Elements.RichTextElement<CoreContentType> | undefined;
        const isRichText = contentElement && contentElement.type === 'rich_text';
        return (
          <RichTextElement
            element={{
              ...richTextField,
              linkedItems: isRichText ? (contentElement as Elements.RichTextElement<CoreContentType>).linkedItems : [],
              links: isRichText ? (contentElement as Elements.RichTextElement<CoreContentType>).links : [],
              images: isRichText ? (contentElement as Elements.RichTextElement<CoreContentType>).images : [],
              linkedItemCodenames: isRichText ? (contentElement as Elements.RichTextElement<CoreContentType>).linkedItemCodenames : []
            }}
            visitedCodenames={[...visitedCodenames, codename]}
          />
        );
      }
    }
  }

  // If the value looks like HTML, render it as HTML instead of using transformToPortableText
  if (/^<([a-z][\s\S]*?)>/i.test(valueToRender.trim())) {
    return (
      <div
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: valueToRender }}
      />
    );
  }

  // Extra defensive: ensure valueToRender is a string
  if (typeof valueToRender !== "string") {
    // console.error("RichTextElement: valueToRender is not a string before transformToPortableText", valueToRender, element);
    return (
      <div style={{ color: 'red', background: '#fff0f0', padding: '1em', border: '1px solid #f99', borderRadius: '4px' }}>
        <strong>Rich text rendering error:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>Band bio or rich text value is not a string. Type: {typeof valueToRender}</pre>
      </div>
    );
  }
  // Force valueToRender to be a string (defensive)
  const safeValueToRender = String(valueToRender);
  // Debug log
  // eslint-disable-next-line no-console
  // console.log("RichTextElement: calling transformToPortableText with", safeValueToRender, element);
  try {
    // transformToPortableText expects a string, not an object
    const portableTextBlocks = transformToPortableText(safeValueToRender);
    return (
      <PortableText
        value={portableTextBlocks}
        components={createDefaultResolvers({ ...element, value: safeValueToRender })}
      />
    );
  } catch (err) {
    // console.error("RichTextElement error:", err, element);
    // Show a user-friendly error in the UI for easier debugging
    return (
      <div
        style={{
          color: "red",
          background: "#fff0f0",
          padding: "1em",
          border: "1px solid #f99",
          borderRadius: "4px",
        }}
      >
        <strong>Rich text rendering error:</strong>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{String(err)}</pre>
      </div>
    );
  }
}
