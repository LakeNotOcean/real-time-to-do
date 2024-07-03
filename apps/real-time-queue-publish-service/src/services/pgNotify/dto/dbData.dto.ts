export interface DbData<T> {
	timestamp: Date;
	operation: string;
	schema: string;
	table: string;
	oldData: T;
	newData: T;
}

export interface TaskDbData {
	id: string;
	userId: string;
	title: string;
	description: string;
	status: string;
}
