import { JsonLogger } from '@common';
import { Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ASYNC_RABBITMQ, createRoutingKey } from '@rabbitmq';
import { PgNotifyMessagePattern } from 'nestjs-pg-notify';
import { firstValueFrom } from 'rxjs';
import { rabbitMQPublishMessage } from '../rabbitMQ/rabbitMQ-publish-message';
import { RabbitMQService } from '../rabbitMQ/rabbitMQ.service';
import { DbData, TaskDbData } from './dto/dbData.dto';

@Controller()
export class PgNotifyController {
	private readonly logger = new JsonLogger(PgNotifyController.name);

	constructor(
		@Inject(ASYNC_RABBITMQ)
		private readonly rabbitMQService: RabbitMQService,
	) {}

	@PgNotifyMessagePattern('task_change')
	@UsePipes(new ValidationPipe())
	async onTaskChange(@Payload() payload: DbData<TaskDbData>) {
		this.logger.debug({ message: 'message received from database', payload });
		const observable = await rabbitMQPublishMessage(
			this.rabbitMQService,
			createRoutingKey(payload.newData.id),
			payload.newData,
		);
		try {
			await firstValueFrom(observable);
		} catch (err) {
			this.logger.log({ message: 'unable to publish', payload });
		}
	}
}
