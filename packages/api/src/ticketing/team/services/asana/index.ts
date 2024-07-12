import { EncryptionService } from '@@core/encryption/encryption.service';
import { LoggerService } from '@@core/logger/logger.service';
import { PrismaService } from '@@core/prisma/prisma.service';
import { ApiResponse } from '@@core/utils/types';
import { Injectable } from '@nestjs/common';
import { ITeamService } from '@ticketing/team/types';
import { ServiceRegistry } from '../registry.service';
import { TicketingObject } from '@ticketing/@lib/@types';
import { AsanaTeamOutput } from './types';
import axios from 'axios';
import { ActionType, handle3rdPartyServiceError } from '@@core/utils/errors';

@Injectable()
export class AsanaService implements ITeamService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private cryptoService: EncryptionService,
    private registry: ServiceRegistry,
  ) {
    this.logger.setContext(
      TicketingObject.team.toUpperCase() + ':' + AsanaService.name,
    );
    this.registry.registerService('asana', this);
  }
  async syncTeams(linkedUserId: string, custom_properties?: string[]): Promise<ApiResponse<AsanaTeamOutput[]>> {
    try {
      const connection = await this.prisma.connections.findFirst({
        where: {
          id_linked_user: linkedUserId,
          provider_slug: 'asana',
          vertical: 'ticketing',
        },
      });

      const resp = await axios.get(`${connection.account_url}/teams`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cryptoService.decrypt(
            connection.access_token,
          )}`,
        },
      });
      this.logger.log(`Synced Asana teams !`);

      return {
        data: resp.data,
        message: 'Asana teams retrieved',
        statusCode: 200,
      };
    } catch (error) {
      handle3rdPartyServiceError(
        error,
        this.logger,
        'asana',
        TicketingObject.team,
        ActionType.GET,
      );
    }
  }
  
}