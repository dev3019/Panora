import { Module } from '@nestjs/common';
import { ContactService } from './services/contact.service';
import { ContactController } from './contact.controller';
import { PrismaService } from 'src/@core/prisma/prisma.service';
import { FreshSalesService } from './services/freshsales';
import { ZendeskService } from './services/zendesk';
import { ZohoService } from './services/zoho';
import { PipedriveService } from './services/pipedrive';
import { HubspotService } from './services/hubspot';

@Module({
  controllers: [ContactController],
  providers: [
    ContactService,
    PrismaService,
    FreshSalesService,
    ZendeskService,
    ZohoService,
    PipedriveService,
    HubspotService,
  ],
})
export class ContactModule {}