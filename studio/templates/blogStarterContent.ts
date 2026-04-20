import { Template } from "sanity";

const blogStarterContent: Template = {
  id: "blogStarterContent",
  title: "Blog Article with Starter Content",
  schemaType: "blog",
  parameters: [],
  value: {
    title: "Untitled Article",
    publishDate: new Date().toISOString().split("T")[0],
    articleType: "article",
    metadata: {
      title: "Untitled Article",
      description: "A short description for SEO and previews.",
    },
    excerpt: "Write a short summary of the article here...",
    timeToRead: 3,
    pageBuilder: [
      {
        _type: "contentBlock",
        title: "Intro Section",
        content: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Start writing here...",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
      },
    ],
  },
};

export default blogStarterContent;
