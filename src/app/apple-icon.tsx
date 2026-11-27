import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#1e40af"/><path d="M140 282 172 200q8-22 30-22h108q22 0 30 22l32 82" fill="none" stroke="#fff" stroke-width="28" stroke-linejoin="round"/><rect x="100" y="268" width="312" height="100" rx="38" fill="#f59e0b"/><rect x="140" y="302" width="44" height="20" rx="10" fill="#fff"/><rect x="328" y="302" width="44" height="20" rx="10" fill="#fff"/><circle cx="174" cy="368" r="36" fill="#0b1533" stroke="#fff" stroke-width="12"/><circle cx="338" cy="368" r="36" fill="#0b1533" stroke="#fff" stroke-width="12"/></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`data:image/svg+xml;base64,${Buffer.from(SVG).toString("base64")}`} width={180} height={180} alt="" />
    ),
    size,
  );
}
