import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const folder = (form.get('folder') as string) || 'kyc';
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 });

    const bucket = process.env.R2_BUCKET;
    if (!bucket) return NextResponse.json({ error: 'R2_BUCKET not configured' }, { status: 500 });

    const arrayBuffer = await file.arrayBuffer();
    const contentType = file.type || 'application/octet-stream';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${folder}/${Date.now()}-${safeName}`;

    const s3 = createS3Client();
    const put = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });
    await s3.send(put);

    const publicBase = (process.env.ASSETS_BASE_URL || '').replace(/\/+$/, '');
    const publicUrl = publicBase ? `${publicBase}/${key}` : null;
    return NextResponse.json({ key, publicUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}


