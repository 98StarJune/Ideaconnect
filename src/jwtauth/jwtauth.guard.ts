import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtauthGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      const token = req.headers.authorization;
      if (!token) {
        res.status(400).json({ message: 'JWT가 존재하지 않습니다.' });
        return false;
      }
      const decoded = this.jwtService.verify(token.toString(), {
        secret: process.env.SECRET,
      });
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        req.body.jwtid = decoded.id;
        return true;
      }
      throw Error('알 수 없는 오류 발생');
    } catch (e) {
      const res = context.switchToHttp().getResponse();
      if (e.name === 'TokenExpiredError') {
        console.log(e);
        res.status(400).json({ message: 'JWT가 만료되었습니다.' });
        return false;
      }
      console.log(e);
      res
        .status(500)
        .json({ statusCode: 500, message: '에러가 발생했습니다.', error: e });
      return false;
    }
  }
}
