export const getParentPage = (url: URL): URL => new URL(url.pathname.endsWith('/') ? '../' : './', url);
