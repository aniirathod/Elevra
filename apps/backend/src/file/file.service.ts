import { Injectable } from '@nestjs/common';
import { PdfParser } from './utils/pdf.parser';
// import { DocxParser } from './utils/docx.parser';
// import { ImageParser } from './utils/image.parser';

@Injectable()
export class FileService {
  constructor(
    private readonly pdfParser: PdfParser
    // private readonly docxParser: DocxParser,
    // private readonly imageParser: ImageParser,
  ) {}

  async extractText(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      return this.pdfParser.extract(buffer);
    }

    // if (mimetype.includes('wordprocessingml')) {
    //   return this.docxParser.extract(buffer);
    // }

    // if (mimetype.startsWith('image/')) {
    //   return this.imageParser.extract(buffer);
    // }

    throw new Error('Unsupported file type for extraction');
  }
}
