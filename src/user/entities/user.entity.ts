import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn()
    id: number;

    @Column({ length: 30 })
    name: string;

    @Column({ length: 60 })
    email: string;

    @Column({ length: 30 })
    password: string;

    @Column({ length: 60 })
    signupVerifyToken: string;
}