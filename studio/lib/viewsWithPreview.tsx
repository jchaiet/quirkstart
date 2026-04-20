import React from "react";
import { ViewBuilder, StructureBuilder } from "sanity/structure";

import { EyeOpenIcon } from "@sanity/icons";

export const viewsWithPreview = (S: StructureBuilder): ViewBuilder[] => {
  return [
    //Form view
    S.view.form(),

    //Live preview
    S.view
      .component(({ document }) => {
        const slug = document?.displayed?.slug?.current;
        const previewUrl = slug
          ? `https://example.com/preview/${slug}`
          : `https://example.com/preview`;

        return (
          <iframe
            src={previewUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        );
      })
      .title("Preview")
      .icon(EyeOpenIcon),
  ];
};
