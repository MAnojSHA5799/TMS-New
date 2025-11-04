import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemAudit } from './entities/SystemAudit.entity';

@Injectable()
export class SystemAuditService {
  constructor(@InjectRepository(SystemAudit) private repo: Repository<SystemAudit>) {}

  create(dto: any) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOneBy({ id }); }
  update(id: string, dto: any) { return this.repo.update(id, dto); }
  remove(id: string) { return this.repo.delete(id); }
}
