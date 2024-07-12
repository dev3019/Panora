import { DesunifyReturnType } from '@@core/utils/types/desunify.input';
import { OriginalTeamOutput } from '@@core/utils/types/original/original.ticketing';
import { Injectable } from '@nestjs/common';
import { ITeamMapper } from '@ticketing/team/types';
import { UnifiedTeamInput, UnifiedTeamOutput } from '@ticketing/team/types/model.unified';
import { AsanaTeamInput, AsanaTeamOutput } from './types';

@Injectable()
export class AsanaTeamMapper implements ITeamMapper {
  desunify(source: UnifiedTeamInput, customFieldMappings?: { slug: string; remote_id: string; }[]): AsanaTeamInput {
    return;
  }
  unify(source: AsanaTeamOutput | AsanaTeamOutput[], customFieldMappings?: { slug: string; remote_id: string; }[]): UnifiedTeamOutput | UnifiedTeamOutput[] {
    // If the source is not an array, convert it to an array for mapping
    const sourcesArray = Array.isArray(source) ? source : [source];

    return sourcesArray.map((team) =>
      this.mapSingleTeamToUnified(team, customFieldMappings),
    );
  }

  private mapSingleTeamToUnified(
    team: AsanaTeamOutput,
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): UnifiedTeamOutput {
    const unifiedTeam: UnifiedTeamOutput = {
      remote_id: String(team.gid),
      name: team.name,
    };

    return unifiedTeam;
  }
}