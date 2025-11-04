import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'fleets' })
export class Fleets {
  @PrimaryGeneratedColumn('uuid') fleet_id: string;
  @Column({ type: 'uuid' }) tenant_id: string;
  @Column() name: string;
  @Column({ nullable: true }) description: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
