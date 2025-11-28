import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService, // Inject EmailService
  ) {}

  // LOGIN
  async validateUser({ email, password }: AuthPayloadDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Check if email is verified
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please check your inbox.',
      );
    }

    // Remove password from response
    const { password: _, ...payload } = user.toObject();

    // Sign JWT token
    return this.jwtService.sign(payload);
  }

  // SIGNUP
  async signup(createUserDto: any) {
    // Create user with default isVerified = false
    const user = await this.usersService.createUser({
      ...createUserDto,
      isVerified: false,
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    user.verificationToken = token;
    user.verificationTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, token);

    return {
      message: 'User created. Please check your email to verify account.',
    };
  }

  // VERIFY EMAIL
  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');

    if (
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry < Date.now()
    ) {
      throw new BadRequestException('Token has expired');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    return { message: 'Email successfully verified. You can now log in.' };
  }

  // FORGOT PASSWORD
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    await this.emailService.sendResetPasswordEmail(user.email, token);

    return { message: 'Password reset email sent.' };
  }

  // RESET PASSWORD
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');

    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < Date.now()) {
      throw new BadRequestException('Token has expired');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return { message: 'Password successfully reset.' };
  }
}
