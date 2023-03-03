import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class AuthEntity {
  @PrimaryColumn()
  _id: string;

  @Column()
  common: boolean;

  @Column()
  @Index({ unique: true })
  id: string;

  @Column()
  pw: string;

  @Column()
  name: string;

  @Column()
  nation: string;

  @Column()
  email: string;

  @Column()
  phone: number;

  @Column()
  nickname: string;

  @Column()
  profileimg: string;
}
