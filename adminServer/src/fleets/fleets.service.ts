import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fleets } from './entities/Fleets.entity';

@Injectable()
export class FleetsService {
  constructor(@InjectRepository(Fleets) private repo: Repository<Fleets>) {}

  create(dto: any) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOneBy({ id }); }
  update(id: string, dto: any) { return this.repo.update(id, dto); }
  remove(id: string) { return this.repo.delete(id); }
}
