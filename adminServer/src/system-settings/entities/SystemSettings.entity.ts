import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity({ name: 'system_settings' })
export class SystemSettings {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() key: string;
  @Column({ type: 'jsonb', nullable: true }) value: any;
  @Column({ nullable: true }) description: string;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
