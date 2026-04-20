import {
  imageAssetFragment,
  callToActionFragment,
  carouselBlockFragment,
  featuredDocumentsBlockFragment,
  markdownBlockFragment,
  accordionBlockFragment,
  contentBlockFragment,
  heroBlockFragment,
  documentListBlockFragment,
  tabsBlockFragment,
  cardGridBlockFragment,
  stickyScrollBlockFragment,
  formBlockFragment,
  richTextFragment,
  announcementFragment,
} from "./fragments";

export const pageBySlugQuery = `
  *[
    _type == "page" && 
    slug.current == $slug && 
    locale == $locale &&
    site->identifier.current == $site
  ][0] {
    ...,
    metadata { title, robots, description },
    image {
      ${imageAssetFragment}
    },
    navigationOverride->{
      "slug": slug.current,
      title
    },
    footerOverride->{
      "slug": slug.current,
      title
    },
    site->{
      _id,
      title,
      identifier,
      defaultNavigation->{
        "slug": slug.current,
        title
      },
      defaultFooter->{
        "slug": slug.current,
        title
      }
    },
    ${announcementFragment},
    pageBuilder[]{
      ...,
      callToAction {
        ${callToActionFragment}
      },
      _type == "accordionBlock" => {
        ${accordionBlockFragment}
      },
      _type == "carouselBlock" => {
        ${carouselBlockFragment}
      },
      _type == "contentBlock" => {
        ${contentBlockFragment}
      },
      _type == "heroBlock" => {
        ${heroBlockFragment}
      },
      _type == "documentListBlock" => {
        ${documentListBlockFragment}
      },
      _type == "featuredDocumentsBlock" => {
        ${featuredDocumentsBlockFragment}
      },
      _type == "markdownBlock" => {
        ${markdownBlockFragment}
      },
      _type == "formBlock" => {
        ${formBlockFragment}
      },
      _type == "tabsBlock" => {
        ${tabsBlockFragment}
      },
      _type == "cardGridBlock" => {
        ${cardGridBlockFragment}
      },
      _type == "stickyScrollBlock" => {
        ${stickyScrollBlockFragment}
      }
    }
  }
`;
