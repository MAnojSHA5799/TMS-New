import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'audit_logs' })
export class AuditLogs {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', nullable: true }) tenant_id: string;
  @Column({ type: 'uuid', nullable: true }) user_id: string;
  @Column() action: string;
  @Column({ type: 'jsonb', nullable: true }) metadata: any;
  @Column({ nullable: true }) ip_address: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
