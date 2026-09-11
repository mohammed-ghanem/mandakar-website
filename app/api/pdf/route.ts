import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const getAllowedRemoteHosts = () => {
  const hosts = new Set<string>(["backend.mandakar.net"]);
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  if (base) {
    try {
      hosts.add(new URL(base).host);
    } catch {
      // ignore invalid env URL
    }
  }

  return hosts;
};

const basePdfHeaders = {
  "Content-Type": "application/pdf",
  "Content-Disposition": "inline",
  "Cache-Control": "private, max-age=3600",
  "Accept-Ranges": "bytes",
};

const parseByteRange = (rangeHeader: string | null, fileSize: number) => {
  if (!rangeHeader) return null;

  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
  if (!match) return null;

  const startRaw = match[1];
  const endRaw = match[2];

  let start = startRaw ? Number(startRaw) : 0;
  let end = endRaw ? Number(endRaw) : fileSize - 1;

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (startRaw === "" && endRaw) {
    // suffix range: bytes=-500
    const suffix = Number(endRaw);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    start = Math.max(0, fileSize - suffix);
    end = fileSize - 1;
  }

  if (start < 0 || end < start || start >= fileSize) return null;
  end = Math.min(end, fileSize - 1);

  return { start, end };
};

const nodeStreamToWeb = (stream: NodeJS.ReadableStream) =>
  Readable.toWeb(stream as Readable) as unknown as ReadableStream;

async function proxyRemotePdf(remoteUrl: string, request: NextRequest) {
  let parsed: URL;
  try {
    parsed = new URL(remoteUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  }

  if (!getAllowedRemoteHosts().has(parsed.host)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const upstreamHeaders: HeadersInit = {
      Accept: "application/pdf,*/*",
    };
    const range = request.headers.get("range");
    if (range) {
      upstreamHeaders.Range = range;
    }

    const upstream = await fetch(parsed.toString(), {
      headers: upstreamHeaders,
      cache: "no-store",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: upstream.status },
      );
    }

    if (!upstream.body) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    const headers = new Headers(basePdfHeaders);
    const contentLength = upstream.headers.get("content-length");
    const contentRange = upstream.headers.get("content-range");
    const acceptRanges = upstream.headers.get("accept-ranges");

    if (contentLength) headers.set("Content-Length", contentLength);
    if (contentRange) headers.set("Content-Range", contentRange);
    if (acceptRanges) headers.set("Accept-Ranges", acceptRanges);

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 502 });
  }
}

async function serveLocalPdf(filePath: string, request: NextRequest) {
  if (!filePath || filePath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const absolutePath = path.join(PUBLIC_DIR, filePath);

  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile() || fileStat.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    const fileSize = fileStat.size;
    const range = parseByteRange(request.headers.get("range"), fileSize);

    if (range) {
      const { start, end } = range;
      const chunkSize = end - start + 1;
      const stream = createReadStream(absolutePath, { start, end });
      const headers = new Headers(basePdfHeaders);
      headers.set("Content-Length", String(chunkSize));
      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);

      return new NextResponse(nodeStreamToWeb(stream), {
        status: 206,
        headers,
      });
    }

    const stream = createReadStream(absolutePath);
    const headers = new Headers(basePdfHeaders);
    headers.set("Content-Length", String(fileSize));

    return new NextResponse(nodeStreamToWeb(stream), {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

export async function GET(request: NextRequest) {
  const remoteUrl = request.nextUrl.searchParams.get("url");
  if (remoteUrl) {
    return proxyRemotePdf(remoteUrl, request);
  }

  const filePath = request.nextUrl.searchParams.get("path");
  return serveLocalPdf(filePath ?? "", request);
}
