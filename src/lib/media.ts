export function responsiveMedia(src: string): string | undefined {
  if (!/^\/media\/[a-z0-9-]+\.(?:jpg|webp)$/.test(src) || src.includes("-sm.")) {
    if (src !== "/assets/brand/group-china-tour.png" && src !== "/assets/brand/group-china-tour.jpg") return undefined;
  }
  const name = src.split("/").pop()!.replace(/\.[^.]+$/, "");
  return [480, 960, 1600].map((width) => `/media/optimized/${name}-${width}.webp ${width}w`).join(", ");
}
