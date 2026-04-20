import {
  imageAssetFragment,
  linkFragment,
  richTextFragment,
} from "./fragments";

export const navigationQuery = `
*[_type == "navigation" && slug.current == $slug][0]{
  ...,
  navigationType,
  navigationGroups[]{
    _id,
    _key,
    title,
    primaryItems[]{
      title,
      subtitle,
      description[]{
        ${richTextFragment}
      },
      itemType,
      internalUrl->{
        _type,
        slug
      },
      externalUrl,
      children[]{
        title,
        itemType,
        internalUrl->{
          _type,
          slug
        },
        externalUrl,
      }
    },
    secondaryItems[]{
      title,
      itemType,
      internalUrl->{
        _type,
        slug
      },
      externalUrl,
      children[]{
        title,
        itemType,
        internalUrl->{
          _type,
          slug
        },
        externalUrl,
      }
    },
    spotlight {
      title,
      description,
      image {
        ${imageAssetFragment}
      },
      callToAction {
        ${linkFragment}
      }
    }
  },
  logo {
    ...,
    defaultImage {
      ${imageAssetFragment}
    },
    darkImage {
      ${imageAssetFragment}
    }
  },
  logoLink->{
   _type,
    title,
    slug { current }
  },
  navigationItems[]{
    ...,
    _key,
    title,
    itemType,
    externalUrl,
    internalUrl->{
      _type,
      title,
      slug { current }
    },
    children[]{
      _key,
      title,
      itemType,
      externalUrl,
      internalUrl->{
       _type,
       title,
       slug { current }
      }
    }
  },
  utilityItems[]{
    ...,  
    ${linkFragment}
  }
}`;
