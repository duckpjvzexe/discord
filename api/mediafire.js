import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "Thiếu tham số url MediaFire",
      });
    }

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/143.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      timeout: 15000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const downloadUrl = $("#downloadButton").attr("href");

    const fileNameMatch = html.match(
      /var\s+optFileName\s*=\s*"(.+?)"/
    );
    const fileName = fileNameMatch ? fileNameMatch[1] : null;

    if (!downloadUrl || !fileName) {
      return res.status(500).json({
        error: "Không lấy được tên file hoặc link tải",
      });
    }

    res.status(200).json({
      fileName,
      downloadUrl,
    });
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi fetch MediaFire",
      message: err.message,
    });
  }
}
