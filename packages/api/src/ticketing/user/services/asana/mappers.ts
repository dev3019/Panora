
import { Injectable } from '@nestjs/common';
import { IUserMapper } from '@ticketing/user/types';
import { UnifiedUserInput, UnifiedUserOutput } from '@ticketing/user/types/model.unified';
import { AsanaUserInput, AsanaUserOutput } from './types';
import { MappersRegistry } from '@@core/utils/registry/mappings.registry';
import { Utils } from '@ticketing/@lib/@utils';

@Injectable()
export class AsanaUserMapper implements IUserMapper{
  constructor(private mappersRegistry: MappersRegistry, private utils: Utils) {
    this.mappersRegistry.registerService('ticketing', 'user', 'asana', this);
  }
  desunify(
    source: UnifiedUserInput,
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): AsanaUserInput {
    return;
  }

  unify(
    source: AsanaUserOutput | AsanaUserOutput[],
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): UnifiedUserOutput | UnifiedUserOutput[] {
    const sourcesArray = Array.isArray(source) ? source : [source];
    return sourcesArray.map((user) =>
      this.mapSingleUserToUnified(user, customFieldMappings),
    );
  }

  private mapSingleUserToUnified(
    user: AsanaUserOutput,
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): UnifiedUserOutput {

    const unifiedUser: UnifiedUserOutput = {
      remote_id: String(user.gid),
      name: `${user.name}`,
      email_address: '', // Asana API response does not provide email
    };

    return unifiedUser;
  }
  
}