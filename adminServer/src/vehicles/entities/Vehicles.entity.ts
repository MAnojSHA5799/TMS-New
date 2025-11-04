import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'vehicles' })
export class Vehicles {
  @PrimaryGeneratedColumn('uuid') vehicle_id: string;
  @Column({ type: 'uuid' }) tenant_id: string;
  @Column({ type: 'uuid', nullable: true }) fleet_id: string;
  @Column({ nullable: true }) registration_number: string;
  @Column({ nullable: true }) model: string;
  @Column({ type: 'int', nullable: true }) capacity: number;
  @Column({ default: true }) active: boolean;
  @Column({ type: 'date', nullable: true }) last_inspection: Date;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
