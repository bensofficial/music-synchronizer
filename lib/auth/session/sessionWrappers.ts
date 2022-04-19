import type {
	GetServerSidePropsContext,
	NextApiHandler,
	NextApiRequest,
	NextApiResponse,
} from "next";
import { GetSSPResultOpt, Session, SessionData } from "./types";
import { getSession, hasAuthCookie } from "./session";
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextMiddleware, NextResponse } from "next/server";

/**
 *
 * Can be used in `api routes` to access the session data via `session`. E.g:
 *
 * ```
 * export default apiWithSession((req, res, session) => {
 * 	const sessionUser = req.session.data?.user
 * })
 * ```
 */
export function apiWithSession(
	handler: (
		req: NextApiRequest,
		res: NextApiResponse,
		session: Session,
	) => void | Promise<void>,
): NextApiHandler {
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

	return async (req, res) => {
		const session = await getSession(req.cookies, res);

		return handler(req, res, session);
	};
}

/**
 * Can be used in `getServerSideProps` to access the session data via `session`
 *
 * The function is generic, you have to define the type of the props in
 * angled brackets. If no type is given it is assumed to be an empty object
 *
 * E.g:
 * ```
 * import type {SessionUser} from "$lib/auth";
 *
 * export const getServerSideProps = ssrWithSession<{sessionUser: sessionUser}>(({req}, session) => {
 * 		const sessionUser = session.data?.user;
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
 * 		return ssrWithSession(({req}, session) => {
 * 			const sessionUser = session.data?.user;
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
export function ssrWithSession<
	P extends { [key: string]: unknown } = Record<string, never>,
>(
	handler: (
		context: GetServerSidePropsContext,
		session: Session,
	) => GetSSPResultOpt<P>,
): (context: GetServerSidePropsContext) => GetSSPResultOpt<P> {
	if (!process.env.COOKIE_SECRET) {
		return async () => ({ notFound: true });
	}

	return async (context) => {
		const session = await getSession(context.req.cookies, context.res);

		return handler(context, session);
	};
}

export function middlewareRequireAuth(handler: NextMiddleware): NextMiddleware {
	if (!process.env.COOKIE_SECRET) {
		return () => NextResponse.error();
	}

	return async (request, event) => {
		if (!hasAuthCookie(request.cookies)) {
			const url = new URL(request.url);
			return NextResponse.redirect(`${url.protocol}//${url.host}/login`);
		}

		return handler(request, event);
	};
}

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
 * export const getServerSideProps = ssrRequireAuth<{sessionUser: sessionUser}>(({req}, _session, sessionData) => {
 * 		//do something with the sessionUser. Most simple thing to do:
 * 		return {
 * 			props: {
 * 				sessionUser: sessionData.user
 * 			}
 * 		}
 * });
 * ```
 */
export const ssrRequireAuth = <
	P extends { [key: string]: unknown } = Record<string, never>,
>(
	handler: (
		context: GetServerSidePropsContext,
		session: Session,
		sessionData: SessionData,
	) => GetSSPResultOpt<P>,
) => {
	return ssrWithSession<P>((context, session) => {
		if (!session.data) {
			return {
				redirect: {
					destination: "/login",
					permanent: false,
				},
			};
		}

		return handler(context, session, session.data);
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
 * export default apiRequireAuth((req, res, session, sessionData) => {
 * 		//do something with the sessionData
 * });
 * ```
 */
export const apiRequireAuth = (
	handler: (
		req: NextApiRequest,
		res: NextApiResponse,
		session: Session,
		sessionData: SessionData,
	) => void | Promise<void>,
) => {
	return apiWithSession((req, res, session) => {
		if (!session.data) {
			return res.status(403).send({
				errors: [
					{
						message: "Not authorized",
					},
				],
			});
		}

		return handler(req, res, session, session.data);
	});
};
