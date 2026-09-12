/** Standalone worlds are deliberately outside the core site's visual system. */
export function usesEditorialDesign(pathname: string) {
  return !["/rouge-noir", "/okiso-grain", "/grain"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
