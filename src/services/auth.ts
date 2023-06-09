import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from 'config'

export interface JwtToken {
  sub: string
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10,
  ): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, config.get<string>('App.auth.key'), {
      expiresIn: config.get<number>('App.auth.tokenExpiresIn'),
    })
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, config.get<string>('App.auth.key')) as JwtToken
  }
}
