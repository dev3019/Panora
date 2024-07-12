import { MappersRegistry } from '@@core/utils/registry/mappings.registry';
import { DesunifyReturnType } from '@@core/utils/types/desunify.input';
import { OriginalTagOutput } from '@@core/utils/types/original/original.ticketing';
import { Injectable } from '@nestjs/common';
import { Utils } from '@ticketing/@lib/@utils';
import { ITagMapper } from '@ticketing/tag/types';
import { UnifiedTagInput, UnifiedTagOutput } from '@ticketing/tag/types/model.unified';
import { AsanaTagInput, AsanaTagOutput } from './types';

@Injectable()
export class AsanaTagMapper implements ITagMapper {
  constructor(private mappersRegistry: MappersRegistry, private utils: Utils) {
    this.mappersRegistry.registerService('ticketing', 'tag', 'asana', this);
  }
  desunify(source: UnifiedTagInput, customFieldMappings?: { slug: string; remote_id: string; }[]): AsanaTagInput {
    return;
  }
  unify(source: AsanaTagOutput | AsanaTagOutput[], customFieldMappings?: { slug: string; remote_id: string; }[]): UnifiedTagOutput | UnifiedTagOutput[] {
    // If the source is not an array, convert it to an array for mapping
    const sourcesArray = Array.isArray(source) ? source : [source];

    return sourcesArray.map((tag) =>
      this.mapSingleTagToUnified(tag, customFieldMappings),
    );
  }

  private mapSingleTagToUnified(
    tag: AsanaTagOutput,
    customFieldMappings?: {
      slug: string;
      remote_id: string;
    }[],
  ): UnifiedTagOutput {
    const unifiedTag: UnifiedTagOutput = {
      remote_id: String(tag.gid),
      name: tag.name,
    };

    return unifiedTag;
  }
  
}