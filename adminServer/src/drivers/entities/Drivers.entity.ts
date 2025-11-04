import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'drivers' })
export class Drivers {
  @PrimaryGeneratedColumn('uuid') driver_id: string;
  @Column({ type: 'uuid' }) tenant_id: string;
  @Column() first_name: string;
  @Column() last_name: string;
  @Column({ nullable: true }) license_number: string;
  @Column({ nullable: true }) phone: string;
  @Column({ default: true }) active: boolean;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
