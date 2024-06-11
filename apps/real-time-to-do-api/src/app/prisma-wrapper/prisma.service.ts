import { getDatabaseUrl } from '@common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

export type PrismaServiceConfig = {
	datasources: { db: { url: string } };
};
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor(configService: ConfigService) {
		const params: PrismaServiceConfig = {
			datasources: { db: { url: getDatabaseUrl(configService) } },
		};
		super(params);
	}
	async onModuleInit() {
		await this.$connect();
	}
}
