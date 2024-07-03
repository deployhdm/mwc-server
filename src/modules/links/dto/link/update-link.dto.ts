import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    link: string
}
