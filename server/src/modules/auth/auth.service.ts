import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { join } from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiPeruResponse, UserReniec } from 'src/entities/user-reniec.entity';
import { NodemailerService } from 'src/providers/nodemailer/nodemailer.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { PasswordChangedDTO } from './dto/password-change.dto';
import { ConfirmPasswordChange } from './dto/confirm-password-change.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: NodemailerService,
  ) {}

  apiKey = this.configService.get<string>('API_PERU_DEV');

  async getUserDataPerDNI(dni: string): Promise<UserReniec> {
    const response = await fetch(
      `https://apiperu.dev/api/dni/${dni}?api_token=${this.apiKey}`,
    );

    const json = (await response.json()) as ApiPeruResponse;

    if (!json.success)
      throw new HttpException(json.message, HttpStatus.BAD_REQUEST);

    return json.data;
  }

  async createReaderUser(user: CreateUserDTO) {
    const hashedPassword = await this._hashPassword(user.password);
    const token = this._getToken();
    const tokenExpiration = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000,
    );

    try {
      await this.prisma.user.create({
        data: {
          dni: user.dni,
          email: user.email,
          verificationToken: token,
          tokenExpiration,
          names: user.names,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          password: hashedPassword,
          role: 'READER',
        },
      });

      await this._sendConfirmationEmail(
        user.email,
        `${user.names} ${user.lastName}`,
        token,
      );
    } catch {
      throw new HttpException('User already exists.', HttpStatus.CONFLICT);
    }
  }

  async confirmAccount(query: { token: string | undefined }) {
    if (!query.token)
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);

    const userRes = await this._getUserByToken(query.token);

    await this.prisma.user.update({
      data: {
        emailVerified: true,
        verificationToken: null,
        tokenExpiration: null,
      },
      where: { id: userRes.id },
    });
  }

  async loginUser(user: LoginUserDTO) {
    const userRes = await this._verifyUser(user.dni, user.password);

    return {
      token: await this.jwt.signAsync({ id: userRes.id, role: userRes.role }),
    };
  }

  async refreshRegisterToken(user: RefreshTokenDTO) {
    const token = this._getToken();
    const tokenExpiration = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000,
    );

    const userRes = await this._verifyUser(user.dni, user.password, false);

    if (userRes.emailVerified)
      throw new HttpException('User already confirmed', HttpStatus.CONFLICT);

    await this.prisma.user.update({
      data: {
        verificationToken: token,
        tokenExpiration,
      },
      where: { id: userRes.id },
    });

    await this._sendConfirmationEmail(
      userRes.email,
      `${userRes.names} ${userRes.lastName}`,
      token,
    );
  }

  async requestPasswordChange(user: PasswordChangedDTO) {
    const userRes = await this.prisma.user.findUnique({
      where: { dni: user.dni },
      select: { id: true, email: true, names: true, lastName: true },
    });

    if (!userRes)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const token = this._getToken();
    const tokenExpiration = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000,
    );

    await this.prisma.user.update({
      data: {
        verificationToken: token,
        tokenExpiration,
      },
      where: { id: userRes.id },
    });

    await this._sendRequestPasswordChange(
      userRes.email,
      `${userRes.names} ${userRes.lastName}`,
      token,
    );
  }

  async confirmPasswordChange(data: ConfirmPasswordChange) {
    const hashedPassword = await this._hashPassword(data.password);
    const userRes = await this._getUserByToken(data.token, false);

    if (!userRes.emailVerified)
      throw new HttpException('Email not verified', HttpStatus.FORBIDDEN);

    await this.prisma.user.update({
      data: {
        password: hashedPassword,
        verificationToken: null,
        tokenExpiration: null,
      },
      where: { id: userRes.id },
    });
  }

  async _verifyUser(
    dni: string,
    password: string,
    needEmailVerification: boolean = true,
  ) {
    const userRes = await this.prisma.user.findUnique({
      where: { dni: dni },
      select: {
        id: true,
        email: true,
        names: true,
        lastName: true,
        password: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!userRes)
      throw new HttpException('User not exists.', HttpStatus.NOT_FOUND);

    if (needEmailVerification && !userRes.emailVerified)
      throw new HttpException('Email not confirmed', HttpStatus.FORBIDDEN);

    if (!(await this._comparePassword(userRes.password, password)))
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);

    return userRes;
  }

  async _hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async _comparePassword(hashed: string, plain: string) {
    return await bcrypt.compare(plain, hashed);
  }

  async _sendConfirmationEmail(email: string, name: string, token: string) {
    const backendServer = this.configService.get<string>('CLIENT_SERVER');
    const confirmationLink = `${backendServer}/auth/confirm-email?token=${token}`;
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'resources',
      'logo-muni.png',
    );

    await this.mail.sendMail({
      receiver: email,
      subject: 'Confirmación de Correo',
      text: `
Hola, ${name}!

Gracias por registrarte en nuestro sitio web. Por favor, confirma tu correo electrónico haciendo clic en el siguiente enlace:

${confirmationLink}

Si no te registraste en nuestro sitio, por favor ignora este correo.`,
      html: `<html><head><style>body{font-family:Arial,sans-serif;background-color:#f4f4f4;margin:0;padding:0;text-align:center;}.email-container{background-color:#ffffff;padding:20px;max-width:600px;margin:20px auto;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);}.logo{width:auto;margin-bottom:20px;}h1{font-size:24px;color:#333333;}p{font-size:16px;color:#666666;}.button{display:inline-block;padding:10px 20px;background-color:#4CAF50;color:#ffffff;text-decoration:none;border-radius:5px;font-size:16px;margin-top:20px;}.footer{margin-top:20px;font-size:12px;color:#999999;}</style></head>
<body>
  <div class="email-container">
    <img src="cid:logo" alt="Logo" class="logo">
    <h1>Hola, ${name}!</h1>
    <p>Gracias por registrarte en nuestro sitio web. Por favor, confirma tu correo electrónico haciendo clic en el botón de abajo.</p>
    <a href="${confirmationLink}" class="button">Confirmar Correo</a>
    <div class="footer"><p>Si no te registraste en nuestro sitio, por favor ignora este correo.</p></div>
  </div>
</body>
</html>`,
      attachments: [
        {
          filename: 'logo-muni.png',
          path: filePath,
          cid: 'logo',
        },
      ],
    });
  }

  async _sendRequestPasswordChange(email: string, name: string, token: string) {
    const backendServer = this.configService.get<string>('CLIENT_SERVER');
    const passwordChangeLink = `${backendServer}/auth/confirm-change-password?token=${token}`;
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'resources',
      'logo-muni.png',
    );

    await this.mail.sendMail({
      receiver: email,
      subject: 'Confirmación de cambio de contraseña',
      text: `
Hola, ${name}!

Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Si solicitaste este cambio, por favor sigue el siguiente enlace para restablecer tu contraseña:

${passwordChangeLink}

Si no solicitaste este cambio, ignora este correo. Este enlace es válido por 24 horas.`,
      html: `<html><head><style>body{font-family:Arial,sans-serif;background-color:#f4f4f4;margin:0;padding:0;text-align:center}.email-container{background-color:#fff;padding:20px;max-width:600px;margin:20px auto;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)}.logo{width:auto;margin-bottom:20px}h1{font-size:24px;color:#333}p{font-size:16px;color:#666}.button{display:inline-block;padding:10px 20px;background-color:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;font-size:16px;margin-top:20px}.footer{margin-top:20px;font-size:12px;color:#999}</style></head>
<body>
  <div class="email-container">
    <img src="cid:logo" alt="Logo" class="logo">
    <h1>Hola, ${name}!</h1>
    <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Si solicitaste este cambio, haz clic en el botón de abajo para restablecer tu contraseña.</p>
    <a href="${passwordChangeLink}" class="button">Restablecer Contraseña</a>
    <div class="footer">
      <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
      <p>Este enlace es válido por 24 horas.</p>
    </div>
  </div>
</body>
</html>`,
      attachments: [
        {
          filename: 'logo-muni.png',
          path: filePath,
          cid: 'logo',
        },
      ],
    });
  }

  async _getUserByToken(token: string, needEmailVerification: boolean = true) {
    if (!token)
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);

    const userRes = await this.prisma.user.findUnique({
      where: { verificationToken: token },
      select: { id: true, emailVerified: true, tokenExpiration: true },
    });

    if (!userRes)
      throw new HttpException(
        'Invalid token or user not found',
        HttpStatus.BAD_REQUEST,
      );

    if (needEmailVerification && userRes.emailVerified)
      throw new HttpException(
        'Account already verified',
        HttpStatus.BAD_REQUEST,
      );

    if (
      userRes.tokenExpiration &&
      new Date().getTime() > userRes.tokenExpiration.getTime()
    )
      throw new HttpException('Token has expired', HttpStatus.FORBIDDEN);

    return userRes;
  }

  _getToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}
