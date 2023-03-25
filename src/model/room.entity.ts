import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RoomEntity {
  @PrimaryColumn()
  roomname: string;

  @Column()
  commonid: string;

  @Column()
  commonfalseid: string;
}
