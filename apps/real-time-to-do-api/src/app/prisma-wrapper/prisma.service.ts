import { getDatabaseUrl, toMilliseconds } from '@common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

export type PrismaServiceConfig = {
	datasources: { db: { url: string } };
	transactionOptions: { maxWait: number; timeout: number };
};
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor(configService: ConfigService) {
		const params: PrismaServiceConfig = {
			datasources: { db: { url: getDatabaseUrl(configService) } },
			transactionOptions: {
				maxWait: toMilliseconds(
					configService.getOrThrow<string>('prismaMaxWait'),
				),
				timeout: toMilliseconds(
					configService.getOrThrow<string>('prismaTimeout'),
				),
			},
		};
		super(params);
	}
	async onModuleInit() {
		await this.$connect();
	}
}
