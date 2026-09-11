import { S3Client } from "@aws-sdk/client-s3";

/**
 * Object Storage (Яндекс Облако) — S3-совместимое хранилище для PDF анализов.
 *
 * 152-ФЗ: файлы медданных хранятся только в российском контуре (регион ru-central1).
 * Доступ — по служебным ключам сервисного аккаунта (S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY).
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Переменная окружения ${name} не задана (см. .env.example).`);
  }
  return value;
}

const globalForS3 = globalThis as unknown as { s3?: S3Client };

export const s3 =
  globalForS3.s3 ??
  new S3Client({
    region: process.env.S3_REGION ?? "ru-central1",
    endpoint: required("S3_ENDPOINT"),
    forcePathStyle: true,
    credentials: {
      accessKeyId: required("S3_ACCESS_KEY_ID"),
      secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForS3.s3 = s3;
}

export const S3_BUCKET = process.env.S3_BUCKET ?? "vena-medical";
