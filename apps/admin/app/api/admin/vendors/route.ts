import { NextRequest, NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const BASE = RAW_API_BASE.replace(/\/+$/, '').endsWith('/api/v1') ? RAW_API_BASE.replace(/\/+$/, '') : `${RAW_API_BASE.replace(/\/+$/, '')}/api/v1`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';
  const url = `${BASE}/admin/vendors?page=${page}&limit=${limit}`;
  const accessToken = request.cookies.get('tg_at')?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(url, { cache: 'no-store', headers });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}


