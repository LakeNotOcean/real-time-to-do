import { ApiProperty } from '@nestjs/swagger';

export class ResultDto {
  constructor(id: string | number, isSuccess: boolean, errorCode?: string) {
    this.id = id;
    this.isSuccess = isSuccess;
    this.errorCode = errorCode;
  }
  @ApiProperty({ required: true })
  id: string | number;
  @ApiProperty({ required: true })
  isSuccess: boolean;
  @ApiProperty({ required: true })
  errorCode?: string;
}
