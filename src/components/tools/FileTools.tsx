import { useEffect, useRef, useState } from "react";

import { ErrorNote, ResultPanel } from "./BasicTools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBytes, site } from "@/config/site";
import type { Tool } from "@/data/types";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

const FRIENDLY_FAIL = "Something went wrong while processing your file. Please try again.";

function DropZone({
  accept,
  multiple,
  onFiles,
  hint,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFiles([...e.dataTransfer.files]);
      }}
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
        dragging ? "border-primary bg-primary-soft" : "border-input bg-surface"
      }`}
    >
      <p className="text-sm font-semibold text-foreground">
        Drag and drop {multiple ? "files" : "a file"} here
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <Button type="button" className="mt-4" onClick={() => inputRef.current?.click()}>
        Choose {multiple ? "files" : "file"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => onFiles([...(e.target.files ?? [])])}
      />
    </div>
  );
}

export function ImageTool({
  tool,
  mode,
  to,
}: {
  tool: Tool;
  mode: "compress" | "resize" | "convert" | "crop";
  to?: "png" | "jpeg" | "webp" | undefined;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">(to ?? "jpeg");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [crop, setCrop] = useState({ x: "0", y: "0", w: "", h: "" });
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setFile(null);
    setDims(null);
    setResult(null);
    setError("");
  };

  const accept = (files: File[]) => {
    const next = files[0];
    setError("");
    setResult(null);
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (next.size > site.limits.imageBytes) {
      setError("This file exceeds the current upload limit.");
      return;
    }
    setFile(next);
    const img = new Image();
    const url = URL.createObjectURL(next);
    img.onload = () => {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      setCrop({ x: "0", y: "0", w: String(img.naturalWidth), h: String(img.naturalHeight) });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const process = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const bitmap = await createImageBitmap(file);
      let outW = bitmap.width;
      let outH = bitmap.height;
      let sx = 0;
      let sy = 0;
      let sw = bitmap.width;
      let sh = bitmap.height;

      if (mode === "resize") {
        outW = Math.max(1, Math.round(Number.parseFloat(width) || bitmap.width));
        outH = lockRatio
          ? Math.max(1, Math.round((outW / bitmap.width) * bitmap.height))
          : Math.max(1, Math.round(Number.parseFloat(height) || bitmap.height));
      } else if (mode === "crop") {
        sx = Math.max(0, Math.round(Number.parseFloat(crop.x) || 0));
        sy = Math.max(0, Math.round(Number.parseFloat(crop.y) || 0));
        sw = Math.min(bitmap.width - sx, Math.round(Number.parseFloat(crop.w) || bitmap.width));
        sh = Math.min(bitmap.height - sy, Math.round(Number.parseFloat(crop.h) || bitmap.height));
        if (sw <= 0 || sh <= 0) throw new Error("bad-crop");
        outW = sw;
        outH = sh;
      }

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no-ctx");
      const outType = mode === "compress" ? (file.type === "image/png" ? "image/png" : "image/jpeg") : `image/${format}`;
      if (outType !== "image/png") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);
      }
      ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, outType, quality / 100),
      );
      if (!blob) throw new Error("no-blob");
      const ext = outType.split("/")[1] === "jpeg" ? "jpg" : outType.split("/")[1];
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: `${file.name.replace(/\.[^.]+$/, "")}-${tool.slug}.${ext}`,
      });
      setDims({ w: outW, h: outH });
      track("tool_completed", { tool: tool.slug });
    } catch {
      setError(mode === "crop" ? "Please enter a crop area inside the image." : FRIENDLY_FAIL);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <DropZone
          accept="image/*"
          onFiles={accept}
          hint={`JPG, PNG or WebP · up to ${formatBytes(site.limits.imageBytes, 0)} · processed on your device, never uploaded`}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{file.name}</p>
              <p className="text-muted-foreground">
                {file.type.replace("image/", "").toUpperCase()} · {formatBytes(file.size)}
                {dims ? ` · ${dims.w} × ${dims.h} px` : ""}
              </p>
            </div>
            <Button type="button" variant="ghost" onClick={reset}>
              Remove
            </Button>
          </div>

          {mode === "resize" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="img-w">Width (px)</Label>
                <Input id="img-w" inputMode="numeric" value={width} className="h-12" onChange={(e) => setWidth(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="img-h">Height (px)</Label>
                <Input
                  id="img-h"
                  inputMode="numeric"
                  value={lockRatio && dims ? String(Math.round(((Number.parseFloat(width) || dims.w) / dims.w) * dims.h)) : height}
                  disabled={lockRatio}
                  className="h-12"
                  onChange={(e) => setHeight(e.target.value)}
                />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
                  Lock aspect ratio
                </label>
              </div>
            </div>
          ) : null}

          {mode === "crop" ? (
            <div className="grid gap-4 sm:grid-cols-4">
              {(
                [
                  ["x", "Offset X"],
                  ["y", "Offset Y"],
                  ["w", "Width"],
                  ["h", "Height"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`crop-${key}`}>{label} (px)</Label>
                  <Input
                    id={`crop-${key}`}
                    inputMode="numeric"
                    className="h-12"
                    value={crop[key]}
                    onChange={(e) => setCrop((p) => ({ ...p, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {mode === "convert" && !to ? (
            <div className="space-y-1.5">
              <Label>Output format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as typeof format)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {format !== "png" || mode === "compress" ? (
            <div className="space-y-1.5">
              <Label htmlFor="quality">Quality: {quality}%</Label>
              <input
                id="quality"
                type="range"
                min={30}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" size="lg" disabled={busy} onClick={process}>
              {busy ? "Processing…" : mode === "compress" ? "Compress image" : mode === "resize" ? "Resize image" : mode === "crop" ? "Crop image" : "Convert image"}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={reset}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {error ? <ErrorNote message={error} /> : null}

      {result ? (
        <div className="space-y-3">
          <ResultPanel
            label="Result"
            value={formatBytes(result.size)}
            copyValue={result.name}
            notes={[
              file ? `Original: ${formatBytes(file.size)}` : "",
              file && result.size < file.size
                ? `Saved ${Math.round((1 - result.size / file.size) * 100)}% of the original size`
                : "",
              dims ? `Output dimensions: ${dims.w} × ${dims.h} px` : "",
            ].filter(Boolean)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={result.url}
              download={result.name}
              onClick={() => track("download_clicked", { tool: tool.slug })}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Download
            </a>
            <img src={result.url} alt="Processed preview" className="h-20 w-auto rounded-lg border border-border" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PdfTool({
  tool,
  mode,
}: {
  tool: Tool;
  mode: "compress" | "merge" | "split" | "extract" | "jpg-to-pdf" | "pdf-to-jpg";
}) {
  const multiple = mode === "merge" || mode === "jpg-to-pdf";
  const isImageInput = mode === "jpg-to-pdf";
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("1");
  const [scale, setScale] = useState("2");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [outputs, setOutputs] = useState<{ url: string; name: string; size: number }[]>([]);

  const accept = (incoming: File[]) => {
    setError("");
    setOutputs([]);
    const limit = isImageInput ? site.limits.imageBytes : site.limits.pdfBytes;
    const valid = incoming.filter((f) =>
      isImageInput ? f.type.startsWith("image/") : f.type === "application/pdf",
    );
    if (!valid.length) {
      setError(isImageInput ? "Please choose JPG or PNG images." : "Please choose a PDF file.");
      return;
    }
    if (valid.some((f) => f.size > limit)) {
      setError("This file exceeds the current upload limit.");
      return;
    }
    setFiles(multiple ? valid.slice(0, site.limits.maxFiles) : valid.slice(0, 1));
  };

  const parseRanges = (input: string, total: number) => {
    const out: number[] = [];
    for (const part of input.split(",")) {
      const [a, b] = part.trim().split("-").map((s) => Number.parseInt(s, 10));
      if (!a || Number.isNaN(a)) continue;
      const end = b && !Number.isNaN(b) ? b : a;
      for (let i = a; i <= end; i++) if (i >= 1 && i <= total) out.push(i);
    }
    return out;
  };

  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    setError("");
    setOutputs([]);
    try {
      if (mode === "pdf-to-jpg") {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = (
          await import("pdfjs-dist/build/pdf.worker.min.mjs?url")
        ).default;
        const data = new Uint8Array(await files[0]!.arrayBuffer());
        const doc = await pdfjs.getDocument({ data }).promise;
        const made: typeof outputs = [];
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: Number.parseFloat(scale) || 2 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.9));
          if (blob) made.push({ url: URL.createObjectURL(blob), name: `page-${i}.jpg`, size: blob.size });
        }
        setOutputs(made);
      } else {
        const { PDFDocument } = await import("pdf-lib");

        if (mode === "jpg-to-pdf") {
          const doc = await PDFDocument.create();
          for (const file of files) {
            const bytes = new Uint8Array(await file.arrayBuffer());
            const img = file.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
            const page = doc.addPage([img.width, img.height]);
            page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
          }
          const bytes = await doc.save({ useObjectStreams: true });
          const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
          setOutputs([{ url: URL.createObjectURL(blob), name: "images.pdf", size: blob.size }]);
        } else if (mode === "merge") {
          const doc = await PDFDocument.create();
          for (const file of files) {
            const src = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()));
            const copied = await doc.copyPages(src, src.getPageIndices());
            copied.forEach((p) => doc.addPage(p));
          }
          const bytes = await doc.save({ useObjectStreams: true });
          const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
          setOutputs([{ url: URL.createObjectURL(blob), name: "merged.pdf", size: blob.size }]);
        } else {
          const src = await PDFDocument.load(new Uint8Array(await files[0]!.arrayBuffer()));
          const total = src.getPageCount();

          if (mode === "compress") {
            const bytes = await src.save({ useObjectStreams: true });
            const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
            setOutputs([{ url: URL.createObjectURL(blob), name: "compressed.pdf", size: blob.size }]);
          } else if (mode === "split") {
            const at = Math.min(Math.max(1, Number.parseInt(pages, 10) || 1), total - 1);
            const made: typeof outputs = [];
            for (const [label, range] of [
              ["part-1", Array.from({ length: at }, (_, i) => i)],
              ["part-2", Array.from({ length: total - at }, (_, i) => at + i)],
            ] as const) {
              const doc = await PDFDocument.create();
              const copied = await doc.copyPages(src, range as number[]);
              copied.forEach((p) => doc.addPage(p));
              const bytes = await doc.save({ useObjectStreams: true });
              const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
              made.push({ url: URL.createObjectURL(blob), name: `${label}.pdf`, size: blob.size });
            }
            setOutputs(made);
          } else {
            const list = parseRanges(pages, total);
            if (!list.length) throw new Error("no-pages");
            const doc = await PDFDocument.create();
            const copied = await doc.copyPages(src, list.map((p) => p - 1));
            copied.forEach((p) => doc.addPage(p));
            const bytes = await doc.save({ useObjectStreams: true });
            const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
            setOutputs([
              { url: URL.createObjectURL(blob), name: `extracted-${list.length}-pages.pdf`, size: blob.size },
            ]);
          }
        }
      }
      track("tool_completed", { tool: tool.slug });
    } catch {
      setError(FRIENDLY_FAIL);
    } finally {
      setBusy(false);
    }
  };

  const original = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-5">
      {!files.length ? (
        <DropZone
          accept={isImageInput ? "image/jpeg,image/png" : "application/pdf"}
          multiple={multiple}
          onFiles={accept}
          hint={`${isImageInput ? "JPG or PNG" : "PDF"} · up to ${formatBytes(isImageInput ? site.limits.imageBytes : site.limits.pdfBytes, 0)} per file${multiple ? ` · max ${site.limits.maxFiles} files` : ""} · processed on your device`}
        />
      ) : (
        <div className="space-y-4">
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface text-sm">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="min-w-0 truncate font-medium text-foreground">
                  {i + 1}. {f.name}
                </span>
                <span className="shrink-0 text-muted-foreground">{formatBytes(f.size)}</span>
              </li>
            ))}
          </ul>

          {mode === "split" ? (
            <div className="space-y-1.5">
              <Label htmlFor="split-at">Split after page</Label>
              <Input id="split-at" inputMode="numeric" value={pages} className="h-12" onChange={(e) => setPages(e.target.value)} />
            </div>
          ) : null}

          {mode === "extract" ? (
            <div className="space-y-1.5">
              <Label htmlFor="page-list">Pages to extract</Label>
              <Input id="page-list" placeholder="1, 4-6, 9" value={pages} className="h-12" onChange={(e) => setPages(e.target.value)} />
            </div>
          ) : null}

          {mode === "pdf-to-jpg" ? (
            <div className="space-y-1.5">
              <Label htmlFor="scale">Render scale</Label>
              <Select value={scale} onValueChange={setScale}>
                <SelectTrigger id="scale" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1× (preview)</SelectItem>
                  <SelectItem value="2">2× (sharing)</SelectItem>
                  <SelectItem value="3">3× (print)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" size="lg" disabled={busy} onClick={run}>
              {busy ? "Processing…" : tool.name}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => {
                setFiles([]);
                setOutputs([]);
                setError("");
              }}
            >
              Clear
            </Button>
          </div>
          {busy ? (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
            </div>
          ) : null}
        </div>
      )}

      {error ? <ErrorNote message={error} /> : null}

      {outputs.length ? (
        <div className="space-y-3">
          <ResultPanel
            label="Ready to download"
            value={`${outputs.length} file${outputs.length === 1 ? "" : "s"}`}
            copyValue={outputs.map((o) => o.name).join(", ")}
            notes={[
              `Input size: ${formatBytes(original)}`,
              `Output size: ${formatBytes(outputs.reduce((s, o) => s + o.size, 0))}`,
            ]}
          />
          <ul className="flex flex-wrap gap-3">
            {outputs.map((o) => (
              <li key={o.name}>
                <a
                  href={o.url}
                  download={o.name}
                  onClick={() => track("download_clicked", { tool: tool.slug })}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Download {o.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

type QrType = "url" | "text" | "email" | "phone" | "wifi" | "vcard";

export function QrTool({ tool }: { tool: Tool }) {
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ url: "https://" });
  const [size, setSize] = useState("512");
  const [ecl, setEcl] = useState<"L" | "M" | "Q" | "H">("M");
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

  const payload = () => {
    switch (type) {
      case "url":
        return (fields["url"] ?? "").trim();
      case "text":
        return fields["text"] ?? "";
      case "email":
        return `mailto:${fields["email"] ?? ""}${fields["subject"] ? `?subject=${encodeURIComponent(fields["subject"])}` : ""}`;
      case "phone":
        return `tel:${(fields["phone"] ?? "").replace(/\s/g, "")}`;
      case "wifi":
        return `WIFI:T:${fields["security"] ?? "WPA"};S:${fields["ssid"] ?? ""};P:${fields["password"] ?? ""};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${fields["name"] ?? ""}\nTEL:${fields["phone"] ?? ""}\nEMAIL:${fields["email"] ?? ""}\nORG:${fields["org"] ?? ""}\nEND:VCARD`;
    }
  };

  const generate = async () => {
    const data = payload();
    setError("");
    if (!data || data === "https://" || data === "mailto:" || data === "tel:") {
      setError("Please fill in the details for your QR code.");
      return;
    }
    if (type === "url" && !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(data)) {
      setError("Please enter a valid URL.");
      return;
    }
    try {
      const QR = await import("qrcode");
      const opts = {
        errorCorrectionLevel: ecl,
        width: Number.parseInt(size, 10) || 512,
        margin: 2,
        color: { dark: "#1b2559ff", light: "#ffffffff" },
      } as const;
      setPng(await QR.toDataURL(data, opts));
      setSvg(await QR.toString(data, { ...opts, type: "svg" }));
      track("qr_generated", { tool: tool.slug, qr_type: type });
    } catch {
      setError("We couldn't generate that QR code. Please shorten the content and try again.");
    }
  };

  const inputs: Record<QrType, { key: string; label: string; placeholder?: string; area?: boolean }[]> = {
    url: [{ key: "url", label: "URL", placeholder: "https://example.com" }],
    text: [{ key: "text", label: "Text", area: true }],
    email: [
      { key: "email", label: "Email address", placeholder: "hello@example.com" },
      { key: "subject", label: "Subject (optional)" },
    ],
    phone: [{ key: "phone", label: "Phone number", placeholder: "+1 555 0100" }],
    wifi: [
      { key: "ssid", label: "Network name (SSID)" },
      { key: "password", label: "Password" },
      { key: "security", label: "Security (WPA, WEP or nopass)", placeholder: "WPA" },
    ],
    vcard: [
      { key: "name", label: "Full name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "org", label: "Organisation" },
    ],
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>QR code type</Label>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v as QrType);
              setFields(v === "url" ? { url: "https://" } : {});
              setPng("");
              setSvg("");
            }}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="url">URL / link</SelectItem>
              <SelectItem value="text">Plain text</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone number</SelectItem>
              <SelectItem value="wifi">Wi-Fi network</SelectItem>
              <SelectItem value="vcard">Contact card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {inputs[type].map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={`qr-${f.key}`}>{f.label}</Label>
            {f.area ? (
              <Textarea
                id={`qr-${f.key}`}
                value={fields[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
                className="min-h-28"
              />
            ) : (
              <Input
                id={`qr-${f.key}`}
                value={fields[f.key] ?? ""}
                placeholder={f.placeholder}
                className="h-12"
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["256", "512", "1024"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s} × {s} px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Error correction</Label>
            <Select value={ecl} onValueChange={(v) => setEcl(v as typeof ecl)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">L — 7%</SelectItem>
                <SelectItem value="M">M — 15% (recommended)</SelectItem>
                <SelectItem value="Q">Q — 25%</SelectItem>
                <SelectItem value="H">H — 30%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" size="lg" onClick={generate}>
            Generate QR code
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => {
              setFields(type === "url" ? { url: "https://" } : {});
              setPng("");
              setSvg("");
              setError("");
            }}
          >
            Clear
          </Button>
        </div>
        {error ? <ErrorNote message={error} /> : null}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-6">
        {png ? (
          <>
            <img src={png} alt="Generated QR code" className="size-52 rounded-xl bg-card p-2" />
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={png}
                download="qr-code.png"
                onClick={() => track("download_clicked", { tool: tool.slug, format: "png" })}
                className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                Download PNG
              </a>
              <a
                href={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
                download="qr-code.svg"
                onClick={() => track("download_clicked", { tool: tool.slug, format: "svg" })}
                className="inline-flex h-11 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold text-foreground"
              >
                Download SVG
              </a>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Your QR code preview will appear here.
          </p>
        )}
      </div>
    </div>
  );
}

export function ShortenerTool({ tool }: { tool: Tool }) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ code: string; url: string } | null>(null);
  const [qr, setQr] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shortUrl = created ? `${origin}/${created.code}` : "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setQr("");
    const value = url.trim();
    if (!/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(value)) {
      setError("Please enter a valid URL, including https://");
      return;
    }
    setBusy(true);
    const { data, error: rpcError } = await supabase.rpc("create_short_link", {
      p_original_url: value,
      ...(slug.trim() ? { p_short_code: slug.trim().toLowerCase() } : {}),
    });
    setBusy(false);

    if (rpcError) {
      const message = rpcError.message.includes("slug_taken")
        ? "That custom link is already taken. Please try another."
        : rpcError.message.includes("reserved_slug")
          ? "That custom link is reserved by the site. Please choose another."
          : rpcError.message.includes("invalid_slug")
            ? "Custom links must be 3–32 characters using letters, numbers and hyphens."
            : rpcError.message.includes("invalid_url")
              ? "Please enter a valid URL."
              : "We couldn't shorten that link. Please try again.";
      setError(message);
      return;
    }

    const row = data as unknown as { short_code: string; original_url: string } | null;
    if (!row) {
      setError("We couldn't shorten that link. Please try again.");
      return;
    }
    setCreated({ code: row.short_code, url: row.original_url });
    track("link_shortened", { custom: Boolean(slug.trim()) });
  };

  return (
    <div className="space-y-5">
      {!created ? (
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="long-url">Paste your long URL</Label>
            <Input
              id="long-url"
              inputMode="url"
              placeholder="https://example.com/my-product-page"
              value={url}
              className="h-12 text-base"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Custom link (optional)</Label>
            <div className="flex items-center gap-2">
              <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                {(origin || `https://${site.domain}`).replace(/^https?:\/\//, "")}/
              </span>
              <Input
                id="slug"
                placeholder="myproduct"
                value={slug}
                className="h-12 text-base"
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              3–32 characters: letters, numbers and hyphens. System paths are reserved.
            </p>
          </div>
          <Button type="submit" size="lg" disabled={busy} className="min-w-40">
            {busy ? "Shortening…" : "Shorten URL"}
          </Button>
          {error ? <ErrorNote message={error} /> : null}
        </form>
      ) : (
        <div className="space-y-4">
          <ResultPanel label="Your short URL" value={shortUrl} copyValue={shortUrl} notes={[`Destination: ${created.url}`]} />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(shortUrl);
              }}
            >
              Copy
            </Button>
            <Button type="button" variant="outline" asChild>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const QR = await import("qrcode");
                setQr(await QR.toDataURL(shortUrl, { width: 512, margin: 2 }));
              }}
            >
              QR code
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setCreated(null);
                setUrl("");
                setSlug("");
                setQr("");
              }}
            >
              Create another
            </Button>
          </div>
          {qr ? (
            <div className="flex items-center gap-4">
              <img src={qr} alt="QR code for your short link" className="size-32 rounded-xl border border-border bg-card p-2" />
              <a
                href={qr}
                download="short-link-qr.png"
                className="inline-flex h-11 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold"
              >
                Download PNG
              </a>
            </div>
          ) : null}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Links work without an account. Sign in to save your links and see click analytics.
      </p>
    </div>
  );
}
