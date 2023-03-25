import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RoomEntity {
  @PrimaryColumn()
  roomname: string;

  @Column()
  common_id: string;
  @Column()
  common_nick: string;

  @Column()
  commonfalse_id: string;

  @Column()
  commonfalse_nick: string;
}
