import { InvalidateCacheService, AuthService, buildUserKey } from '../../../../application-generic';
import { UserRepository } from './../../../../dal/repositories/user/user.repository';
import { Injectable } from '@nestjs/common';
import { PasswordResetCommand } from './password-reset.command';
import { ApiException } from '../../../shared/exceptions/api.exception';
import { isBefore, subDays } from 'date-fns';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordReset {
  constructor(
    private readonly invalidateCache: InvalidateCacheService,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: PasswordResetCommand): Promise<{ token: string }> {
    const user = await this.userRepository.findUserByToken(command.token);
    if (!user) {
      throw new ApiException('Bad token provided');
    }

    if (user.resetTokenDate && isBefore(new Date(user.resetTokenDate), subDays(new Date(), 7))) {
      throw new ApiException('Token has expired');
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    await this.invalidateCache.invalidateByKey({
      key: buildUserKey({
        _id: user._id,
      }),
    });

    await this.userRepository.update(
      {
        _id: user._id,
      },
      {
        $set: {
          password: passwordHash,
        },
        $unset: {
          resetToken: 1,
          resetTokenDate: 1,
          resetTokenCount: '',
        },
      },
    );

    return {
      token: await this.authService.generateUserToken(user),
    };
  }
}
