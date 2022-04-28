import { User } from "@prisma/client";

export type UserWithoutDatesAndPassword = Omit<
	User,
	"createdAt" | "updatedAt" | "password"
>;
