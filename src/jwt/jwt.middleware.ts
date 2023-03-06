import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private JwtService: JwtService) {}
  use(req: any, res: any, next: () => void) {
    try {
      const jwt = req.headers.authorization;
      if (!jwt) {
        return res.status(401).json({ message: 'JWT가 존재하지 않습니다.' });
      }
      const decoded = this.JwtService.verify(jwt.toString(), {
        secret: process.env.SECRET,
      });
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        req.body.jwtid = decoded.id;
        return next();
      }
      throw Error('알 수 없는 오류 발생');
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        console.log(e);
        return res.status(401).json({ message: 'JWT가 만료되었습니다.' });
      }
      console.log(e);
      return res
        .status(500)
        .json({ statusCode: 500, message: '에러가 발생했습니다.', error: e });
    }
  }
}
