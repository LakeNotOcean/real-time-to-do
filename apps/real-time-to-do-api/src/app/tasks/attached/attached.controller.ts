import {
	FileInterceptor,
	MemoryStorageFile,
	UploadedFile,
} from '@blazity/nest-file-fastify';
import { BaseApiController } from '@common';
import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Query,
	Res,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { AttachFileDescriptionDec } from '../../decorators/methods-decorators/actions/attach-file-description.decorator';
import { DeleteRequestDec } from '../../decorators/methods-decorators/delete-request.decorator';
import { GetRequestDec } from '../../decorators/methods-decorators/get-request.decorator';
import { PostRequestDec } from '../../decorators/methods-decorators/post-request.decorator';
import { AttachedDto } from '../../dto/attached.dto';
import { IdQueryReqParam } from '../../queries/id.query';
import { AttachedService } from './attached.service';
import { AttachedInfoDto } from './dto/attached-info.dto';

@Controller('tasks/attached')
@ApiTags('tasks')
export class AttachedController extends BaseApiController {
	constructor(private readonly attachedService: AttachedService) {
		super();
	}

	@GetRequestDec({
		resultType: AttachedInfoDto,
		isResultArray: true,
		route: 'all',
		description: 'get attach list for task',
	})
	async getAttachList(@Query() { id }: IdQueryReqParam) {
		(await this.attachedService.getAttachList(id)).unwrap();
	}

	@GetRequestDec({ resultType: AttachedDto, description: 'get attach by id' })
	async getAttached(@Query() { id }: IdQueryReqParam) {
		(await this.attachedService.getAttached(id)).unwrap();
	}

	@PostRequestDec({
		responseString: 'file upload successfully',
		description: 'attach file',
	})
	@UseInterceptors(FileInterceptor('file'))
	@AttachFileDescriptionDec('20mb jpeg file')
	async attach(
		@Query() { id }: IdQueryReqParam,
		@Res() response: FastifyReply,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 20000 }),
					new FileTypeValidator({ fileType: 'image/jpeg' }),
				],
			}),
		)
		file: MemoryStorageFile,
	) {
		await this.attachedService.attach(id, file);
		return this.Created(response);
	}
	@DeleteRequestDec({ responseString: 'file removed successfully' })
	async removeAttached(@Query() { id }: IdQueryReqParam) {
		await this.attachedService.removeAttached(id);
	}
}
