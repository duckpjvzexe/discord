const MEDIAFIRE_PROXY = "https://cors.isomorphic-git.org/";

async function fetchMediaFireInfo(url) {
    try {
        const res = await fetch(MEDIAFIRE_PROXY + url);
        if (!res.ok) throw new Error("Fetch failed");

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const name =
            html.match(/var\s+optFileName\s*=\s*"([^"]+)"/)?.[1]
            || doc.querySelector("meta[property='og:title']")?.content
            || "Unknown file";

        const download =
            doc.querySelector("#downloadButton")?.href
            || doc.querySelector("a[href*='download']")?.href;

        if (!download) throw new Error("Download link not found");

        return { name, download };
    } catch (err) {
        console.error("MediaFire fetch error:", err);
        return null;
    }
}
