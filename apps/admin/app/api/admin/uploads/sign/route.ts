import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Expected env vars in Admin app environment
// R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET (e.g., tradygo-assets)
// R2_S3_ENDPOINT (e.g., https://100cd1b89d3b20902f6d8c56ad05e975.r2.cloudflarestorage.com)
// ASSETS_BASE_URL (public URL base, e.g., https://pub-....r2.dev)

const REGION = 'auto';

function createS3Client() {
  const endpoint = process.env.R2_S3_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured');
  }
  return new S3Client({
    region: REGION,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { folder = 'kyc', filename, contentType } = await request.json();
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 });
    }

    const bucket = process.env.R2_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: 'R2_BUCKET not configured' }, { status: 500 });
    }

    const key = `${folder}/${Date.now()}-${filename}`;
    const s3 = createS3Client();

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicBase = (process.env.ASSETS_BASE_URL || '').replace(/\/+$/, '');
    const publicUrl = publicBase ? `${publicBase}/${key}` : null;

    return NextResponse.json({ url, key, publicUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


