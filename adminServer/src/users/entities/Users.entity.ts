import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenants } from '../../tenants/entities/Tenants.entity'; // adjust import path

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @ManyToOne(() => Tenants)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenants;

  @Column({ type: 'uuid', nullable: false })
  tenant_id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
