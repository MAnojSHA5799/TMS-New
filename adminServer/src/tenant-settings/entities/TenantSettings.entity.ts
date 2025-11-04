import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'tenant_settings' })
export class TenantSettings {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenant_id: string;
  @Column() key: string;
  @Column({ type: 'jsonb', nullable: true }) value: any;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
