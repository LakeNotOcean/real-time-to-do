import { BaseApiController, toBytes } from '@common';
import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { IdQueryDec } from '../../decorators/id-query.decorator';
import { AttachFileDescriptionDec } from '../../decorators/methods-decorators/actions/attach-file-description.decorator';
import { DeleteRequestDec } from '../../decorators/methods-decorators/delete-request.decorator';
import { GetRequestDec } from '../../decorators/methods-decorators/get-request.decorator';
import { PostRequestDec } from '../../decorators/methods-decorators/post-request.decorator';
import { AttachedDto } from '../../dto/attached.dto';
import { taskIdApiQueryOpt } from '../queries/api-query-task-id-opt';
import { AttachedService } from './attached.service';
import { AttachedInfoDto } from './dto/attached-info.dto';
@Controller()
@ApiTags('tasks')
export class AttachedController extends BaseApiController {
	constructor(private readonly attachedService: AttachedService) {
		super();
	}

	@GetRequestDec({
		resultType: AttachedInfoDto,
		isResultArray: true,
		route: 'info',
		description: 'get information on attached files for task',
		apiQueryOptions: [taskIdApiQueryOpt],
	})
	async getAttachList(@IdQueryDec() id: bigint) {
		(await this.attachedService.getAttachInfoList(id)).unwrap();
	}

	@GetRequestDec({
		resultType: AttachedDto,
		description: 'get attach by id',
		apiQueryOptions: [taskIdApiQueryOpt],
	})
	async getAttached(@IdQueryDec() id: bigint) {
		(await this.attachedService.getAttached(id)).unwrap();
	}

	@PostRequestDec({
		responseString: 'file upload successfully',
		description: 'attach image/jpeg',
		apiQueryOptions: [taskIdApiQueryOpt],
	})
	@UseInterceptors(FileInterceptor('file'))
	@AttachFileDescriptionDec('20mb jpeg file')
	async attach(
		@IdQueryDec() id: bigint,
		@Res() response: FastifyReply,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: toBytes('20mb'),
						message: 'the file must not be empty and no larger than 20mb',
					}),
					new FileTypeValidator({ fileType: 'image/jpeg' }),
				],
			}),
		)
		file: File,
	) {
		await this.attachedService.attach(id, file);
		return this.Created(response);
	}
	@DeleteRequestDec({ responseString: 'file removed successfully' })
	async removeAttached(@IdQueryDec() id: bigint) {
		await this.attachedService.removeAttached(id);
	}
}
