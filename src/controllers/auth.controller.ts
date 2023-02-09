import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const signUpUserData = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const response = await this.authService.login(userData);

      if(!response.message){
        res.setHeader('Set-Cookie', [response.cookie]);
      }

      
      res.status(200).json(response.message ? { message: response.message } : { message: "logged in", user: response.result, access_token: response.tokenData.token });
    } catch (error) {
      console.log(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accessToken = req.body;
      const response = await this.authService.generateRefreshToken(accessToken);

      if(!response.message){
        res.setHeader('Set-Token', [response.newToken]);
      }
      
      res.status(200).json(response.message ? { message: response.message } : { message: "logged in", user: response.result, access_token: response.newToken });
    } catch (error) {
      console.log(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
