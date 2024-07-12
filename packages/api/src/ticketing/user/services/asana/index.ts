import { Injectable } from '@nestjs/common';
import { EncryptionService } from "@@core/encryption/encryption.service";
import { LoggerService } from "@@core/logger/logger.service";
import { PrismaService } from "@@core/prisma/prisma.service";
import { ApiResponse } from "@@core/utils/types";
import { IUserService } from "@ticketing/user/types";
import { ServiceRegistry } from "../registry.service";
import { TicketingObject } from "@ticketing/@lib/@types";
import { ActionType, handle3rdPartyServiceError } from "@@core/utils/errors";
import axios from 'axios';
import { AsanaUserOutput } from './types';

@Injectable()
export class AsanaService implements IUserService{
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private cryptoService: EncryptionService,
    private registry: ServiceRegistry,
  ) {
    this.logger.setContext(
      TicketingObject.user.toUpperCase() + ':' + AsanaService.name,
    );
    this.registry.registerService('asana', this);
  }
  
  async syncUsers(
    linkedUserId: string, 
    remote_user_id?: string,
  ): Promise<ApiResponse<AsanaUserOutput[]>> {
    try {
      const connection = await this.prisma.connections.findFirst({
        where: {
          id_linked_user: linkedUserId,
          provider_slug: 'asana',
          vertical: 'ticketing',
        }
      });

      const resp = await axios.get(`${connection.account_url}/users`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cryptoService.decrypt(
            connection.access_token,
          )}`,
        }
      });
      this.logger.log(`Synced Asana users !`);

      return {
        data: resp.data.data,
        message: 'Asana users retrieved',
        statusCode: 200,
      };
    } catch (error) {
      handle3rdPartyServiceError(
        error,
        this.logger,
        'asana',
        TicketingObject.user,
        ActionType.GET,
      );
    }
  }
  
}