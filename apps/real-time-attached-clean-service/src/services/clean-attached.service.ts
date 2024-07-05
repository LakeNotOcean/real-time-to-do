import { JsonLogger } from '@common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CleanAttachedService {
	private readonly logger = new JsonLogger(CleanAttachedService.name);
}
