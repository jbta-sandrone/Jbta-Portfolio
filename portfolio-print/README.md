# Application portfolio — print edition

This standalone eight-page A4 document is not imported by the live application.
It adds no scene, hash, route, runtime dependency, or production bundle entry.

## Deliverables

- `Jonel_Bryan_Ablog_Portfolio.pdf` — ready-to-review application attachment.
- `index.html` + `portfolio-print.css` — standalone browser/print document.
- `generate.cjs` — reads current portfolio facts and regenerates the HTML.
- `export-pdf.cjs` — optional PDF export using an existing local Chromium
  debugging session; no browser or PDF package is installed.

## Regenerate content

From the repository root, after installing the project's existing dependencies:

```powershell
node portfolio-print/generate.cjs
```

The generator uses the project's existing TypeScript compiler to read literal
data and selected JSX copy. It does not execute scene components, change source
files, fetch remote content, or load project videos. Unsupported source changes
fail explicitly rather than silently supplying substitute facts.

Print-specific organization and headings are curated in the generator. Edit
that file, not the generated HTML, when changing the document presentation.

## Sources of truth

| Content | Existing source |
| --- | --- |
| Name and current positioning | `src/data/hero.ts` |
| Cover statement | `src/scenes/Arrival.tsx` |
| About, education, Cum Laude, career direction, focus, strengths, principles | `src/scenes/BehindTheWork.tsx` |
| Project titles, descriptors, concise summaries, Live Demo/GitHub links | `src/scenes/HallOfCreations.tsx` |
| Project capabilities, architecture, AI explanations, technology, privacy | `src/data/projectNotes.ts` |
| Six capabilities and supporting technologies | `src/scenes/QuestBoard.tsx` |
| Five technology groups and their technology names | `src/data/sceneFourTechnologyData.ts` |
| Email, GitHub, LinkedIn, résumé reference, contact copy | `src/scenes/SignalObservatory.tsx` |
| Closing statement | `src/scenes/JourneysHorizon.tsx` |
| Approved light background, ink, neutral rules, amber accent | `src/styles/professional-system.css` |

The document includes no invented roles, employers, metrics, dates, proficiency
ratings, client claims, or guarantees. It uses typography-led case studies, not
video frames or generated screenshots. Its edition year is generated at export.

## Browser export (works without automation)

1. Open `portfolio-print/index.html` directly in Chrome or Edge.
2. Select **Print / Save as PDF**, or press **Ctrl+P**.
3. Destination: **Save as PDF**.
4. Paper: **A4**; orientation: **Portrait**; scale: **100%**.
5. Margins: **None**. CSS supplies a 17 mm inset and reserves the footer space.
6. Enable **Background graphics**; disable browser **Headers and footers**.
7. Confirm the preview contains **8 pages**, then save as
   `Jonel_Bryan_Ablog_Portfolio.pdf`.

The document uses `@page`, explicit A4 sheets, intentional page breaks,
non-splitting records, restrained print typography, and numbered footers.
It is always light regardless of website or operating-system theme.

## Optional automated export

With an existing Chromium remote-debugging session running locally:

```powershell
# Default endpoint: http://127.0.0.1:9237
node portfolio-print/export-pdf.cjs

# If your existing browser uses another debugging port:
$env:PDF_CDP_URL = 'http://127.0.0.1:9222'
node portfolio-print/export-pdf.cjs
```

Requires Node 22+ for native `fetch`/`WebSocket`, not a new npm dependency.
The exporter creates and closes its own browser tab. It waits for the document
and fonts, checks page bounds/footer clearance, captures eight page proofs,
exports tagged PDF with embedded fonts, and verifies the page count and URL
annotations. Diagnostics stay in ignored `node_modules/.cache/portfolio-pdf/`.

## Portfolio URL and résumé safety

No canonical public portfolio URL is defined in the current repository. The
document therefore omits a portfolio URL and QR code rather than guessing one.
If the owner supplies a verified URL later, set `portfolioUrl` in the generator
and regenerate/export. The optional portfolio directory entry will print it.

`Jonel_Ablog_Resume.pdf` is referenced as the existing separate résumé document.
It is not modified or duplicated. A website-relative `/Jonel_Ablog_Resume.pdf`
would not be a reliable clickable destination in an uploaded PDF without a
verified public base URL, so no broken local/relative résumé hyperlink is added.

## Final review

Review all eight pages in a PDF viewer and, if physical printing matters, make
one test print. Check identity, project facts, contact details, link destinations,
and the résumé reference before submitting. External website availability and
mail handling depend on the recipient's network and PDF viewer.
