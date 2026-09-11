"use client";

import { useMemo } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const WORKER_URL =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const getFetchUrl = (url: string) => {
  // Remote PDFs must go through our proxy to avoid browser CORS failures.
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/api/pdf?url=${encodeURIComponent(url)}`;
  }

  const publicPath = url.startsWith("/") ? url.slice(1) : url;
  return `/api/pdf?path=${encodeURIComponent(publicPath)}`;
};

type PdfViewerProps = {
  url: string;
};

const PdfViewer = ({ url }: PdfViewerProps) => {
  const fileUrl = useMemo(() => getFetchUrl(url), [url]);
  // Must be called at component top level — this plugin uses React hooks internally.
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Worker workerUrl={WORKER_URL}>
      <div className="h-[85vh] w-full min-w-0">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          renderLoader={(percentages: number) => (
            <div className="flex h-[85vh] w-full flex-col items-center justify-center gap-2 bg-[#525659] text-sm text-white">
              <span>جاري تحميل الملف...</span>
              {Number.isFinite(percentages) && percentages > 0 ? (
                <span className="tabular-nums text-white/80">
                  {Math.min(100, Math.round(percentages))}%
                </span>
              ) : null}
            </div>
          )}
          renderError={() => (
            <div className="flex h-[85vh] w-full items-center justify-center bg-[#525659] text-sm text-red-200">
              تعذر تحميل ملف PDF. يرجى المحاولة مرة أخرى.
            </div>
          )}
        />
      </div>
    </Worker>
  );
};

export default PdfViewer;
