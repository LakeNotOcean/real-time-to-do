import {
	BaseAttchedService,
	CLEAN_UNUSED_ATTACHED_INTERVAL,
	CLEAN_UNUSED_DIRS_INTERVAL,
	JsonLogger,
	PrismaService,
	toMilliseconds,
} from '@common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { cleanUnusedAttached } from './interval-functions/clean-unused-attached';
import { cleanUnusedDirs } from './interval-functions/clean-unused-dirs';

@Injectable()
export class CleanAttachedService extends BaseAttchedService {
	private readonly logger = new JsonLogger(CleanAttachedService.name);

	constructor(
		prismaService: PrismaService,
		configService: ConfigService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {
		super(prismaService, configService);
		const cleanUnusedDirsIntervalTime = configService.getOrThrow<string>(
			CLEAN_UNUSED_DIRS_INTERVAL,
		);
		const cleanUnusedAttachedIntervalTime = configService.getOrThrow<string>(
			CLEAN_UNUSED_ATTACHED_INTERVAL,
		);
		this.schedulerRegistry.addInterval(
			CLEAN_UNUSED_DIRS_INTERVAL,
			setInterval(async () => {
				this.logger.log('start clean unused dirs');
				await cleanUnusedDirs(prismaService, this.pathToStorage);
				this.logger.log('finish clean unused dirs');
			}, toMilliseconds(cleanUnusedDirsIntervalTime)),
		);
		this.schedulerRegistry.addInterval(
			CLEAN_UNUSED_ATTACHED_INTERVAL,
			setInterval(async () => {
				this.logger.log('start clean unused attached');
				await cleanUnusedAttached(prismaService, this.pathToStorage);
				this.logger.log('finish clean unused attached');
			}, toMilliseconds(cleanUnusedAttachedIntervalTime)),
		);
	}
}
