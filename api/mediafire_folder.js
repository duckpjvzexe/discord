import axios from "axios";
import * as cheerio from "cheerio";

async function getDirectFromFilePage(fileUrl) {
  try {
    const res = await axios.get(fileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/143.0.0.0",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html"
      },
      timeout: 15000
    });

    const html = res.data;
    const $ = cheerio.load(html);

    const directDownloadUrl = $("#downloadButton").attr("href");

    return directDownloadUrl || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const { folderKey } = req.query;

    if (!folderKey) {
      return res.status(400).json({
        error: "Missing folderKey"
      });
    }

    const apiUrl = "https://www.mediafire.com/api/1.4/folder/get_content.php";

    let chunk = 1;
    let hasMore = true;
    let allFiles = [];

    while (hasMore) {
      const { data } = await axios.get(apiUrl, {
        params: {
          r: "cuza",
          content_type: "files",
          filter: "all",
          order_by: "name",
          order_direction: "asc",
          chunk,
          version: "1.5",
          folder_key: folderKey,
          response_format: "json"
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/143.0.0.0",
          Accept: "application/json"
        },
        timeout: 15000
      });

      const folderContent = data?.response?.folder_content;
      const files = folderContent?.files || [];

      const mapped = await Promise.all(
        files.map(async file => {
          const filePageUrl = file.links?.normal_download;
          const directDownloadUrl = filePageUrl
            ? await getDirectFromFilePage(filePageUrl)
            : null;

          return {
            fileName: file.filename,
            directDownloadUrl,
            size: Number(file.size),
            created: file.created_utc,
            downloads: Number(file.downloads)
          };
        })
      );

      allFiles.push(...mapped);

      hasMore = folderContent?.more_chunks === "yes";
      chunk++;
    }

    return res.status(200).json({
      totalFiles: allFiles.length,
      files: allFiles
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
