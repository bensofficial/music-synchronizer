import { PrismaClient } from "@prisma/client";

declare global {
	// allow global `var` declarations

	var prisma: PrismaClient | undefined;
}

const prisma =
	global.prisma || process.env.NODE_ENV !== "development"
		? new PrismaClient()
		: new PrismaClient({
				errorFormat: "pretty",
				log: ["query", "info", "warn", "error"],
		  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
