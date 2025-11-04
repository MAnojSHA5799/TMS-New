import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Register new user
  async register(registerDto: RegisterDto) {
    const { username, email, password, tenant_id } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      email,
      password_hash: hashedPassword, // ✅ correct field
      tenant_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedUser = await this.usersRepository.save(newUser);

    return {
      message: 'User registered successfully',
      user: {
        user_id: savedUser.user_id,
        username: savedUser.username,
        email: savedUser.email,
        tenant_id: savedUser.tenant_id,
        is_active: savedUser.is_active,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
      },
    };
  }

  // ✅ Validate user credentials
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: [{ username }, { email: username }],
    });

    if (!user) throw new UnauthorizedException('User not found');

    const passwordValid = await bcrypt.compare(password, user.password_hash); // ✅ correct column
    if (!passwordValid) throw new UnauthorizedException('Invalid password');

    const { password_hash, ...result } = user;
    return result;
  }

  // ✅ Login: generate JWT
  async login(user: any) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      tenant_id: user.tenant_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: '3600s',
      user,
    };
  }
}
