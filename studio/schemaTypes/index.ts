/* Site */
import { siteType } from "./siteType";
import { siteSettingsType } from "./siteSettingsType";
import { navigationType } from "./navigation/navigationType";
import { navigationItemType } from "./navigation/navigationItemType";
import { navigationGroupType } from "./navigation/navigationGroupType";

import { pageType } from "./pageType";
import { pageMetadataType } from "./pageMetadataType";
import { blogPageType } from "./blogPageType";
import { docsPageType } from "./docsPageType";

/* Objects */
import { categoryType } from "./objects/categoryType";
import { headingType } from "./objects/headingType";
import { callToActionType } from "./objects/callToActionType";
import { linkType } from "./objects/linkType";
import { richTextType } from "./objects/richTextType";
import { cardType } from "./cards/cardType";
import { gridType } from "./objects/gridType";
import { dividerType } from "./objects/dividerType";
import { spacerType } from "./objects/spacerType";
import { ratingType } from "./objects/ratingType";
import { imageWithLayoutType } from "./objects/imageWithLayoutType";
import { redirectType } from "./objects/redirectType";
import { tableType } from "./objects/tableType";
import { announcementField } from "./fields/AnnouncementField";

/* Blocks */
import { heroBlockType } from "./blocks/heroBlockType";
import { cardGridBlockType } from "./blocks/cardGridBlockType";
import { carouselBlockType } from "./blocks/carouselBlockType";
import { contentBlockType } from "./blocks/contentBlockType";
import { stickyScrollBlockType } from "./blocks/stickyScrollBlockType";
import { tabsBlockType } from "./blocks/tabsBlocktType";
import { richTextBlockType } from "./blocks/richTextBlockType";
import { markdownBlockType } from "./blocks/markdownBlockType";
import { accordionBlockType } from "./blocks/accordionBlockType";
import { documentBlockType } from "./blocks/documentListBlockType";
import { featuredDocumentsBlockType } from "./blocks/featuredDocumentsBlockType";
import { quoteBlockType } from "./blocks/quoteBlockType";

/* Forms */
import { formFieldType } from "./forms/formFieldType";
import { formBlockType } from "./forms/formBlockType";
import { formStepType } from "./forms/formStepType";

/* Singletons */
import { singletonType } from "./singletonType";
import { singletonBlockType } from "./blocks/singletonBlockType";

export const schemaTypes = [
  siteType,
  siteSettingsType,
  pageType,
  pageMetadataType,
  blogPageType,
  navigationType,
  navigationItemType,
  navigationGroupType,
  docsPageType,

  categoryType,
  headingType,
  callToActionType,
  linkType,
  richTextType,
  cardType,
  gridType,
  dividerType,
  spacerType,
  ratingType,
  imageWithLayoutType,
  redirectType,
  tableType,
  announcementField,

  heroBlockType,
  cardGridBlockType,
  carouselBlockType,
  contentBlockType,
  stickyScrollBlockType,
  tabsBlockType,
  richTextBlockType,
  markdownBlockType,
  accordionBlockType,
  documentBlockType,
  featuredDocumentsBlockType,
  quoteBlockType,

  formFieldType,
  formBlockType,
  formStepType,

  singletonType,
  singletonBlockType,
];
