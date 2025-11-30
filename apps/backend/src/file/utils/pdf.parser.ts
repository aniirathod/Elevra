import { Injectable } from '@nestjs/common';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';

interface PdfTextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
}

const workerPath = path.resolve(
  __dirname,
  '../../../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'
);

pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

@Injectable()
export class PdfParser {
  async extract(buffer: Buffer): Promise<string> {
    // 1. Convert Buffer to Uint8Array
    const uint8 = new Uint8Array(buffer);

    // 2. Load PDF with specific Node.js options
    const loadingTask = pdfjsLib.getDocument({
      data: uint8,
      disableFontFace: true,
      useSystemFonts: true,
    });

    const doc = await loadingTask.promise;
    let fullText = '';

    for (let pageNo = 1; pageNo <= doc.numPages; pageNo++) {
      const page = await doc.getPage(pageNo);
      const content = await page.getTextContent();

      const items = content.items.filter((item): item is PdfTextItem => {
        return 'str' in item && 'transform' in item;
      });

      // 3. VISUAL SORTING
      // Now 'a' and 'b' are strictly inferred as PdfTextItem (no 'any' needed)
      items.sort((a, b) => {
        // transform[5] is Y position. Sort Descending (Top -> Bottom)
        const yDiff = b.transform[5] - a.transform[5];

        if (Math.abs(yDiff) < 5) {
          return a.transform[4] - b.transform[4];
        }
        return yDiff;
      });

      // 4. Reconstruct Text with Layout Intelligence
      let lastY = -1;
      let pageText = '';

      // Loop over the strictly typed 'items' array
      for (const item of items) {
        const currentY = item.transform[5];

        // If this is the first item, just add it
        if (lastY === -1) {
          pageText += item.str;
        } else {
          // If the vertical gap is large (>10), add a Newline
          if (Math.abs(currentY - lastY) > 10) {
            pageText += '\n' + item.str;
          }
          // Otherwise, it's on the same line, just add a space
          else {
            pageText += ' ' + item.str;
          }
        }
        lastY = currentY;
      }

      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  }
}
