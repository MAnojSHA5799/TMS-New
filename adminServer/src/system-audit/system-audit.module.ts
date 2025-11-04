import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAudit } from './entities/SystemAudit.entity';
import { SystemAuditService } from './system-audit.service';
import { SystemAuditController } from './system-audit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemAudit])],
  controllers: [SystemAuditController],
  providers: [SystemAuditService],
  exports: [SystemAuditService],
})
export class SystemAuditModule {}
