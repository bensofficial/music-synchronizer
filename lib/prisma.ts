import { PrismaClient } from "@prisma/client";

declare global {
	// allow global `var` declarations

	var prisma: PrismaClient | undefined;
}

const prisma =
	global.prisma ??
	new PrismaClient({
		log: ["query", "info", "warn", "error"],
	});

export default prisma;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
