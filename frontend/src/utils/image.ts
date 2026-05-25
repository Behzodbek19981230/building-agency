const SERVER_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace('/api/v1', '');

export function getImageUrl(path?: string | null): string | undefined {
	if (!path) return undefined;
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	if (path.startsWith('/')) return `${SERVER_URL}${path}`;
	return path;
}
