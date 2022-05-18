import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @Transform(params => params.value.trim()) //name 앞뒤 공백 제거 후 검사
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string;
    
    
    @IsString()
    @IsEmail()
    @MaxLength(60)
    email: string;
    
    @Transform(({ value, obj }) => {
        if (obj.password.includes(obj.name.trim())) {
          throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.');
        }
        return value.trim();
      })
    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)//정규식 validation 영문대소문자와 숫자 또는 특수문자(!, @, #, $, %, ^, &, *, (, ))로 이루어진 8자 이상 30자 이하의 문자열
    password: string;
}
