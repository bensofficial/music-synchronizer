import { User } from "@prisma/client";

export default interface SessionUser {
	id: number;
}

declare module "iron-session" {
	interface IronSessionData {
		user?: SessionUser;
	}
}
