
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
 * Visual container
 *
 * Id: 6c7119fc-b7ae-47d9-95c7-acf6dfa85ba7
 * Codename: visual_container
 */
export type VisualContainer = CoreContentType<
  VisualContainerElementCodenames,
  {
    /**
     * Title
     *
     * Type: text
     * Required: false
     * Codename: title
     * Id: 73f15933-6f48-4598-9eea-4897ef36d623
     */
    readonly title: Elements.TextElement;
    /**
     * Subtitle
     *
     * Type: text
     * Required: false
     * Codename: subtitle
     * Id: bec2069e-8acc-484e-9295-0f7dc561b98c
     */
    readonly subtitle: Elements.TextElement;
    /**
     * Items
     *
     * Type: modular_content
     * Required: false
     * Codename: items
     * Id: 9b27ba2c-6fdf-48e3-ba51-5044b0d915e1
     */
    readonly items: Elements.LinkedItemsElement<CoreContentType>;
    /**
     * Visual representation
     *
     * Type: multiple_choice
     * Required: false
     * Codename: untitled_multiple_choice
     * Id: 74a61915-f5c8-40bb-85bd-9d62971a6ebb
     */
    readonly untitled_multiple_choice: Elements.MultipleChoiceElement<
      "grid" | "stack" | "hero_unit"
    >;
  },
  "visual_container"
>;

/**
 * Type representing all available element codenames for Visual container
 */
export type VisualContainerElementCodenames =
  | "title"
  | "subtitle"
  | "items"
  | "untitled_multiple_choice";

/**
 * Type guard for Visual container
 *
 * Id: 6c7119fc-b7ae-47d9-95c7-acf6dfa85ba7
 * Codename: visual_container
 */
export function isVisualContainer(
  item: CoreContentType | undefined | null,
): item is VisualContainer {
  return item?.system?.type === "visual_container";
}
