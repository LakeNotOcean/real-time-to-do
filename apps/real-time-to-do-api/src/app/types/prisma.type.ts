import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs, Omit } from '@prisma/client/runtime/library';

export type prismaRunner = Omit<
	PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
