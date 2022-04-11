import type { IronSessionOptions } from "iron-session";
import type {
	NextApiHandler,
	GetServerSidePropsResult,
	GetServerSidePropsContext,
} from "next";
import {
	hash,
	verify,
	Options as ArgonOptions,
	argon2id,
	needsRehash,
} from "argon2";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const argonOptions: ArgonOptions & { raw?: false } = {
	hashLength: 32,
	memoryCost: 4096,
	parallelism: 2,
	saltLength: 16,
	timeCost: 3,
	type: argon2id,
};

export const hashPassword = (password: string) => hash(password, argonOptions);
export const verifyPassword = (password: string, passwordHash: string) =>
	verify(passwordHash, password, argonOptions);
export const shouldRehashPassword = (passwordHash: string) =>
	needsRehash(passwordHash, argonOptions);

const config: IronSessionOptions = {
	cookieName: "auth",
	cookieOptions: {
		sameSite: process.env.NODE_ENV !== "development" ? "strict" : "none",
		secure: process.env.NODE_ENV !== "development",
	},
	password: process.env["CMS_COOKIE_SECRET"]!,
};

export const apiAuth = (
	handler: Parameters<typeof withIronSessionApiRoute>[0],
): NextApiHandler =>
	process.env["CMS_COOKIE_SECRET"]
		? withIronSessionApiRoute(handler, config)
		: (_req, res) =>
				res.status(500).send({
					errors: [
						{
							message:
								"API Authorization secret is undefined, server can't handle requests at the moment.",
						},
					],
				});

export const ssrAuth = <
	P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
	handler: (
		context: GetServerSidePropsContext,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
): ((
	context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<P>>) =>
	process.env["CMS_COOKIE_SECRET"]
		? withIronSessionSsr(handler, config)
		: // eslint-disable-next-line require-await
		  async () => ({
				notFound: true,
		  });
