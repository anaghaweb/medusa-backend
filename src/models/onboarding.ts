import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity } from "typeorm";

@Entity()
export class OnboardingState extends BaseEntity {
  @Column({ nullable: true })
  current_step!: string;

  @Column()
  is_complete: boolean = false;

  @Column({ nullable: true })
  product_id!: string;

  [key: string]: unknown;
}
