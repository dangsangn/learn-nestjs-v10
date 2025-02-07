import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { UsersService } from '@/modules/users/users.service';
import { Public, ResponseMessage } from '@/decorator/metadata';
import { CreateAuthDto, VerifyCodeDto } from './dto/create-auth.dto';
import { USER_LOGIN } from '@/constants/response.message';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage(USER_LOGIN)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: CreateAuthDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('verify-code')
  async verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyCode(body);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.findOne(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}
