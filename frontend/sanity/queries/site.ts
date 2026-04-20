import { imageAssetFragment } from "./fragments";

export const siteQuery = `
*[_type == "site" && identifier.current == $siteId][0]{
  ...,
  logo {
    ${imageAssetFragment}
  },
  siteIcon {
    favicon {
      ${imageAssetFragment}
    },
    appleTouchIcon {
      ${imageAssetFragment}
    },
    maskIcon {
      ${imageAssetFragment}
    },
  },
  trackingScripts[]{
    _key,
    type,
    measurementId,
    customScript,
    strategy,
    enabled,
    excludePaths,
    includePaths
  },
  "site": identifier.current
}
`;
