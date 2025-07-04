
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

/**
 * Location
 *
 * Id: 1dcf1292-116c-4109-9e96-17ce98797ac6
 * Codename: location
 */
export type Location = CoreContentType<
  LocationElementCodenames,
  {
    /**
     * Street Address
     *
     * Type: text
     * Required: true
     * Codename: street_address
     * Id: 5999c7b3-e6b8-48e9-8cb9-47a992ac9179
     * Guidelines: Street address (1234 Some St.)
     */
    readonly street_address: Elements.TextElement;
    /**
     * City
     *
     * Type: text
     * Required: true
     * Codename: city
     * Id: 117754dc-ed1a-4d28-8b1d-dfc30dc08f21
     * Guidelines: Name of city (i.e. Someville)
     */
    readonly city: Elements.TextElement;
    /**
     * State/Province
     *
     * Type: text
     * Required: true
     * Codename: state_province
     * Id: 4bc93b7f-5066-4e3c-8818-ff48cc0e7ab4
     * Guidelines: Name of state, province, or similar organizing unit.
     */
    readonly state_province: Elements.TextElement;
    /**
     * Zipcode
     *
     * Type: text
     * Required: true
     * Codename: zipcode
     * Id: 042fab99-d7b4-49d8-af87-66ac9ea1c0a5
     * Guidelines: Zipcode or similar postal code.
     */
    readonly zipcode: Elements.TextElement;
    /**
     * Telephone Number
     *
     * Type: text
     * Required: false
     * Codename: telephone_number
     * Id: 4fd9af37-363d-4d8f-aa37-a589dec77a29
     * Guidelines: e.g. +1(111)-111-1111
     */
    readonly telephone_number: Elements.TextElement;
    /**
     * Directions
     *
     * Type: text
     * Required: false
     * Codename: directions
     * Id: f6031d2e-aaf3-488f-bc9d-9556001db7be
     * Guidelines: Include a link to google maps.
     */
    readonly directions: Elements.TextElement;
  },
  "location"
>;

/**
 * Type representing all available element codenames for Location
 */
export type LocationElementCodenames =
  | "street_address"
  | "city"
  | "state_province"
  | "zipcode"
  | "telephone_number"
  | "directions";

/**
 * Type guard for Location
 *
 * Id: 1dcf1292-116c-4109-9e96-17ce98797ac6
 * Codename: location
 */
export function isLocation(
  item: CoreContentType | undefined | null,
): item is Location {
  return item?.system?.type === "location";
}
