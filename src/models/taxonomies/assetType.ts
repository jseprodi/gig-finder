
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

/**
 * All taxonomy codename values for Asset Type
 *
 * Codename: asset_type
 * Id: b256f5a2-aeba-452b-8bca-adee9bf0891c
 */
export const AssetTypeValues = ["hero_image", "secondary_image"] as const;

/**
 * Type representing Asset Type taxonomy
 *
 * Codename: asset_type
 * Id: b256f5a2-aeba-452b-8bca-adee9bf0891c
 */
export type AssetType = (typeof AssetTypeValues)[number];

/**
 * Type guard for Asset Type
 *
 * Codename: asset_type
 * Id: b256f5a2-aeba-452b-8bca-adee9bf0891c
 */
export function isAssetType(
  value: string | undefined | null,
): value is AssetType {
  return (
    typeof value === "string" &&
    (AssetTypeValues as readonly string[]).includes(value)
  );
}
