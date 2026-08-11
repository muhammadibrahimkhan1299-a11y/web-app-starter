import type { Tool } from "./types";

export const imageTools: Tool[] = [
  {
    slug: "image-compressor",
    name: "Image Compressor",
    category: "image",
    tagline: "Shrink JPG, PNG and WebP files.",
    description:
      "Compress JPG, PNG and WebP images in your browser with an adjustable quality slider. See the size saved before you download.",
    keywords: ["image compressor", "compress jpg", "reduce image size", "optimise images"],
    popular: true,
    addedAt: "2024-01-26",
    about:
      "Images are usually the heaviest thing on a web page, and most photos can lose 60–80% of their file size before the difference becomes visible. Compression here happens entirely on your device using the browser's own image encoder — your files are never uploaded.",
    howTo: [
      "Drop an image onto the upload area, or tap to choose a file.",
      "Adjust the quality slider until the size and preview look right.",
      "Download the compressed image.",
    ],
    example:
      "A 4.2 MB phone photo saved at 70% quality typically lands around 620 KB — an 85% saving with no visible loss at screen size.",
    faqs: [
      { q: "Are my images uploaded to a server?", a: "No. Everything runs locally in your browser, so the file never leaves your device and there is nothing to delete afterwards." },
      { q: "Which quality setting should I use?", a: "75–80% suits photos for the web. Drop to 60% for thumbnails, and use PNG for flat graphics and screenshots with text." },
      { q: "Is there a file size limit?", a: "Files up to 15 MB work comfortably. Very large images may be slow on older phones because compression uses your device's memory." },
    ],
    related: ["image-resizer", "jpg-to-png", "png-to-jpg", "compress-pdf"],
    engine: { kind: "image", mode: "compress" },
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    category: "image",
    tagline: "Resize images to exact dimensions.",
    description:
      "Resize any image to exact pixel dimensions with optional aspect-ratio locking, then download the result instantly.",
    keywords: ["image resizer", "resize image online", "change image dimensions"],
    addedAt: "2024-01-27",
    about:
      "Serving a 4,000-pixel photo into a 800-pixel slot wastes bandwidth and hurts Core Web Vitals. Resizing to the dimensions you actually display is the single most effective image optimisation there is.",
    howTo: [
      "Upload the image you want to resize.",
      "Enter a new width — height follows automatically unless you unlock the ratio.",
      "Download the resized image.",
    ],
    example:
      "A 4032 × 3024 photo resized to 1200 px wide becomes 1200 × 900, keeping the original 4:3 ratio.",
    faqs: [
      { q: "Will resizing blur my image?", a: "Scaling down stays sharp. Scaling up cannot invent detail, so enlarging beyond the original size always softens the image." },
      { q: "Does it keep the aspect ratio?", a: "Yes by default. Unlock the ratio if you deliberately want to stretch the image." },
    ],
    related: ["image-compressor", "image-cropper", "image-converter"],
    engine: { kind: "image", mode: "resize" },
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    category: "image",
    tagline: "Convert JPG photos to lossless PNG.",
    description:
      "Convert JPG and JPEG images to PNG format in your browser — lossless output, no watermark, no upload.",
    keywords: ["jpg to png", "jpeg to png converter", "convert jpg to png"],
    addedAt: "2024-01-28",
    about:
      "PNG stores pixels losslessly and supports transparency, which makes it the right choice for logos, screenshots and any image you plan to edit repeatedly. Converting a JPG to PNG stops further generation loss, though it usually increases file size.",
    howTo: ["Upload your JPG file.", "Wait for the conversion — it is near instant.", "Download the PNG."],
    example: "A 900 KB JPG screenshot converts to a 2.1 MB PNG that survives repeated editing without artefacts.",
    faqs: [
      { q: "Will converting improve quality?", a: "No. Detail already lost to JPEG compression cannot be recovered, but PNG prevents any further loss." },
      { q: "Does the PNG have transparency?", a: "JPG has no alpha channel, so the result is fully opaque." },
    ],
    related: ["png-to-jpg", "jpg-to-webp", "image-compressor"],
    engine: { kind: "image", mode: "convert", to: "png", from: "JPG" },
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    category: "image",
    tagline: "Convert PNG to smaller JPG files.",
    description:
      "Convert PNG images to JPG with adjustable quality — a fast way to cut file size for photos and email attachments.",
    keywords: ["png to jpg", "convert png to jpeg", "png to jpg converter"],
    addedAt: "2024-01-28",
    about:
      "PNG is wasteful for photographs because it stores every pixel exactly. Converting to JPG typically cuts the size by 70% or more, at the cost of transparency, which is flattened onto a white background.",
    howTo: ["Upload the PNG file.", "Pick an output quality.", "Download the JPG."],
    example: "A 3.4 MB PNG photo saved as an 80% quality JPG comes out around 480 KB.",
    faqs: [
      { q: "What happens to transparent areas?", a: "JPG has no transparency, so transparent pixels are filled with white." },
      { q: "Which should I use on the web?", a: "JPG for photographs, PNG for graphics with text or flat colour, WebP when you want both smaller and sharper." },
    ],
    related: ["jpg-to-png", "jpg-to-webp", "image-compressor"],
    engine: { kind: "image", mode: "convert", to: "jpeg", from: "PNG" },
  },
  {
    slug: "jpg-to-webp",
    name: "JPG to WebP Converter",
    category: "image",
    tagline: "Convert JPG to modern WebP.",
    description:
      "Convert JPG images to WebP for smaller files at the same visual quality — supported by every current browser.",
    keywords: ["jpg to webp", "convert to webp", "webp converter"],
    addedAt: "2024-02-01",
    about:
      "WebP typically delivers 25–35% smaller files than JPG at equivalent quality, which is why it has become the default format for performance-focused sites. Every current browser supports it.",
    howTo: ["Upload your JPG.", "Choose the output quality.", "Download the WebP file."],
    example: "A 1.2 MB JPG hero image converts to roughly 780 KB as WebP with no perceptible difference.",
    faqs: [
      { q: "Do all browsers support WebP?", a: "Yes — every browser released in the last several years supports it, including Safari." },
      { q: "Should I keep a JPG fallback?", a: "Only if you must support very old software. For normal web use WebP alone is fine." },
    ],
    related: ["webp-to-jpg", "jpg-to-png", "image-compressor"],
    engine: { kind: "image", mode: "convert", to: "webp", from: "JPG" },
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    category: "image",
    tagline: "Convert WebP into universal JPG.",
    description:
      "Convert WebP images to JPG so they open in any editor, document or older application that does not support WebP.",
    keywords: ["webp to jpg", "convert webp", "webp to jpeg converter"],
    addedAt: "2024-02-01",
    about:
      "Images saved from modern websites often arrive as WebP, which older desktop software and some print workflows still refuse to open. Converting to JPG makes them universally usable.",
    howTo: ["Upload the WebP file.", "Choose a quality level.", "Download the JPG."],
    example: "A 240 KB WebP graphic exports as a 310 KB JPG that opens in any image editor.",
    faqs: [
      { q: "Why won't my software open WebP?", a: "Support arrived late in desktop applications. Older versions of Office and Photoshop need a plugin, so JPG is the safer format to share." },
      { q: "Does transparency survive?", a: "No. Transparent WebP areas become white in the JPG." },
    ],
    related: ["jpg-to-webp", "png-to-jpg", "image-converter"],
    engine: { kind: "image", mode: "convert", to: "jpeg", from: "WebP" },
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    category: "image",
    tagline: "Crop to exact pixel boundaries.",
    description:
      "Crop an image to precise pixel coordinates and download the result — no account, no watermark, no upload.",
    keywords: ["image cropper", "crop image online", "crop photo tool"],
    addedAt: "2024-02-03",
    about:
      "Cropping is the fastest way to improve a photo: it removes distraction and sets the aspect ratio a layout expects. Entering exact pixel values makes it repeatable across a batch of images, which drag-and-drop cropping cannot guarantee.",
    howTo: [
      "Upload the image you want to crop.",
      "Enter the offset and the width and height you want to keep.",
      "Download the cropped image.",
    ],
    example: "From a 1600 × 1200 photo, an offset of 200 × 100 with a 1200 × 675 crop yields a 16:9 banner.",
    faqs: [
      { q: "Does cropping reduce quality?", a: "No. Cropping only discards pixels outside the box; the pixels you keep are untouched." },
      { q: "What aspect ratio should I use?", a: "16:9 suits banners and video thumbnails, 1:1 suits avatars and product grids, 4:5 performs best in mobile feeds." },
    ],
    related: ["image-resizer", "image-compressor", "image-converter"],
    engine: { kind: "image", mode: "crop" },
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    category: "image",
    tagline: "Convert between JPG, PNG and WebP.",
    description:
      "Convert images between JPG, PNG and WebP with a quality control, all processed locally in your browser.",
    keywords: ["image converter", "convert image format", "jpg png webp converter"],
    addedAt: "2024-02-03",
    about:
      "One tool for every direction: pick the target format, set the quality and download. Choose JPG for photographs, PNG when you need transparency or crisp text, and WebP when file size matters most.",
    howTo: ["Upload any JPG, PNG or WebP file.", "Choose the output format and quality.", "Download the converted image."],
    example: "A 2.6 MB PNG product shot converted to WebP at 80% quality typically lands under 300 KB.",
    faqs: [
      { q: "Which format is best for the web?", a: "WebP for photos and most graphics; PNG when you need transparency with hard edges." },
      { q: "Can I convert several images at once?", a: "Files are converted one at a time today. Batch processing is planned as a premium feature." },
    ],
    related: ["image-compressor", "jpg-to-webp", "png-to-jpg", "image-resizer"],
    engine: { kind: "image", mode: "convert" },
  },
];

export const pdfTools: Tool[] = [
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    tagline: "Reduce PDF file size for email.",
    description:
      "Compress PDF files in your browser by cleaning and re-encoding the document structure. See the size saved before downloading.",
    keywords: ["compress pdf", "reduce pdf size", "pdf compressor online"],
    popular: true,
    addedAt: "2024-01-29",
    about:
      "PDFs balloon because of duplicated fonts, unused objects and leftover revision history. This tool rebuilds the document with object streams and drops unreferenced data, which shrinks most text-heavy and exported PDFs without touching page content.",
    howTo: [
      "Drop your PDF onto the upload area.",
      "Press Compress and wait for the progress bar to finish.",
      "Compare the original and new size, then download.",
    ],
    example:
      "A 9.8 MB report exported from a word processor often drops to about 6 MB once redundant objects are removed.",
    faqs: [
      { q: "Is my PDF uploaded anywhere?", a: "No. The file is processed in your browser and discarded from memory as soon as you leave the page." },
      { q: "Why didn't my PDF get smaller?", a: "If the size is dominated by high-resolution scanned images there is little structural waste to remove. Compress the images first, then rebuild the PDF." },
      { q: "What is the size limit?", a: "PDFs up to 25 MB are supported. Larger files depend on your device's available memory." },
    ],
    related: ["merge-pdf", "split-pdf", "pdf-to-jpg", "image-compressor"],
    engine: { kind: "pdf", mode: "compress" },
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    tagline: "Combine several PDFs into one.",
    description:
      "Merge multiple PDF files into a single document in the order you choose — private, browser-based and free.",
    keywords: ["merge pdf", "combine pdf files", "join pdf online"],
    popular: false,
    addedAt: "2024-01-29",
    about:
      "Scanned contracts, invoices and application packs almost always arrive as separate files. Merging them into one document keeps page order fixed and makes the bundle far easier to send, sign and archive.",
    howTo: [
      "Select two or more PDF files, or drop them in together.",
      "Reorder them if needed — the list is the final page order.",
      "Press Merge and download the combined PDF.",
    ],
    example: "Three 4-page scans merge into one 12-page PDF, with page 1 of the first file becoming page 1 of the result.",
    faqs: [
      { q: "How many files can I merge?", a: "Up to 20 files at once, subject to your device's memory." },
      { q: "Are bookmarks and form fields kept?", a: "Page content is preserved exactly. Interactive form fields and bookmarks may not survive the merge." },
    ],
    related: ["split-pdf", "compress-pdf", "pdf-page-extractor"],
    engine: { kind: "pdf", mode: "merge" },
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    tagline: "Split a PDF at any page.",
    description:
      "Split a PDF into two documents at any page number, or export a page range as a new file. Runs entirely in your browser.",
    keywords: ["split pdf", "separate pdf pages", "divide pdf online"],
    addedAt: "2024-01-30",
    about:
      "Splitting is what you need when only part of a document should be shared — one chapter from a manual, one invoice from a monthly batch, or the signature page of a long contract.",
    howTo: [
      "Upload the PDF you want to split.",
      "Enter the page to split after.",
      "Download the two resulting documents.",
    ],
    example: "Splitting a 40-page PDF after page 12 gives one file with pages 1–12 and another with pages 13–40.",
    faqs: [
      { q: "Is the original file changed?", a: "No. New documents are generated and your original file is untouched." },
      { q: "Can I extract non-consecutive pages?", a: "Yes — use the PDF page extractor and list the pages you want." },
    ],
    related: ["merge-pdf", "pdf-page-extractor", "compress-pdf"],
    engine: { kind: "pdf", mode: "split" },
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "pdf",
    tagline: "Export PDF pages as images.",
    description:
      "Convert PDF pages to JPG images at your chosen scale and download them individually. Processed locally in your browser.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf pages to jpg"],
    addedAt: "2024-01-31",
    about:
      "Turning pages into images is useful when a PDF has to be embedded somewhere that will not render PDFs — a slide deck, a chat message, a website or a social post. Each page is rendered at the scale you pick and saved as a separate JPG.",
    howTo: [
      "Upload your PDF.",
      "Choose a rendering scale — higher means sharper and larger files.",
      "Download each page as a JPG.",
    ],
    example: "A 5-page PDF rendered at 2× scale produces five JPGs around 1,700 pixels wide.",
    faqs: [
      { q: "Will the text still be selectable?", a: "No. Images are pixels, so text becomes part of the picture. Keep the PDF if you need selectable text." },
      { q: "What scale should I choose?", a: "1× for quick previews, 2× for on-screen sharing, 3× when the image will be printed." },
    ],
    related: ["jpg-to-pdf", "compress-pdf", "image-compressor"],
    engine: { kind: "pdf", mode: "pdf-to-jpg" },
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "pdf",
    tagline: "Turn photos into one PDF.",
    description:
      "Combine JPG and PNG images into a single PDF document, one image per page, in the order you select them.",
    keywords: ["jpg to pdf", "images to pdf", "photo to pdf converter"],
    addedAt: "2024-01-31",
    about:
      "Phone photos of receipts, ID documents or handwritten notes are far easier to submit as a single PDF than as a folder of images. Each image becomes one page sized to its own dimensions, so nothing is cropped.",
    howTo: [
      "Select the images you want to include.",
      "Check the order in the file list.",
      "Press Create PDF and download the document.",
    ],
    example: "Four receipt photos become a single 4-page PDF, each page matching its photo's proportions.",
    faqs: [
      { q: "Which image formats are supported?", a: "JPG and PNG. Convert other formats to JPG first with the image converter." },
      { q: "Can I set a page size like A4?", a: "Pages currently match each image's dimensions, which avoids unwanted cropping or letterboxing." },
    ],
    related: ["pdf-to-jpg", "merge-pdf", "image-compressor"],
    engine: { kind: "pdf", mode: "jpg-to-pdf" },
  },
  {
    slug: "pdf-page-extractor",
    name: "PDF Page Extractor",
    category: "pdf",
    tagline: "Pull specific pages into a new PDF.",
    description:
      "Extract chosen pages or page ranges from a PDF into a new document — for example 1, 4-6, 9 — in one step.",
    keywords: ["pdf page extractor", "extract pdf pages", "pdf page selector"],
    addedAt: "2024-02-04",
    about:
      "Extraction is split's precise sibling: instead of cutting a document in two, you list exactly the pages you want. It is the quickest way to isolate the pages of a long report that a colleague actually needs.",
    howTo: [
      "Upload the source PDF.",
      "Type the pages you want, for example 1, 4-6, 9.",
      "Download the new PDF containing just those pages.",
    ],
    example: "From a 30-page report, entering 1, 4-6, 30 produces a 5-page PDF in that exact order.",
    faqs: [
      { q: "Does the order of my list matter?", a: "Yes. Pages appear in the order you list them, so you can reorder while extracting." },
      { q: "What if I enter a page that does not exist?", a: "Out-of-range pages are ignored and you will be told how many pages were extracted." },
    ],
    related: ["split-pdf", "merge-pdf", "compress-pdf"],
    engine: { kind: "pdf", mode: "extract" },
  },
];

export const linkTools: Tool[] = [
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "links",
    tagline: "QR codes for links, Wi-Fi and contacts.",
    description:
      "Generate free QR codes for URLs, text, email, phone, Wi-Fi and contact cards. Download as PNG or SVG — no account needed.",
    keywords: ["qr code generator", "free qr code", "wifi qr code", "vcard qr code"],
    popular: true,
    addedAt: "2024-02-06",
    about:
      "A QR code is just an encoded string, which is why the content type matters: a Wi-Fi code uses a specific WIFI: syntax, a contact card uses vCard, and a phone number uses a tel: URI. This generator builds the correct payload for each type so any camera app handles it properly.",
    howTo: [
      "Choose what the code should contain — a link, text, email, phone, Wi-Fi or contact details.",
      "Fill in the fields and adjust size or error correction if you need to.",
      "Download the QR code as a PNG or a scalable SVG.",
    ],
    example:
      "A Wi-Fi QR code encodes WIFI:T:WPA;S:CafeGuest;P:latte2026;; so guests connect by pointing their camera at it.",
    faqs: [
      { q: "Do these QR codes expire?", a: "No. The data is encoded directly in the image, so it works forever and does not depend on our servers." },
      { q: "Which error correction level should I pick?", a: "Level M suits screens and clean prints. Choose Q or H for stickers, labels or anything that may get scuffed." },
      { q: "Should I use PNG or SVG?", a: "PNG for screens and quick sharing, SVG for print because it scales to any size without pixelation." },
    ],
    related: ["link-shortener", "image-compressor", "image-converter"],
    engine: { kind: "qr" },
  },
  {
    slug: "link-shortener",
    name: "Link Shortener",
    category: "links",
    tagline: "Short, shareable links with click stats.",
    description:
      "Shorten long URLs into clean short links with an optional custom slug, copy or QR them instantly, and track clicks when signed in.",
    keywords: ["link shortener", "url shortener", "short link generator", "custom short url"],
    popular: true,
    addedAt: "2024-02-07",
    about:
      "Long URLs break in print, get mangled in messages and hide where a link actually goes. A short link fixes all three, and because every visit passes through it you also get a reliable click count — something a raw URL can never give you.",
    howTo: [
      "Paste the long URL you want to share.",
      "Optionally set a custom slug so the link reads the way you want.",
      "Press Shorten, then copy the link, open it, or grab its QR code.",
    ],
    example:
      "A long product URL with tracking parameters becomes a link like /myproduct that is easy to say out loud and safe to print.",
    faqs: [
      { q: "Do I need an account?", a: "No. Anyone can shorten links without signing up. Creating a free account simply saves your links and unlocks click analytics." },
      { q: "Can I choose my own short link?", a: "Yes — enter a custom slug of 3 to 32 characters using letters, numbers and hyphens. Slugs are unique and system paths are reserved." },
      { q: "Do short links expire?", a: "No. Links stay active until you delete them, or until they are disabled for abuse." },
      { q: "Which links are not allowed?", a: "Malware, phishing, spam and illegal content are prohibited. Every short link can be reported and abusive links are disabled." },
    ],
    related: ["qr-code-generator", "word-counter", "image-compressor"],
    engine: { kind: "shortener" },
  },
];
