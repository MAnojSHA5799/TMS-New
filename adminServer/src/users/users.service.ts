import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/Users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

  // Create a new user
  create(dto: any) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  // Get all users
  findAll() {
    return this.repo.find();
  }

  // Get single user by ID
  findOne(id: string) {
    return this.repo.findOneBy({ user_id: id });
  }

  // Update user
  update(id: string, dto: any) {
    return this.repo.update(id, dto);
  }

  // Delete user
  remove(id: string) {
    return this.repo.delete(id);
  }
}
