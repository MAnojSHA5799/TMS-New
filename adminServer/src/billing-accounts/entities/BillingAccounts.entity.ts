import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity({ name: 'billing_accounts' })
export class BillingAccounts {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenant_id: string;
  @Column({ nullable: true }) billing_provider: string;
  @Column({ nullable: true }) billing_customer_id: string;
  @Column({ nullable: true }) billing_plan: string;
  @Column({ nullable: true }) billing_status: string;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
