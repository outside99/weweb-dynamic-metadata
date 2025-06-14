export default {
  async fetch(req) {
    const url = new URL(req.url);
    const m   = url.pathname.match(/^\/article-public\/(\d+)\/?$/);

    if (m) {
      const id = m[1];

      // публичный Xano-эндпоинт
      const meta = await fetch(
        `https://xdil-abvj-o7rq.e2.xano.io/api:d9B0M9b/public_content_article_metadata/${id}`
      ).then(r => r.json());

      const html = `<!doctype html><html lang="en"><head>
        <meta charset="utf-8">
        <title>${meta.title}</title>
        <meta property="og:title" content="${meta.title}">
        <meta property="og:description" content="${meta.description}">
        <meta property="og:image" content="${meta.image ?? ""}">
        <meta property="og:url" content="https://www.asymmetrixintelligence.com/article-public/${id}">
        <meta name="twitter:card" content="summary_large_image">
        <meta http-equiv="refresh" content="0;url=https://www.asymmetrixintelligence.com/article-public/${id}">
      </head><body></body></html>`;

      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    /* всё остальное – напрямую на CloudFront */
    url.hostname = "d2rmojcfi76x8t.cloudfront.net";
    return fetch(url, req);
  }
}
