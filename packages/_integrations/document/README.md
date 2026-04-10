# @rja-integrations/document

Thin wrappers around `pdf-parse` and `mammoth` for extracting plain text from PDF and DOCX buffers. Used by the `/settings` resume upload flow.

## Exports

### `extractTextFromPdf(buffer)` — `./extract-text-from-pdf`

Async. Takes a `Buffer`, returns the concatenated plain text of all pages. Throws if the PDF is unreadable. Uses `pdf-parse@2` (a pure-TypeScript wrapper around `pdfjs-dist`).

### `extractTextFromDocx(buffer)` — `./extract-text-from-docx`

Async. Takes a `Buffer`, returns the raw text of the document. Throws if the DOCX is unreadable. Uses `mammoth.extractRawText`.

## Usage

```typescript
import { extractTextFromPdf } from "@rja-integrations/document/extract-text-from-pdf"
import { extractTextFromDocx } from "@rja-integrations/document/extract-text-from-docx"

const text = filename.endsWith(".pdf")
    ? await extractTextFromPdf(buffer)
    : await extractTextFromDocx(buffer)
```

Callers are responsible for choosing the right function based on file extension or MIME type. This package does not sniff file headers.
