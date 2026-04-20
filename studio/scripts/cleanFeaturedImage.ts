import { client } from "../lib/client";

async function main() {
  const docs = await client.fetch(
    `*[_type == "blog" && defined(featuredImage.defaultImage)]{ _id }`,
  );

  if (!docs.length) {
    console.log(
      "No documents found with stale featuredImage.defaultImage — nothing to clean.",
    );
    return;
  }

  console.log(`Found ${docs.length} document(s) to clean:`);
  docs.forEach((doc: { _id: string; title?: string }) =>
    console.log(`  - ${doc._id} ${doc.title ? `(${doc.title})` : ""}`),
  );

  for (const doc of docs) {
    await client
      .patch(doc._id)
      .unset([
        "featuredImage.defaultImage",
        "featuredImage.darkImage",
        "featuredImage.layout",
        "featuredImage.position",
        "featuredImage.sizing",
      ])
      .commit();
    console.log(`Cleaned ${doc._id}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
