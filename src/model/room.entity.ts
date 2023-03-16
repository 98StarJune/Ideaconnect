import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RoomEntity {
  @PrimaryColumn()
  roomname: string;

  @Column()
  date: string;

  @Column()
  sender: string;

  @Column()
  message: string;
}
