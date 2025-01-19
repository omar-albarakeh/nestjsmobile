import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageWsDto {
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
