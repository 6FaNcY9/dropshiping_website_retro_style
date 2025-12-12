"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

export function UploaderClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("Requesting presigned URL...");

    const res = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });

    if (!res.ok) {
      setStatus("Unable to request upload URL");
      setUploading(false);
      return;
    }

    const { url, publicUrl } = (await res.json()) as {
      url: string;
      publicUrl: string;
    };
    setStatus("Uploading to R2...");

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      setStatus("Upload failed");
      setUploading(false);
      return;
    }

    setImageUrl(publicUrl);
    setStatus("Uploaded successfully");
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-700 transition hover:border-brand-500">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="font-semibold">Click to choose an image</span>
        <span className="text-xs text-slate-500">
          Cloudflare R2 presigned upload
        </span>
      </label>
      {status && <p className="text-sm text-slate-600">{status}</p>}
      {imageUrl && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Image URL</p>
          <code className="block overflow-x-auto rounded-lg bg-slate-900/90 p-3 text-xs text-emerald-100">
            {imageUrl}
          </code>
          <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-lg border border-slate-200">
            <Image
              alt="Uploaded preview"
              src={imageUrl}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      {uploading && (
        <p className="text-xs text-slate-500">Processing upload...</p>
      )}
    </div>
  );
}
