import { PrismaClient } from "@prisma/client";

declare global {
	var prisma: PrismaClient | undefined;
}

// https://pris.ly/d/help/next-js-best-practices
export default global.prisma ||
	(process.env.NODE_ENV !== "development" && new PrismaClient()) ||
	(global.prisma = new PrismaClient({
		errorFormat: "pretty",
		log: ["query", "info", "warn", "error"],
	}));
