import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'system_audit' })
export class SystemAudit {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() event: string;
  @Column({ type: 'jsonb', nullable: true }) metadata: any;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
