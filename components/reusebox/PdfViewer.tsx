"use client";

import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const getFetchUrl = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const publicPath = url.startsWith("/") ? url.slice(1) : url;
  return `/api/pdf?path=${encodeURIComponent(publicPath)}`;
};

type PdfViewerProps = {
  url: string;
};

const PdfViewer = ({ url }: PdfViewerProps) => {
  const [file, setFile] = useState<Uint8Array | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      setFile(null);

      try {
        const response = await fetch(getFetchUrl(url));
        if (!response.ok) {
          throw new Error("Failed to fetch PDF");
        }

        const buffer = await response.arrayBuffer();
        if (buffer.byteLength === 0) {
          throw new Error("Empty PDF");
        }
        if (!cancelled) {
          setFile(new Uint8Array(buffer));
        }
      } catch {
        if (!cancelled) {
          setError("تعذر تحميل ملف PDF. يرجى المحاولة مرة أخرى.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadPdf();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex h-[85vh] items-center justify-center bg-[#525659] text-sm text-white">
        جاري تحميل الملف...
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="flex h-[85vh] items-center justify-center bg-[#525659] text-sm text-red-200">
        {error ?? "تعذر عرض الملف"}
      </div>
    );
  }

  return (
    <Worker workerUrl={WORKER_URL}>
      <div className="h-[85vh]">
        <Viewer fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
      </div>
    </Worker>
  );
};

export default PdfViewer;
