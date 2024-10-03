import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

interface Mail {
  receiver: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: any;
}

@Injectable()
export class NodemailerService {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD,
    },
  });

  async sendMail(mail: Mail) {
    await this.transporter.sendMail({
      from: `"Municipalidad de Guadalupe" <${process.env.EMAIL_AUTH_USER}>`,
      to: mail.receiver,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      attachments: mail.attachments,
    });
  }
}
