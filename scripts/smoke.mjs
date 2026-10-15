import assert from "node:assert/strict";

const base = process.env.SMOKE_BASE_URL ?? "http://localhost:8787";

for (const [path, status, expected] of [
  ["/", 200, "Find your next"],
  ["/venues/the-board-room-bridgnorth", 200, "Sources &amp; updates"],
  ["/venues/waterstones-telford", 200, "General retailer"],
  ["/venues/smyths-toys-telford", 200, "General retailer"],
  ["/venues/missing-venue", 404, "Place not found"],
  ["/missing-page", 404, "Place not found"],
]) {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();

  assert.equal(response.status, status, `${path} status`);

  assert.ok(html.includes(expected), `${path} server-rendered content`);

  if (status === 200) {
    const css = html.match(/href="([^"]+\.css[^\"]*)"/);

    assert.ok(css, `${path} stylesheet`);

    assert.equal(
      (await fetch(new URL(css[1].replaceAll("&amp;", "&"), base))).status,
      200,
    );
  }

  console.log(`PASS ${status} ${path}`);
}
