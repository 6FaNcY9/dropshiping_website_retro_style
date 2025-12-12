import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { env } from "../env";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function createPresignedUpload({
  filename,
  contentType,
}: {
  filename: string;
  contentType: string;
}) {
  const extension = filename.includes(".")
    ? filename.substring(filename.lastIndexOf("."))
    : "";
  const key = `uploads/${crypto.randomUUID()}${extension}`;

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });

  const url = await getSignedUrl(r2Client, command, { expiresIn: 300 });
  const publicUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  return { url, key, publicUrl };
}
