/* Vercel function: gives each article/book/author its own WhatsApp/social preview, then sends people into the app.
   Only used when SITE_CONFIG.cleanShare = true and the site is deployed on Vercel from this folder. */
const PROJECT = process.env.FIREBASE_PROJECT_ID || "knowra-12943";
function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function val(f, k) { return f && f[k] && (f[k].stringValue || ""); }
module.exports = async function handler(req, res) {
  const kind = String(req.query.kind || ""), slug = String(req.query.slug || "");
  const host = req.headers["x-forwarded-host"] || req.headers.host, base = "https://" + host + "/";
  let title = "Knowra - Knowledge for everyone", desc = "Discover knowledge, explore articles, and read books.", image = base + "assets/icon-512.png";
  try {
    if ((kind === "article" || kind === "book") && slug) {
      const body = { structuredQuery: { from: [{ collectionId: kind === "book" ? "books" : "articles" }], limit: 1, where: { compositeFilter: { op: "AND", filters: [
        { fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: slug } } },
        { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } } ] } } } };
      const r = await fetch("https://firestore.googleapis.com/v1/projects/" + PROJECT + "/databases/(default)/documents:runQuery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json(), f = j[0] && j[0].document && j[0].document.fields;
      if (f) { title = val(f, "title") + " | Knowra"; desc = val(f, "summary") || val(f, "description") || desc; }
    } else if (kind === "author" && slug) { title = slug + " on Knowra"; desc = "Read " + slug + " on Knowra."; }
  } catch (e) { /* fall back to generic preview */ }
  const target = base + "#/" + kind + "/" + encodeURIComponent(slug);
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).send('<!doctype html><html><head><meta charset="utf-8"><title>' + esc(title) + '</title><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '"><meta property="og:image" content="' + esc(image) + '"><meta property="og:site_name" content="Knowra"><meta name="twitter:card" content="summary_large_image"><meta http-equiv="refresh" content="0;url=' + esc(target) + '"></head><body><a href="' + esc(target) + '">Open on Knowra</a></body></html>');
};
