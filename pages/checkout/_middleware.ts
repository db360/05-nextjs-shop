import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwt } from "../../utils";

export async function middleware(req:NextRequest, ev:NextFetchEvent) {

    const {token = ''} = req.cookies;

    // return new Response('No Autorizado', { // JS
    //     status: 401
    // })
    const url = req.nextUrl.clone()
    const requestedPage =  req.page.name;

    try {
        await jwt.isValidToken(token);  // Si hay token
        return NextResponse.next();     // Pasamos a la siguiente pagina

    } catch (error) {

        // console.log(url.origin)
        return NextResponse.redirect( `${ url.origin }/auth/login?p=${ requestedPage }`) // query para redirect una vez hecho el login
    }
}