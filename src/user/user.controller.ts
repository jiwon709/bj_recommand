import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserService } from './user.service';
import { UserInfo } from './UserInfo';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto : CreateUserDto): Promise<void>{
    const {name, email, password } = dto;
    console.log(dto);
    await this.userService.createUser(name,email,password);
  }

  @Post('/email-verify')
    async verifyEmail(@Query() dto : VerifyEmailDto): Promise<string> {
        const { signupVerifyToken } = dto;

        return await this.userService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string>{
      const{ email, password } = dto;

      return await this.userService.login(email,password);
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo>{
    return await this.userService.getUserInfo(userId);
  }
    
}
