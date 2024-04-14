import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChoiceDto } from './create-choice.dto';

export class CreateQuestionDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsNumber()
    points: number;

    @ApiProperty()
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => CreateChoiceDto)
    choices: CreateChoiceDto[];
}
