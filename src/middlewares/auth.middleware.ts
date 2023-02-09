import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { con } from '../app';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = (req.header('auth') ? req.header('auth').split('Bearer ')[1] : null);
    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const { email } = verificationResponse;
      const [result] = await con.query(`select * from admin where email = '${email}'`);
      
      if (result.length > 0)
      {
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    console.log(new HttpException(401, 'Wrong authentication token'));
  }
}

export default authMiddleware;
