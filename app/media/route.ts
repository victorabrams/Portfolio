import { NextRequest } from "next/server";

const allowedHosts = new Set(["lh3.googleusercontent.com"]);

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  if (!source) return new Response("Missing image URL", { status: 400 });

  let imageUrl: URL;
  try {
    imageUrl = new URL(source);
  } catch {
    return new Response("Invalid image URL", { status: 400 });
  }

  if (imageUrl.protocol !== "https:" || !allowedHosts.has(imageUrl.hostname)) {
    return new Response("Unsupported image host", { status: 400 });
  }

  try {
    const upstream = await fetch(imageUrl, {
      cache: "no-store",
      headers: { Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8" },
    });
    const contentType = upstream.headers.get("content-type") || "";
    if (!upstream.ok || !contentType.startsWith("image/")) {
      return new Response("Image could not be loaded", { status: 502 });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return new Response("Image could not be loaded", { status: 502 });
  }
}
