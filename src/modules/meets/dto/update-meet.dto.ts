import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetDto } from './create-meet.dto';
import { Recurrence } from 'src/modules/tasks/entities/task.entity';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { IsAfterDateBegin } from '../validators/afterDateBegin.validator';

export class UpdateMeetDto extends PartialType(CreateMeetDto) {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsDateString()
    dateBegin: Date;

    @IsNotEmpty()
    @IsDateString()
    @IsAfterDateBegin()
    dateEnding: Date;

    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;

    @ValidateIf((o) => o.isRecurring)
    @IsEnum({ 
      NONE: "",
      DAILY: "daily",
      WEEKLY: "weekly",
      MONTHLY: "monthly",
      ANNUAL: "annual",
    })
    recurrence?: Recurrence;

    @IsArray()
    @IsNumber({}, { each: true })
    MemberIdArray: number[]

    member: number;
    
    @IsString()
    linkOrLocalisation?: string;
}
