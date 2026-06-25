export const isMatch = (routeConfig: string, pathname: string): boolean => {
  const route = routeConfig.length > 1 && routeConfig.endsWith("/") ? routeConfig.slice(0, -1) : routeConfig;
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (route.endsWith("*")) {
    const prefix = route.slice(0, -1);
    
    if (path === prefix) return true;
    
    if (prefix.endsWith("/")) {
      return path.startsWith(prefix);
    }
    return path.startsWith(prefix + "/");
  }

  return route === path;
};
