import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { OrganizationCommand } from '../../../shared/command/organization.command';

export class CreateEnvironmentCommand extends OrganizationCommand {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsMongoId()
  parentEnvironmentId?: string;
}
