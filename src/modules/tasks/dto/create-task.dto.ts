import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, isInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Recurrence } from "../entities/task.entity";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsDateString()
    dateBegin: Date;

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
}
