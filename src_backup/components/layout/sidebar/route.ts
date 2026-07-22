export const isRouteActive = (
  currentPath: string,
  route: string,
  matchRoutes: string[] = [],
) => {
  const routes = [route, ...matchRoutes];

  return routes.some((item) => {
    if (item === "/") return currentPath === "/";

    return currentPath === item || currentPath.startsWith(`${item}/`);
  });
};
