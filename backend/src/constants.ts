export const IDENTIFIER_REGEX = /[0-9a-f]{12}/;

export namespace DATABASE {
	export const HOST = process.env.DATABASE_HOST || 'localhost';
	export const PORT = parseInt(process.env.DATABASE_PORT) || 5432;
	export const USERNAME = process.env.DATABASE_USERNAME || 'admin';
	export const PASSWORD = process.env.DATABASE_PASSWORD || 'password';
	export const NAME = process.env.DATABASE_NAME || 'clipping-service';
	export const LOGGING = process.env.NODE_ENV !== 'production';
}
