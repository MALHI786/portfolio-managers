/**
 * Simple authentication for dashboard access
 * Uses a password stored in environment variables
 * Only the admin (you) should know this password
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function verifyPassword(password: string): boolean {
    if (!ADMIN_PASSWORD) {
        console.error('ADMIN_PASSWORD not configured in environment variables');
        return false;
    }
    return password === ADMIN_PASSWORD;
}

export function isAuthConfigured(): boolean {
    return !!ADMIN_PASSWORD;
}
