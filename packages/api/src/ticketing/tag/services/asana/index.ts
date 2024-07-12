import { EncryptionService } from '@@core/encryption/encryption.service';
import { LoggerService } from '@@core/logger/logger.service';
import { PrismaService } from '@@core/prisma/prisma.service';
import { ApiResponse } from '@@core/utils/types';
import { Injectable } from '@nestjs/common';
import { ITagService } from '@ticketing/tag/types';
import axios from 'axios';
import { ServiceRegistry } from '../registry.service';
import { TicketingObject } from '@ticketing/@lib/@types';
import { AsanaTagOutput } from './types';
import { ActionType, handle3rdPartyServiceError } from '@@core/utils/errors';

@Injectable()
export class AsanaService implements ITagService{
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private cryptoService: EncryptionService,
    private registry: ServiceRegistry,
  ) {
    this.logger.setContext(
      TicketingObject.tag.toUpperCase() + ':' + AsanaService.name,
    );
    this.registry.registerService('asana', this);
  }
  async syncTags(
    linkedUserId: string,
    id_ticket: string
  ): Promise<ApiResponse<AsanaTagOutput[]>> {
    try {
      const connection = await this.prisma.connections.findFirst({
        where: {
          id_linked_user: linkedUserId,
          provider_slug: 'asana',
          vertical: 'ticketing',
        },
      });

      const ticket = await this.prisma.tcg_tickets.findUnique({
        where: {
          id_tcg_ticket: id_ticket,
        },
        select: {
          remote_id: true,
        },
      });

      const resp = await axios.get(`${connection.account_url}/tags`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cryptoService.decrypt(
            connection.access_token,
          )}`,
        },
      });
      this.logger.log(`Synced Asana tags !`);

      const conversation = resp.data._results.find(
        (c) => c.id === ticket.remote_id,
      );

      return {
        data: conversation.tags,
        message: 'Asana tags retrieved',
        statusCode: 200,
      };
    } catch (error) {
      handle3rdPartyServiceError(
        error,
        this.logger,
        'asana',
        TicketingObject.tag,
        ActionType.GET,
      );
    }
  }
}