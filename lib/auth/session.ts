import type { IronSessionOptions } from "iron-session";
import type {
	NextApiHandler,
	GetServerSidePropsResult,
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse,
} from "next";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import "./auth.d.ts";
import SessionUser from "./auth";

const config: IronSessionOptions = {
	cookieName: "auth",
	cookieOptions: {
		sameSite: process.env.NODE_ENV !== "development" ? "strict" : "none",
		secure: process.env.NODE_ENV !== "development",
	},
	password: process.env["COOKIE_SECRET"]!,
};

export const apiAuth = (
	handler: Parameters<typeof withIronSessionApiRoute>[0],
): NextApiHandler => {
	if (!process.env["COOKIE_SECRET"]) {
		return (_req, res) =>
			res.status(500).send({
				errors: [
					{
						message:
							"API Authorization secret is undefined, server can't handle requests at the moment.",
					},
				],
			});
	}

	return withIronSessionApiRoute(handler, config);
};

export const ssrAuth = <
	P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
	handler: (
		context: GetServerSidePropsContext,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
): ((
	context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<P>>) => {
	if (!process.env["COOKIE_SECRET"]) {
		return async () => ({ notFound: true });
	}

	return withIronSessionSsr(handler, config);
};

export const ssrRequireAuth = () => {
	return ssrAuth(({ req }) => {
		const userSessionData = req.session.user;

		if (!userSessionData) {
			console.log("returning");
			return {
				redirect: {
					destination: "/login",
					permanent: false,
				},
			};
		}

		return {
			props: {
				userId: userSessionData.id,
			},
		};
	});
};

export const apiRequireAuth = (
	callback: (
		req: NextApiRequest,
		res: NextApiResponse,
		sessionUser: SessionUser,
	) => void | Promise<void>,
) => {
	return apiAuth((req, res) => {
		const sessionUser = req.session.user;

		if (!sessionUser) {
			return res.status(500).send({
				errors: [
					{
						message: "Not authorized",
					},
				],
			});
		}

		return callback(req, res, sessionUser);
	});
};
