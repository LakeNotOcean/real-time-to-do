import { Module } from '@nestjs/common';
import { AttachedModule } from './attached/attached.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
	imports: [AttachedModule],
	controllers: [TasksController],
	providers: [TasksService],
})
export class TasksModule {}
