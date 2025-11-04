import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogs } from './entities/AuditLogs.entity';

@Injectable()
export class AuditLogsService {
  constructor(@InjectRepository(AuditLogs) private repo: Repository<AuditLogs>) {}

  create(dto: any) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOneBy({ id }); }
  update(id: string, dto: any) { return this.repo.update(id, dto); }
  remove(id: string) { return this.repo.delete(id); }
}
