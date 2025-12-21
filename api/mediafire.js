import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "Missing MediaFire url"
      });
    }

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/143.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html"
      },
      timeout: 15000
    });

    const html = response.data;

    const $ = cheerio.load(html);

    const downloadUrl = $("#downloadButton").attr("href");

    const fileNameMatch = html.match(
      /var\s+optFileName\s*=\s*"([^"]+)"/
    );
    const fileName = fileNameMatch?.[1];

    if (!downloadUrl || !fileName) {
      return res.status(200).json({
        error: "MediaFire layout changed or blocked",
        foundDownloadButton: !!downloadUrl,
        foundFileName: !!fileName
      });
    }

    return res.status(200).json({
      fileName,
      downloadUrl
    });

  } catch (err) {
    return res.status(500).json({
      error: "Serverless function error",
      message: err.message
    });
  }
}
