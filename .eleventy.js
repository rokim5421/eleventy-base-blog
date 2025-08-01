export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");

  // sisa konfigurasi lainnya...
}
export const config = {
  dir: {
    input: "content",
    includes: "../_includes",
    data: "../_data",
    output: "_site",
  },
};
