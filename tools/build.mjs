// Optional helper: re-minify after you edit css/ or js/.
//   npm install   (once)
//   npm run build
// It writes dist/style.min.css + dist/main.min.js and re-inlines css/critical.css
// into index.html and 404.html. The site itself needs no build to run.
import { transform } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const read = (p) => readFile(new URL(p, root), "utf8");
const write = (p, s) => writeFile(new URL(p, root), s);
const min = async (code, loader) => (await transform(code, { loader, minify: true, target: ["chrome100", "safari15", "firefox100"] })).code.trim();

await mkdir(new URL("dist/", root), { recursive: true });
const critical = await min(await read("css/critical.css"), "css");
await write("dist/style.min.css", await min(await read("css/style.css"), "css"));
await write("dist/main.min.js", await min(await read("js/main.js"), "js"));

const inject = (html, css) => html.replace(/<style id="critical">[\s\S]*?<\/style>/, () => `<style id="critical">${css}</style>`);
await write("index.html", inject(await read("index.html"), critical));
// 404 can be served from any URL depth, so its asset paths are root-absolute.
await write("404.html", inject(await read("404.html"), critical.replaceAll('url("assets/', 'url("/assets/').replaceAll("url(assets/", "url(/assets/")));

for (const f of ["dist/style.min.css", "dist/main.min.js"]) console.log(f, (await read(f)).length, "bytes");
console.log("critical css", critical.length, "bytes");
