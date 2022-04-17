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

/**
 *
 * Can be used in `api routes` to access the session data via `req.session`. E.g:
 *
 * ```
 * export default apiWithSession((req, res) => {
 * 	const sessionUser = req.session.user
 * })
 * ```
 */
export const apiWithSession = (
	handler: Parameters<typeof withIronSessionApiRoute>[0],
): NextApiHandler => {
	if (!process.env.COOKIE_SECRET) {
		return (_req, res) => {
			res.status(500).send({
				errors: [
					{
						message:
							"API Authorization secret is undefined, server can't handle requests at the moment.",
					},
				],
			});
		};
	}

	return withIronSessionApiRoute(handler, config);
};

/**
 * Can be used in `getServerSideProps` to access the session data via `req.session`.
 *
 * The function is generic, you have to define the type of the props in
 * angled brackets. If no type is given it is assumed to be an empty object
 *
 * E.g:
 * ```
 * import type {SessionUser} from "$lib/auth";
 *
 * export const getServerSideProps = ssrWithSession<{sessionUser: sessionUser}>(({req}) => {
 * 		const sessionUser = req.session.user;
 *
 * 		return {
 * 			props: {
 * 				sessionUser,
 * 			}
 * 		}
 * })
 * ```
 * This Syntax must be used. The following would not work:
 * ```
 * export function getServerSideProps() {
 * 		return ssrWithSession(({req}) => {
 * 			const sessionUser = req.session.user;
 *
 * 			return {
 * 				props: {
 * 					sessionUser,
 * 				}
 * 			}
 * 		});
 * }
 * ```
 */
export const ssrWithSession = <
	P extends { [key: string]: unknown } = Record<string, never>,
>(
	handler: (
		context: GetServerSidePropsContext,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) => {
	if (!process.env.COOKIE_SECRET) {
		return async () => ({ notFound: true });
	}

	return withIronSessionSsr(handler, config);
};

/**
 * Can be used in `getServerSideProps` to ensure that the callback is only executed
 * when the client is authenticated
 *
 * If the user who requests the page is not authenticated he will be redirected to `/login`.
 * That means that only authenticated users will be able to access the page
 *
 * The function is generic. You have to define the return type of the props in angled brackets.
 * If no type is given it is assumed to be an empty object;
 *
 * Only this syntax must be used (its the same as with `ssrWithSession`)
 * ```
 * import type {SessionUser} from "$lib/auth";
 *
 * export const getServerSideProps = ssrRequireAuth<{sessionUser: sessionUser}>(({req}, sessionUser) => {
 * 		//do something with the sessionUser. Most simple thing to do:
 * 		return {
 * 			props: {
 * 				sessionUser
 * 			}
 * 		}
 * });
 * ```
 */
export const ssrRequireAuth = <
	P extends { [key: string]: unknown } = Record<string, never>,
>(
	callback: (
		context: GetServerSidePropsContext,
		sessionUser: SessionUser,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) => {
	return ssrWithSession((context) => {
		const sessionUser = context.req.session.user;

		if (!sessionUser) {
			return {
				redirect: {
					destination: "/login",
					permanent: false,
				},
			};
		}

		return callback(context, sessionUser);
	});
};

/**
 * Can be used in `api routes` to ensure that the callback is only executed if the client
 * who called the route is authenticated
 *
 * If the user who sent the request is not authenticated a `Not authorized` error message will be
 * sent. (Status Code: 403)
 *
 * ```
 * export default apiRequireAuth((req, res, sessionUser) => {
 * 		//do something with the sessionUser
 * });
 * ```
 */
export const apiRequireAuth = (
	callback: (
		req: NextApiRequest,
		res: NextApiResponse,
		sessionUser: SessionUser,
	) => void | Promise<void>,
) => {
	return apiWithSession((req, res) => {
		const sessionUser = req.session.user;

		if (!sessionUser) {
			return res.status(403).send({
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
