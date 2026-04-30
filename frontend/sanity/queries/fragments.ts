export const categoryFragment = `
  _id,
  title,
  slug { current }
`;

export const imageAssetFragment = `
  asset->{
    _id,
    url,
    altText,
    title,
    description
  }
`;

/**
 * Full imageWithLayout object fragment.
 * Includes all layout/sizing fields from imageWithLayoutType.ts plus
 * both asset references. Use this everywhere an imageWithLayout field
 * is queried — replaces the inconsistent mix of `...` + manual asset
 * projections across fragments.
 *
 */
export const imageWithLayoutFragment = `
  layout,
  position,
  sizing,
  maxWidth,
  aspectRatio,
  defaultImage {
    ${imageAssetFragment}
  },
  darkImage {
    ${imageAssetFragment}
  }
`;

export const linkFragment = `
  type,
  variant,
  label,
  ariaLabel,
  image {
    ...,
    defaultImage {
      ${imageAssetFragment}
    },
    darkImage {
      ${imageAssetFragment}
    }
  },
  scrollTarget,
  linkOptions {
    linkType,
    internalUrl->{
      _type,
      slug { current }
    },
    externalUrl
  },
  modalContent,
  videoUrl,
  assetUrl,
  icon,
  iconAlignment,
  displayType
`;

export const callToActionFragment = `
  items[]{
    ${linkFragment}
  },
  alignment,
  spacing,
  mobileOrientation
`;

export const documentFragment = `
  ...,
  _id,
  title,
  slug { current },
  excerpt,
  timeToRead,
  articleType,
  publishDate,
  categories[]->{
    ${categoryFragment}
  },
  featuredImage {
    ...,
    ${imageAssetFragment}
  },
  parent->{ _ref, _type, title, slug { current } }
`;

export const markdownBlockFragment = `
  _type == "markdownBlock" => {
    ...,
    content {
      code,
      language
    }
  }
`;

export const richTextFragment = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      ...,
      internalUrl->{
        _id,
        slug { current },
        title
      }
    }
  },
  _type == "image" => {
    ...,
    ${imageAssetFragment}
  }
`;

export const headingFragment = `
  eyebrow[]{
    ...,
    ${richTextFragment}
  },
  title[]{
    ...,
    ${richTextFragment}
  },
  description[]{
    ...,
    ${richTextFragment}
  },
  disclaimer[]{
    ...,
    ${richTextFragment}
  },
  animateText,
  headingLayout
`;

export const pageMetadataFragment = `
  title,
  description,
  canonicalUrl,
  keywords,
  robots,
  ogTitle,
  ogDescription,
  ogImage{
    asset->{ url }
  },
  twitterCard
`;

export const tabItemFragment = `
    ...,
    tabText[]{
      ...,
      ${richTextFragment}
    },
    tabImage {
      ${imageWithLayoutFragment}
    },
    tabLink {
      ${linkFragment}
    },
    tabGridItem[]{
      itemText[]{
        ...,
        ${richTextFragment}
      },
      itemImage {
        ${imageWithLayoutFragment}
      }
    },
    tabDisclaimer[]{
      ...,
      ${richTextFragment}
    },
    callToAction{
      ${linkFragment}
    },
`;

export const stylesFragment = `
  theme,
  orientation,
  padding,
  maxWidth,
  layout,
  background,
  imageRadius
`;

export const singletonFragment = `
  "singleton": referencedSingleton->{
    _id,
    identifier,
    title,
    blockSelection,
    "blockContent": select(
      blockSelection == "heroBlock" => blockContent.heroBlock{
        ...,
        "_type": "heroBlock",
        heading {
          ${headingFragment}
        },
        image {
          ${imageWithLayoutFragment}
        },
        callToAction{
          ${callToActionFragment}
        }
      },
      blockSelection == "contentBlock" => blockContent.contentBlock{
        ...,
        "_type": "contentBlock",
        heading {
          ${headingFragment}
        },
        image {
          ${imageWithLayoutFragment}
        },
        callToAction{
          ${callToActionFragment}
        }
      },
      blockSelection == "richTextBlock" => blockContent.richTextBlock{
        ...,
        "_type": "richTextBlock",
        heading {
          ${headingFragment}
        },
        text[]{
          ${richTextFragment}
        },
        callToAction{
          ${callToActionFragment}
        }
      },
      blockSelection == "quoteBlock" => blockContent.quoteBlock{
        ...,
        "_type": "quoteBlock",
        callToAction{
          ${callToActionFragment}
        }
      },
      blockSelection == "rating" => blockContent.rating{
        ...,
        "_type": "rating",
        image{
          ${imageWithLayoutFragment}
        },
        eyebrow[]{
          ...,
          ${richTextFragment}
        },
        rating,
        description[]{
          ...,
          ${richTextFragment}
        },
      },
    )
  }
`;

export const featuredDocumentsBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  manualDocuments[]->{
    ${documentFragment}
  },
  parentPage,
  cardStyle,
  callToAction {
    ${linkFragment}
  },
  includeFilters[]->{
    ${categoryFragment}
  },
  excludeFilters[]->{
    ${categoryFragment}
  },
  "documents": *[
    _type == ^.documentType && 
    locale == $locale &&
    site->identifier.current == $site &&
    _id != ^.^._id &&
    (!defined(^.parentPage) || parent._ref == ^.parentPage._ref) &&
    (
      (
        ^.filterMode == "any" &&
        (
          !defined(^.includeFilters) ||
          count(categories[@._ref in ^.^.includeFilters[]._ref]) > 0
        )
      ) ||
      (
        ^.filterMode == "all" &&             
        !defined(^.includeFilters) ||
        (
          count(^.includeFilters) > 0 &&
          count(categories[@._ref in ^.^.includeFilters[]._ref]) == count(coalesce(^.includeFilters, []))
        )
      )
    ) &&
    (
      !defined(^.excludeFilters) ||
      count(categories[@._ref in ^.^.excludeFilters[]._ref]) == 0
    )
  ] | order(publishDate desc)[0...25] {
    ${documentFragment}
  },
  parent->{ _ref, _type, title, slug { current } }

`;

export const accordionBlockFragment = `
 ...,
 heading {
    ${headingFragment}
  },
  callToAction {
    ${callToActionFragment}
  },
},
_type == "cardGridBlock" => {
  ...,
  callToAction {
    ${callToActionFragment}
  },
  grid {
    ...,
    items[]{
      ...,
      callToAction{
        ${linkFragment}
      }
    }
  }
`;

export const carouselBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  callToAction {
    ${callToActionFragment}
  },
  items[]{
    ...,
    image {
      ...,
      ${imageWithLayoutFragment}
    },
    callToAction{
      ${linkFragment}
    }
  },
  carouselOptions{
    ...,
    ratingSingleton->{
      blockSelection == "rating" => blockContent.rating{
        ...,
        _type,
        image{
          ${imageWithLayoutFragment}
        },
        eyebrow[]{
          ...,
          ${richTextFragment}
        },
        rating,
        description[]{
          ...,
          ${richTextFragment}
        },
      },
    },
    description[]{
      ...,
      ${richTextFragment}
    }
  }
`;

export const contentBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  image {
    ${imageWithLayoutFragment}
  },
  callToAction {
    ${callToActionFragment}
  },
`;

export const heroBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  image {
    ${imageWithLayoutFragment}
  },
  callToAction {
    ${callToActionFragment}
  },
`;

export const documentListBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  parentPage,
  categoryFilters[]->{
    ${categoryFragment}
  },
  includeFilters[]->{
    ${categoryFragment}
  },
  excludeFilters[]->{
    ${categoryFragment}
  }
`;

export const tabsBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  image {
    ...,
    ${imageWithLayoutFragment}
  },
  callToAction {
    ${callToActionFragment}
  },
  items[]{
    ...,
    ${tabItemFragment}
    content {
      ...,
      ${tabItemFragment}
    }
  }
`;

export const cardGridBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  grid {
    columns {
      xs,
      sm,
      md,
      lg,
      xl
    },
    areas,
    gap,
    autoFitMinMax,
    items[]{
      ...,
      description[] {
        ${richTextFragment}
      },
      image {
        ${imageWithLayoutFragment}
      },
      callToAction{
        ${linkFragment}
      }
    },
    className
  },
  options,
  callToAction {
    ${callToActionFragment}
  },
  styleOptions {
    ${stylesFragment}
  }
`;

export const stickyScrollBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  items[]{
    ...,
    title[] {
      ${richTextFragment}
    },
    description[] {
      ${richTextFragment}
    },
    image {
      ${imageWithLayoutFragment}
    },
    callToAction{
      ${linkFragment}
    },
    styleOptions {
      ${stylesFragment}
    }
  },
  callToAction {
    ${callToActionFragment}
  },
  styleOptions {
    ${stylesFragment}
  }
`;

export const documentListQuery = `
  {
    "documents": *[
      _type == $documentType &&
      locale == $locale &&
      site->identifier.current == $site &&
      _id != $currentId &&
      ($parentRef == null || parent._ref == $parentRef) &&
      ($includeCategories == null || count(categories[@._ref in $includeCategories]) > 0) &&
      ($excludeCategories == null || count(categories[@._ref in $excludeCategories]) == 0)
    ] | order(publishDate desc) [0...$limit] {
      ${documentFragment}
    },
    "count": count(*[
      _type == $documentType &&
      locale == $locale &&
      site->identifier.current == $site &&
      _id != $currentId &&
      ($parentRef == null || parent._ref == $parentRef) &&
      ($includeCategories == null || count(categories[@._ref in $includeCategories]) > 0) &&
      ($excludeCategories == null || count(categories[@._ref in $excludeCategories]) == 0)
    ])
  }
`;

export const formFieldFragment = `
  _key,
  fieldType,
  name { current },
  label,
  placeholder,
  helperText,
  defaultValue,
  required,
  disabled,
  width,
  useOptionGroups,
  options[]{
    label,
    value { current },
    disabled
  },
  optionGroups[]{
    label,
    options[]{
      label,
      value { current },
      disabled
    }
  },
  minLength,
  maxLength,
  pattern,
  patternMessage,
  rows,
  showCharCount,
  rangeMin,
  rangeMax,
  rangeStep,
  rangeValuePrefix,
  rangeValueSuffix,
  hiddenValue
`;

export const formBlockFragment = `
  ...,
  heading {
    ${headingFragment}
  },
  steps[]{
    _key,
    title,
    description,
    fields[]{
      ${formFieldFragment}
    }
  },
  maxWidth,
  submitLabel,
  nextLabel,
  backLabel,
  successMessage,
  errorMessage,
  submissionType,
  emailTo,
  emailSubject,
  replyTo,
  webhookUrl,
  webhookSecret,
  "successRedirectSlug": successRedirect->slug.current
`;

export const announcementFragment = `
  announcement {
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          href,
          blank
        }
      }
    },
    applyToChildren
  },
  parent->{
    announcement {
      content[]{
        ...,
        markDefs[]{
          ...,
          _type == "link" => {
            href,
            blank
          }
        }
      },
      applyToChildren
    },
    parent->{
      announcement {
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              href,
              blank
            }
          }
        },
        applyToChildren
      },
      parent->{
        announcement {
          content[]{
            ...,
            markDefs[]{
              ...,
              _type == "link" => {
                href,
                blank
              }
            }
          },
          applyToChildren
        }
      }
    }
  }
`;
