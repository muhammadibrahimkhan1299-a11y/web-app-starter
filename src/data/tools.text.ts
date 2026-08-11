import type { Tool } from "./types";

export const textTools: Tool[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "text",
    tagline: "Live word, character and sentence counts.",
    description:
      "Count words, characters, sentences and paragraphs as you type, with reading time and keyword-free privacy. Nothing leaves your browser.",
    keywords: ["word counter", "count words", "essay word count", "character count"],
    popular: true,
    addedAt: "2024-01-13",
    about:
      "Word limits are everywhere: essays, meta descriptions, cover letters, social posts. This counter updates on every keystroke and also estimates reading and speaking time so you can size a piece of writing before you submit it.",
    howTo: [
      "Paste or type your text into the editor.",
      "Watch the live statistics update above the editor.",
      "Copy the text back out, or clear it with one tap when you are done.",
    ],
    example:
      "A 500-word blog intro reads in roughly two minutes at 250 words per minute — the pace of an average adult reader.",
    faqs: [
      { q: "How is a word counted?", a: "Any run of characters separated by whitespace counts as one word, which matches how word processors count." },
      { q: "Is my text stored?", a: "No. The editor runs entirely in your browser and nothing is uploaded or logged." },
      { q: "Does it count characters with or without spaces?", a: "Both figures are shown so you can match whichever limit you have been given." },
    ],
    related: ["character-counter", "sentence-counter", "case-converter", "remove-extra-spaces"],
    engine: { kind: "text", mode: "stats" },
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    category: "text",
    tagline: "Exact character counts with and without spaces.",
    description:
      "Count characters with and without spaces in real time — perfect for meta descriptions, SMS, bios and form limits.",
    keywords: ["character counter", "count characters", "letter count", "text length"],
    addedAt: "2024-01-13",
    about:
      "Character limits are stricter than word limits and easier to break. Search engine titles truncate near 60 characters, meta descriptions near 160, and many form fields cut off silently — this tool shows both totals as you type.",
    howTo: [
      "Type or paste the text you need to fit a limit.",
      "Read the character count with and without spaces.",
      "Trim until you are inside the limit, then copy the result.",
    ],
    example:
      "A meta description of 155 characters including spaces usually displays in full on desktop search results.",
    faqs: [
      { q: "Do emoji count as one character?", a: "Many emoji are made of multiple code units, so the count can be higher than the number of visible glyphs." },
      { q: "Which count do search engines use?", a: "Google truncates by pixel width, but character counts including spaces are a reliable proxy." },
    ],
    related: ["word-counter", "sentence-counter", "remove-extra-spaces"],
    engine: { kind: "text", mode: "stats" },
  },
  {
    slug: "sentence-counter",
    name: "Sentence Counter",
    category: "text",
    tagline: "Sentence count and average length.",
    description:
      "Count sentences in any text and see the average sentence length — a quick readability check for essays and web copy.",
    keywords: ["sentence counter", "count sentences", "average sentence length"],
    addedAt: "2024-02-18",
    about:
      "Sentence length is the single strongest lever on readability. Averaging under about 20 words keeps prose comfortable for most readers; anything consistently above 30 starts to feel dense regardless of vocabulary.",
    howTo: [
      "Paste the text you want to analyse.",
      "Read the sentence count and the average words per sentence.",
      "Split the longest sentences and watch the average drop.",
    ],
    example:
      "A 400-word passage split across 18 sentences averages 22 words per sentence — a comfortable, slightly formal pace.",
    faqs: [
      { q: "How are sentences detected?", a: "Text is split on full stops, question marks and exclamation marks followed by whitespace." },
      { q: "Do abbreviations confuse the count?", a: "Abbreviations like 'e.g.' can add a sentence boundary, so treat the number as a close estimate." },
    ],
    related: ["word-counter", "paragraph-counter", "character-counter"],
    engine: { kind: "text", mode: "stats" },
  },
  {
    slug: "paragraph-counter",
    name: "Paragraph Counter",
    category: "text",
    tagline: "Paragraph count and structure check.",
    description:
      "Count paragraphs in any document and see the average paragraph length to check the structure of your writing.",
    keywords: ["paragraph counter", "count paragraphs", "text structure"],
    addedAt: "2024-02-18",
    about:
      "On screen, paragraph length controls whether a page looks readable before a single word is read. Two to four sentences per paragraph keeps a wall of text from forming, especially on mobile.",
    howTo: [
      "Paste your document into the editor.",
      "Check the paragraph count and words per paragraph.",
      "Break up any paragraph that runs much longer than the rest.",
    ],
    example:
      "An 800-word article in 10 paragraphs averages 80 words each — roughly four sentences per block.",
    faqs: [
      { q: "What counts as a paragraph?", a: "Any block of text separated by one or more blank lines. Single line breaks are treated as part of the same paragraph." },
      { q: "Does an empty line at the end count?", a: "No, trailing blank lines are ignored." },
    ],
    related: ["sentence-counter", "word-counter", "remove-duplicate-lines"],
    engine: { kind: "text", mode: "stats" },
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    tagline: "Switch between every letter case.",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case in one click.",
    keywords: ["case converter", "change text case", "uppercase lowercase converter"],
    addedAt: "2024-01-15",
    about:
      "Text arrives in the wrong case constantly — shouty spreadsheet exports, headline styles that need normalising, database fields that want snake_case. This converter covers every common style, including programming conventions.",
    howTo: [
      "Paste the text you want to reformat.",
      "Pick a case style from the buttons.",
      "Copy the converted text, or keep switching styles to compare.",
    ],
    example:
      "\"daily tools for everyone\" becomes \"Daily Tools For Everyone\" in title case and \"daily-tools-for-everyone\" in kebab-case.",
    faqs: [
      { q: "Does title case keep small words lowercase?", a: "This tool capitalises every word. Editorial style guides differ on articles and prepositions, so review headlines by eye." },
      { q: "Will formatting be preserved?", a: "Line breaks and spacing are kept; only letter case changes." },
    ],
    related: ["uppercase-converter", "lowercase-converter", "title-case-converter", "word-counter"],
    engine: { kind: "text", mode: "case" },
  },
  {
    slug: "uppercase-converter",
    name: "Uppercase Converter",
    category: "text",
    tagline: "Turn any text into CAPITALS.",
    description:
      "Convert text to uppercase instantly, keeping line breaks and punctuation intact. Works with accented and non-Latin scripts.",
    keywords: ["uppercase converter", "text to capitals", "all caps converter"],
    addedAt: "2024-02-20",
    about:
      "Uppercase is used for labels, headers, spreadsheet keys and product codes. Conversion here is locale-aware, so accented characters such as é become É rather than being stripped.",
    howTo: ["Paste your text.", "The uppercase version appears immediately.", "Copy it with one tap."],
    example: "\"order confirmed\" becomes \"ORDER CONFIRMED\".",
    faqs: [
      { q: "Are accents preserved?", a: "Yes. The converter uses Unicode-aware casing, so ü becomes Ü." },
      { q: "Should I use all caps in headings?", a: "Sparingly — long stretches of capitals are measurably slower to read." },
    ],
    related: ["lowercase-converter", "title-case-converter", "case-converter"],
    engine: { kind: "text", mode: "upper" },
  },
  {
    slug: "lowercase-converter",
    name: "Lowercase Converter",
    category: "text",
    tagline: "Normalise text to lowercase.",
    description:
      "Convert any text to lowercase — ideal for cleaning up shouty text, email addresses, tags and URL slugs.",
    keywords: ["lowercase converter", "text to lowercase", "remove capitals"],
    addedAt: "2024-02-20",
    about:
      "Lowercasing is the first step of most text normalisation: email addresses, hashtags, URL slugs and search keys all behave better when case is consistent.",
    howTo: ["Paste the text you want to normalise.", "Read the lowercase result.", "Copy it into your form or database."],
    example: "\"Contact@Example.COM\" becomes \"contact@example.com\".",
    faqs: [
      { q: "Are email addresses case sensitive?", a: "The domain never is, and in practice almost no provider treats the local part as case sensitive — lowercasing is safe." },
      { q: "Does it change punctuation?", a: "No, only letters are affected." },
    ],
    related: ["uppercase-converter", "case-converter", "remove-extra-spaces"],
    engine: { kind: "text", mode: "lower" },
  },
  {
    slug: "title-case-converter",
    name: "Title Case Converter",
    category: "text",
    tagline: "Capitalise headlines properly.",
    description:
      "Convert text to title case, capitalising the first letter of each word — useful for headlines, product names and page titles.",
    keywords: ["title case converter", "capitalize each word", "headline case"],
    addedAt: "2024-02-21",
    about:
      "Title case is the default for English headlines, navigation labels and product names. This converter capitalises the first letter of every word and lowercases the rest, so text pasted from ALL CAPS sources comes out clean.",
    howTo: ["Paste your headline or list.", "Read the title-cased version.", "Copy it into your CMS or spreadsheet."],
    example: "\"free ONLINE tools\" becomes \"Free Online Tools\".",
    faqs: [
      { q: "What about words like 'of' and 'the'?", a: "Every word is capitalised here. If your style guide keeps short words lowercase, adjust them manually." },
      { q: "Does it handle hyphenated words?", a: "The letter after a hyphen is left as typed, so review compound names." },
    ],
    related: ["case-converter", "uppercase-converter", "word-counter"],
    engine: { kind: "text", mode: "title" },
  },
  {
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    category: "text",
    tagline: "Deduplicate any list instantly.",
    description:
      "Remove duplicate lines from a list while keeping the original order, with optional case-insensitive matching. See how many were removed.",
    keywords: ["remove duplicate lines", "deduplicate list", "unique lines tool"],
    addedAt: "2024-02-22",
    about:
      "Exported lists of emails, URLs, keywords or IDs almost always contain repeats. This tool keeps the first occurrence of each line and reports exactly how many duplicates it dropped, so you can trust the result.",
    howTo: [
      "Paste your list, one item per line.",
      "The deduplicated list appears with a count of removed lines.",
      "Copy the clean list back out.",
    ],
    example:
      "A 1,200-line keyword export reduced to 940 unique lines means 260 duplicates were removed.",
    faqs: [
      { q: "Is the original order kept?", a: "Yes. The first occurrence of each line stays where it was." },
      { q: "Are blank lines removed?", a: "Repeated blank lines collapse into one, which keeps lists tidy." },
    ],
    related: ["remove-extra-spaces", "word-counter", "paragraph-counter"],
    engine: { kind: "text", mode: "dedupe" },
  },
  {
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    category: "text",
    tagline: "Clean up messy spacing and line breaks.",
    description:
      "Collapse repeated spaces, strip trailing whitespace and tidy line breaks in copied or scanned text in one step.",
    keywords: ["remove extra spaces", "trim whitespace", "clean text tool"],
    addedAt: "2024-02-22",
    about:
      "Text copied out of PDFs, emails and web pages carries invisible mess: double spaces, tabs, non-breaking spaces and trailing whitespace that breaks alignment later. This tool normalises all of it while keeping real paragraph breaks.",
    howTo: [
      "Paste the messy text.",
      "The cleaned version appears instantly with spacing normalised.",
      "Copy it into your document.",
    ],
    example:
      "\"Hello    world  ·  today\" becomes \"Hello world · today\", and paragraph breaks are preserved.",
    faqs: [
      { q: "Are paragraph breaks kept?", a: "Yes. Blank lines between paragraphs survive; only runs of three or more are collapsed." },
      { q: "Does it remove non-breaking spaces?", a: "Yes, they are converted to normal spaces before collapsing." },
    ],
    related: ["remove-duplicate-lines", "lowercase-converter", "word-counter"],
    engine: { kind: "text", mode: "trim" },
  },
  {
    slug: "text-reverser",
    name: "Text Reverser",
    category: "text",
    tagline: "Reverse characters, words or lines.",
    description:
      "Reverse text by character, word or line — handy for puzzles, testing string handling and flipping ordered lists.",
    keywords: ["text reverser", "reverse text", "backwards text generator"],
    addedAt: "2024-02-23",
    about:
      "Reversing text is a small utility with surprisingly practical uses: flipping a chronological list, generating puzzle strings, or checking that a system handles right-to-left and palindromic input correctly.",
    howTo: ["Paste your text.", "Choose whether to reverse characters, words or lines.", "Copy the reversed output."],
    example: "\"daily tools\" reversed by character is \"sloot yliad\"; reversed by word it is \"tools daily\".",
    faqs: [
      { q: "Will emoji survive reversing?", a: "Composite emoji can break apart when reversed character by character — reverse by word if that matters." },
      { q: "Can I flip a list upside down?", a: "Yes, choose line mode to reverse the order of the lines." },
    ],
    related: ["case-converter", "remove-duplicate-lines", "word-counter"],
    engine: { kind: "text", mode: "reverse" },
  },
];
