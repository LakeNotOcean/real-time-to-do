import { CustomTransportStrategy } from '@nestjs/microservices';

export class CleanServiceTransportSrtategy implements CustomTransportStrategy {
	private closing = false;

	wait() {
		if (!this.closing) {
			setTimeout(() => this.wait(), 1000);
		}
	}

	listen() {
		console.log('clean serivce is running');
		this.wait();
	}

	close() {
		this.closing = true;
	}
}
