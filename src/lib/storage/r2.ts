import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import type { Env } from "../env";

let cachedClient: S3Client | null = null;

function getR2Client(env: Env) {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? "",
      },
    });
  }

  return cachedClient;
}

export async function createPresignedUpload(
  env: Env,
  {
    filename,
    contentType,
  }: {
    filename: string;
    contentType: string;
  },
) {
  const client = getR2Client(env);

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

  const url = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  return { url, key, publicUrl };
}

export async function createPresignedDownload(env: Env, key: string) {
  const client = getR2Client(env);

  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  return { url, key, publicUrl };
}
