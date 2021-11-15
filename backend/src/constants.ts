import { resolve } from 'path';

export const IDENTIFIER_REGEX = /[0-9a-f]{12}/;
export const SLUG_REGEX = /[^a-zA-Z0-9 -]/;
export const TITLE_REGEX = /^[a-zA-Z0-9 \-.,;:()"'\?\!]+$/;

export const CLIPS_DIR = resolve(process.cwd(), 'clips');

export const REVALIDATION_TIMEOUT = 60 * 60e3;

export namespace DATABASE {
	export const HOST = process.env.DATABASE_HOST || 'localhost';
	export const PORT = parseInt(process.env.DATABASE_PORT) || 5432;
	export const USERNAME = process.env.DATABASE_USERNAME || 'admin';
	export const PASSWORD = process.env.DATABASE_PASSWORD || 'password';
	export const NAME = process.env.DATABASE_NAME || 'clipping-service';
	export const LOGGING = process.env.NODE_ENV !== 'production';
}
