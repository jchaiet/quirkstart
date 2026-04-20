export const allSlugsQuery = `*[_type == "page && defined(slug.current)][]{
"slug": slug.current
}`;
