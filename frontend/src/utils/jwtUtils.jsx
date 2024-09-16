import { jwtDecode } from "jwt-decode";

export function decodeToken(token) {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
}

export function getId(token) {
    const decoded = decodeToken(token);
    return decoded ? decoded.userId : null;
}

export function getUsername(token) {
    const decoded = decodeToken(token);
    return decoded ? decoded.username : null;
}

export function getRank(token) {
    const decoded = decodeToken(token);
    return decoded ? decoded.rank : null;
}

export function getRoles(token) {
    const decoded = decodeToken(token);
    return decoded ? decoded.roles : [];
}