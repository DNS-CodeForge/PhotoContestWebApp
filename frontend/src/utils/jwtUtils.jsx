import { jwtDecode } from "jwt-decode";

export async function fetchPublicKey() {
    try {
        const response = await fetch('/publicKey.pem');
        if (!response.ok) {
            throw new Error('Failed to load public key');
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching public key:', error);
        throw error;
    }
}

export function decodeToken(token) {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
}
