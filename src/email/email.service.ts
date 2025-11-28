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
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
    <h2 style="color: #1a73e8;">Welcome to Your App!</h2>
    <p>Hi there,</p>
    <p>Thank you for signing up! To get started, please verify your email address by clicking the button below:</p>
    
    <a href="${verificationUrl}" 
       style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
       Verify Email
    </a>

    <p>If the button above does not work, copy and paste following link into your browser or click  the following link:</p>
    <p style="word-break: break-all;"><a href="${verificationUrl}" style="color: #1a73e8;">${verificationUrl}</a></p>

    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />

    <p style="font-size: 12px; color: #888;">This link will expire in 1 hour. If you did not sign up for this account, you can safely ignore this email.</p>
  </div>
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
