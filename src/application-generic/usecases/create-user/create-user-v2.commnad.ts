import { AuthProviderEnum } from '../../../shared';
import { BaseCommand } from '../../../app/shared/command/base.command';

export class CreateUserCommand extends BaseCommand {
  email?: string;

  firstName?: string | null;

  lastName?: string | null;

  picture?: string;

  auth: {
    username?: string;
    profileId: string;
    provider: AuthProviderEnum;
    accessToken: string;
    refreshToken: string;
  };
}
