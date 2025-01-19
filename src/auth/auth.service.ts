import { comparePassword } from '@/helpers/hashPassword';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    console.log('user:', user);
    const payload = { username: user.email, sub: user._id };
    console.log(111, this.jwtService.sign(payload));
    return {
      access_token: this.jwtService.sign(payload),
    };
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
