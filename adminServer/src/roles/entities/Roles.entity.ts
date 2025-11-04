import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'roles' })
export class Roles {
  @PrimaryGeneratedColumn('uuid') role_id: string;
  @Column({ type: 'uuid', nullable: true }) tenant_id: string;
  @Column() role_name: string;
  @Column({ nullable: true }) description: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
