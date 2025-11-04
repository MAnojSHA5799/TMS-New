import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'routes' })
export class Routes {
  @PrimaryGeneratedColumn('uuid') route_id: string;
  @Column({ type: 'uuid' }) tenant_id: string;
  @Column() name: string;
  @Column({ type: 'jsonb', nullable: true }) stops: any;
  @Column({ type: 'int', nullable: true }) estimated_time: number;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
