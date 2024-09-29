import { PartialType } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserPayload extends PartialType(User) {
  createdAt?: string;
  updateAt?: string;
}
