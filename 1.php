<?php
$url = "https://www.mediafire.com/file/mdebs62owydlr11/CodexSamehwidGlobal-2.701.966.apk/file";

$html = file_get_contents($url);

libxml_use_internal_errors(true);
$dom = new DOMDocument();
$dom->loadHTML($html);
$xpath = new DOMXPath($dom);

$link = $xpath->query('//*[@id="downloadButton"]')->item(0)->getAttribute("href");

echo $link;
