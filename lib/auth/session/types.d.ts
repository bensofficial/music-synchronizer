import { User } from "@prisma/client";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiRequest,
} from "next";

interface SessionConfig {
	cookieName: string;
	cookieOptions: {
		httpOnly: boolean;
		secure: boolean = true;
		sameSite: "Strict" | "Lax" | "None";
		maxAge: number;
		path: string;
		domain?: string;
		expires?: Date;
	};
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
