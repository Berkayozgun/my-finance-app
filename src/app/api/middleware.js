import {NextResponse} from 'next/server';

export function middleware(request) {
    const token = request.headers.get('Authorization');

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();

}

export const config = {
    matcher : ['/dashboard'],
    
};