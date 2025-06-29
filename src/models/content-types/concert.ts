
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.1.2'.
* 
* (c) Kontent.ai
*  
* -------------------------------------------------------------------------------
* 
* Project: Concerts
* Environment: Production
* Id: c1ad4901-f748-000b-2b83-2c4fa51e2983
* 
* -------------------------------------------------------------------------------
**/

import type { Elements } from "@kontent-ai/delivery-sdk";
import type { CoreContentType } from "../system/index.ts";
import type { Venue, Band } from "./index.ts";

/**
 * Concert
 *
 * Id: 7c2fab10-d233-4ba8-ba85-0aa99bc2fe05
 * Codename: concert
 */
export type Concert = CoreContentType<
  ConcertElementCodenames,
  {
    /**
     * Title
     *
     * Type: text
     * Required: true
     * Codename: title
     * Id: 03e61837-7fea-45d0-bb97-46286a779361
     * Guidelines: Write a short descriptive title for the concert including the name of the headliner.
     */
    readonly title: Elements.TextElement;
    /**
     * Band
     *
     * Type: text
     * Required: false
     * Codename: band
     * Id: 67f9a7aa-1a25-48d8-be03-6feff8ae8ed4
     */
    readonly band: Elements.TextElement;
    /**
     * Event Date
     *
     * Type: date_time
     * Required: true
     * Codename: event_date
     * Id: 145bdfad-b39c-45b0-af8c-49f7066681e3
     * Guidelines: Use the date of the concert and the time doors open.
     */
    readonly event_date: Elements.DateTimeElement;
    /**
     * Venue
     *
     * Type: modular_content
     * Required: true
     * Codename: venue
     * Id: bd74db0e-8888-4192-8466-0131cc8bdfcb
     */
    readonly venue: Elements.LinkedItemsElement<Venue>;
    /**
     * Hero Image
     *
     * Type: asset
     * Required: true
     * Codename: hero_image
     * Id: 43237b01-5d6d-436a-8aeb-3fe3d6d8e1c3
     * Guidelines: Utilize the primary promotional image provided by the concert promoter, tour manager or, in the absence of these, an image from the headlining artist's press kit.
     */
    readonly hero_image: Elements.AssetsElement;
    /**
     * Lead Paragraph
     *
     * Type: rich_text
     * Required: true
     * Codename: lead_paragraph
     * Id: 39375c6d-b624-4fd9-af80-6f21985cb364
     * Guidelines: Should include the name of the headliner(s), the name of the tour, and the record the tour is promoting.
     */
    readonly lead_paragraph: Elements.RichTextElement<CoreContentType>;
    /**
     * Body Text
     *
     * Type: rich_text
     * Required: true
     * Codename: untitled_rich_text
     * Id: 34536128-b406-4f53-84fd-8aeb53cd12f1
     * Guidelines: Incorporate the most recent relevant portions of the band/artist's bio.
     */
    readonly untitled_rich_text: Elements.RichTextElement<CoreContentType>;
    /**
     * Supporting Artist
     *
     * Type: modular_content
     * Required: false
     * Codename: supporting_artist
     * Id: e87cda1f-8a3f-4d38-beb7-c016eef3fe0f
     * Guidelines: Link the support act for the concert if applicable.
     */
    readonly supporting_artist: Elements.LinkedItemsElement<Band>;
    /**
     * Ticket Purchasing
     *
     * Type: text
     * Required: true
     * Codename: ticket_purchasing
     * Id: 4d703e1a-e8f2-4a95-a262-5f631955c803
     * Guidelines: Link to purchase tickets.
     */
    readonly ticket_purchasing: Elements.TextElement;
    /**
     * slug
     *
     * Type: url_slug
     * Required: true
     * Codename: concert
     * Id: 906246ed-68a3-462b-a05f-eef34d6369f3
     */
    readonly concert: Elements.UrlSlugElement;
  },
  "concert"
>;

/**
 * Type representing all available element codenames for Concert
 */
export type ConcertElementCodenames =
  | "title"
  | "band"
  | "event_date"
  | "venue"
  | "hero_image"
  | "lead_paragraph"
  | "untitled_rich_text"
  | "supporting_artist"
  | "ticket_purchasing"
  | "concert";

/**
 * Type guard for Concert
 *
 * Id: 7c2fab10-d233-4ba8-ba85-0aa99bc2fe05
 * Codename: concert
 */
export function isConcert(
  item: CoreContentType | undefined | null,
): item is Concert {
  return item?.system?.type === "concert";
}
