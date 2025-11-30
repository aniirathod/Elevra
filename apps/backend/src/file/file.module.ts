import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PdfParser } from './utils/pdf.parser';

@Module({
  controllers: [FileController],
  providers: [FileService, PdfParser],
})
export class FileModule {}
