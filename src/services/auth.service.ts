import { hash, compare } from 'bcrypt';
import { sign, verify, decode } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { con } from '../app';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = this.users.find(user => user.email === userData.email);
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = { id: this.users.length + 1, ...userData, password: hashedPassword };

    return createUserData;
  }

  public async login(userData) {
    try {
      if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

      const email = userData.data.email;

      const [result] = await con.query(`SELECT * FROM admin where admin.email='${email}'`);

      if (result.length == 0) return { message: 'password or email is incorrect' };

      if (userData.data.password != result[0].password) {
        return { message: 'password or email is incorrect' };
      }

      const tokenData = this.createToken(result[0]);
      const cookie = this.createCookie(tokenData);
      return { tokenData, cookie, result };
    } catch (error) {
      console.log(error);
    }
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = this.users.find(user => user.email === userData.email && user.password === userData.password);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async generateRefreshToken(accessToken) {
    
    const { access_token } = accessToken.data;

    console.log(access_token);
    

    const secretKey: string = SECRET_KEY;

    console.log(verify(access_token, secretKey));

    if (verify(access_token, secretKey)) {
      const { email } = decode(access_token);
      const expiresIn: string = '10 hours';

      const [result] = await con.query(`select * from admin where email = '${email}'`);

      if (result.length == 0) return { message: 'there no users with this token' };

      const newToken = sign({ email }, secretKey, { expiresIn });

      return { newToken, result };
    }
    else {
      return {message: "token is invalid"}
    }
  }

  public createToken(user) {
    const { email } = user;
    const secretKey: string = SECRET_KEY;
    const expiresIn: string = '3 hours';

    return { token: sign({ email }, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
