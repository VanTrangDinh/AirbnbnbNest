import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { BaseCommand } from '../../../shared/command/base.command';

export class LoginCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;
}
