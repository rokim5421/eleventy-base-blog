import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import eleventyImage from "@11ty/eleventy-img";
import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
	// Tambahkan ini supaya folder /admin dibuild (untuk CMS)
	eleventyConfig.addPassthroughCopy("admin");

	// Tambahan passthrough yang sudah ada
	eleventyConfig.addPassthroughCopy({
		"./public/": "/"
	});
	eleventyConfig.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

	// Draft posts
	eleventyConfig.ignores.add("**/drafts/*");

	// Plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight);
	eleventyConfig.addPlugin(pluginNavigation);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
	});

	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}
		return array.slice(0, n);
	});

	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Shortcodes
	eleventyConfig.addAsyncShortcode("image", async (src, alt, sizes = "100vw") => {
		let metadata = await eleventyImage(src, {
			widths: [null],
			formats: ["webp", "jpeg"],
			urlPath: "/img/",
			outputDir: "./_site/img/",
		});
		let imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		};
		return eleventyImage.generateHTML(metadata, imageAttributes);
	});

	// Markdown
	let markdownLibrary = markdownIt({
		html: true
	}).use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: "after",
			class: "direct-link",
			symbol: "#",
			level: [1, 2, 3, 4],
		}),
	});
	eleventyConfig.setLibrary("md", markdownLibrary);

	// Return config
	return {
		dir: {
			input: "content",
			includes: "_includes",
			data: "_data",
			output: "_site"
		},
		templateFormats: ["md", "njk", "html"],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		passthroughFileCopy: true
	};
}
