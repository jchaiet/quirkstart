import { imageAssetFragment } from "./fragments";

export const siteSettingsQuery = `
*[_type == "siteSettings"][0]{
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
  }
}
`;
