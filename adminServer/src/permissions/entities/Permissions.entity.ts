import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'permissions' })
export class Permissions {
  @PrimaryGeneratedColumn('uuid') permission_id: string;
  @Column() permission_name: string;
  @Column({ nullable: true }) description: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
