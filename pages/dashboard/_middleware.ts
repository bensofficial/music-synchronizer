import { middlewareRequireAuth } from "$lib/auth/session/sessionWrappers";
import { NextResponse } from "next/server";

export const middleware = middlewareRequireAuth(() => NextResponse.next());
