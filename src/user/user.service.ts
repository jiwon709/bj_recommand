import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { Connection, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { UserEntity } from './entities/user.entity';
import { UserInfo } from './UserInfo';

/*
    트랜잭션 구현 3가지 방법
    1. QueryRunner 단일DB커넥션 생성 관리
    2. transaction 객체 생성 이용
    3. 데코레이터를 이용하여 트랜잭션을 구현 => 스프링에서는 많이 하지만 nestjs에서는 권장하지 않는다 왜냐하면 @Transactional 방식은 유닛테스트에서 레포지토리 모킹에 대한 어려움이 있다.
*/
@Injectable()
export class UserService {
    constructor(
        private emailService : EmailService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>, //typeOrm
        private connection: Connection,//typeOrm
    ){ }
    async createUser(name : string, email : string, password : string){
        const userExist = await this.checkUserExist(email);

        if(userExist){
            throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
        }

        const signupVerifyToken = uuid.v1();

        await this.saveUser(name, email, password, signupVerifyToken);
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
        const user = await this.userRepository.findOne({ signupVerifyToken });

        if(!user){
            throw new NotFoundException("해당 유저는 존재하지 않습니다.");
        }

        return this.authService.login({
            id : user.id,
            password : user.password,
            email : user.email
        });
    }

    async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급

    throw new Error('Method not implemented.');
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
        // 2. 조회된 데이터를 UserInfo 타입으로 응답
      
        throw new Error('Method not implemented.');
    }

    private async checkUserExist(emailAddress: string): Promise<boolean>{
        const user = await this.userRepository.findOne({ email: emailAddress});

        return user !== undefined;
    }

    private async saveUser(name: string, email: string, password: string, sigupVerifyToken: string){
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = new UserEntity();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = sigupVerifyToken;
    
            await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
        }
            // 직접 생성한 queryRunner는 해제를 시켜줘야합니당
            // db.close() 같은 느낌
            await queryRunner.release();
    }

    private async sendMemberJoinEmail(email: string, signupVerifyToken: string){
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }

  
    
}