/**
 * mediafire-fetch.js
 * API lấy tên file + link download trực tiếp từ MediaFire
 */

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

app.get("/api/mediafire", async (req, res) => {
  try {
    const mediafireUrl = req.query.url;
    if (!mediafireUrl) {
      return res.status(400).json({
        error: "Thiếu tham số url MediaFire",
      });
    }

    const response = await axios.get(mediafireUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Lấy link download trực tiếp
    const downloadUrl = $("#downloadButton").attr("href");

    // Lấy tên file từ biến JS
    const fileNameMatch = html.match(
      /var\s+optFileName\s*=\s*"(.+?)"/
    );
    const fileName = fileNameMatch ? fileNameMatch[1] : null;

    if (!downloadUrl || !fileName) {
      return res.status(500).json({
        error: "Không lấy được tên file hoặc link tải",
      });
    }

    res.json({
      fileName,
      downloadUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi khi fetch MediaFire",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MediaFire API chạy tại http://localhost:${PORT}`);
});
