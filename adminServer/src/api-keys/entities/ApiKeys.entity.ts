import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'api_keys' })
export class ApiKeys {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', nullable: true }) tenant_id: string;
  @Column({ type: 'uuid', nullable: true }) user_id: string;
  @Column() api_key: string;
  @Column({ nullable: true }) description: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
