import { CookieOptions } from "$lib/cookie";
import { User } from "@prisma/client";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiRequest,
} from "next";

interface SessionConfig {
	cookieName: string;
	cookieOptions: CookieOptions;
	password: string;
}

interface SessionUser {
	id: number;
}

interface SessionData {
	user: SessionUser;
}

interface Session {
	data?: SessionData | null;
	save: (data: SessionData) => Promise<void>;
	destroy: () => void;
}
