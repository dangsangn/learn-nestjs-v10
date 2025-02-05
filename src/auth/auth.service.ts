import { comparePassword } from '@/helpers/hashPassword';
import { UsersService } from '@/modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateAuthDto) {
    return this.usersService.registerUser(data);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isComparePassword = await comparePassword(pass, user.password);
    if (user && isComparePassword) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
