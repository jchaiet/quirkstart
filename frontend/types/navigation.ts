import { NavigationItem } from "./navigationItem";
import type { Link, SanityImage } from "quirk-ui/sanity";

export interface Navigation {
  title: string;
  slug: { current: string };
  logo?: SanityImage;
  logoLink?: string;
  primaryItems: NavigationItem[];
  alignment: "left" | "center" | "right";
  utilityItems: Link[];
  variant: "standard" | "transparent";
  navigationType: "default" | "advanced";
  showSearch: boolean;
  showLocaleSelect: boolean;
  localeSelectComponent?: React.ReactNode;
  searchComponent?: React.ReactNode;
}
