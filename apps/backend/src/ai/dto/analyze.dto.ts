import { IsString, IsNotEmpty } from 'class-validator';

export class AnalyzeDto {
  @IsString()
  @IsNotEmpty()
  resumeText: string;

  @IsString()
  @IsNotEmpty()
  jdText: string;
}
