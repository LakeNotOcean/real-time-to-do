import { ConfigService } from '@nestjs/config';
import { generalConfig } from '../configs/config';

export function getDatabaseUrl(configService?: ConfigService): string {
	configService ??= new ConfigService(generalConfig());
	const host = configService.getOrThrow<string>('postgresHost');
	const port = configService.getOrThrow<number>('postgresPort');
	const username = configService.getOrThrow<string>('postgresUsername');
	const password = configService.getOrThrow<string>('postgresPassword');
	const database = configService.getOrThrow<string>('postgresDatabase');
	const schema = configService.getOrThrow<string>('postgresSchema');
	return `postgresql://${username}:${password}@${host}:${port}/${database}?schema=${schema}`;
}

// const prisma = new PrismaClient({
// 	datasources: { db: { url: getDatabaseUrl(ConfigService) } },
// });
