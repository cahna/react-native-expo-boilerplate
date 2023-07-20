/* eslint-disable max-classes-per-file,@typescript-eslint/no-use-before-define */
import { Transform } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';
import Decimal from 'decimal.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DecimalToString, DecimalTransformer } from '../transformer/decimal';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    name: 'scoreValue',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  @Transform(DecimalToString(2) as any, { toPlainOnly: true })
  scoreValue: Decimal;

  @Column({ length: 64, unique: true })
  @Length(1, 64)
  @IsEmail()
  email: string;
}

export const entities = [User];
