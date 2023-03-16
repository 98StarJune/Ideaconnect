import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  roomname: string;

  @Column()
  date: string;

  @Column()
  sender: string;

  @Column({ type: 'text' })
  message: string;
}
