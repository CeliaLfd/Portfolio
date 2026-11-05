/* Case study media live in src/assets/case-studies/ so Vite fingerprints their
   file names (/_astro/name.hash.webp): a replaced file gets a new URL, so the
   long browser cache never serves a stale version.
   Only webp/mp4 are bundled; the jpg/png originals next to them stay out of the build. */
const files = import.meta.glob<string>("../assets/case-studies/*.{webp,mp4}", {
  eager: true,
  query: "?url",
  import: "default",
});

export const asset = (name: string): string => {
  const url = files[`../assets/case-studies/${name}`];
  // Fail the build instead of shipping a broken image
  if (!url) throw new Error(`Missing asset: src/assets/case-studies/${name}`);
  return url;
};
