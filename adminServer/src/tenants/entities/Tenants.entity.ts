import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity({ name: 'tenants' })
export class Tenants {
  @PrimaryGeneratedColumn('uuid') tenant_id: string;
  @Column() tenant_name: string;
  @Column({ nullable: true }) domain_name: string;
  @Column({ nullable: true }) contact_email: string;
  @Column({ default: 'free' }) plan_type: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
  @Column({ default: true }) is_active: boolean;
}
