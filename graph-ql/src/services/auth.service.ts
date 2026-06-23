import { RegisterInput } from "../dto/input/auth.input";
import { hashPassword } from "../lib/hash";
import { signJwt } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { UserModel } from "../models/user.model";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) throw new Error("E-mail already exists");

    const hash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    });

    return this._generateToken({ ...user, password: hash });
  }

  private _generateToken(user: UserModel) {
    const token = signJwt({ id: user.id, email: user.email }, "1d");
    const refreshToken = signJwt({ id: user.id, email: user.email }, "7d");
    return { token, refreshToken, user };
  }
}
