import { PrismaClient } from "@prisma/client";

var prisma: PrismaClient | undefined;

// https://pris.ly/d/help/next-js-best-practices
export default prisma ||
	(process.env.NODE_ENV !== "development" && new PrismaClient()) ||
	(prisma = new PrismaClient({
		errorFormat: "pretty",
		log: ["query", "info", "warn", "error"],
	}));
