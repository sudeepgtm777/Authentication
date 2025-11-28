import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    // Initialize Resend with your API key (store in .env)
    this.resend = new Resend(process.env.RESEND_API_KEY!);
  }

  private getBackendUrl(): string {
    return process.env.BACKEND_URL || 'http://localhost:3000';
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${this.getBackendUrl()}/auth/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: process.env.RESEND_VERIFIED_SENDER!,
      to,
      subject: 'Verify Your Email',
      html: `
        <p>Thank you for signing up!</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetUrl = `${this.getBackendUrl()}/auth/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: process.env.RESEND_VERIFIED_SENDER!,
      to,
      subject: 'Reset Your Password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }
}
