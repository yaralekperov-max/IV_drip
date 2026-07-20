import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "./client";

/**
 * Работа с файлами медданных (PDF анализов) в Object Storage.
 *
 * 152-ФЗ: файлы приватные, доступ — только по временным подписанным ссылкам.
 * Ключ объекта включает client_id для изоляции данных по клиенту.
 */

/** Формирует ключ объекта для PDF анализа конкретного клиента. */
export function medicalFileKey(clientId: string, fileId: string): string {
  return `medical/analyses/${clientId}/${fileId}.pdf`;
}

/** Подписанная ссылка на загрузку PDF клиентом (upload), действует ограниченное время. */
export async function presignUpload(key: string, expiresInSec = 300): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: "application/pdf",
  });
  return getSignedUrl(s3, command, { expiresIn: expiresInSec });
}

/** Подписанная ссылка на скачивание PDF (для врача в админке / клиента). */
export async function presignDownload(key: string, expiresInSec = 300): Promise<string> {
  const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn: expiresInSec });
}
