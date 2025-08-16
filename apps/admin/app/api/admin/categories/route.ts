import { NextRequest, NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const BASE = RAW_API_BASE.replace(/\/+$/, '').endsWith('/api/v1')
  ? RAW_API_BASE.replace(/\/+$/, '')
  : `${RAW_API_BASE.replace(/\/+$/, '')}/api/v1`;

export async function GET(request: NextRequest) {
  const tree = request.nextUrl.searchParams.get('tree');
  const url = `${BASE}/admin/categories${tree ? `?tree=${encodeURIComponent(tree)}` : ''}`;
  const accessToken = request.cookies.get('access_token')?.value;
  const res = await fetch(url, { headers: { ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) } });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const accessToken = request.cookies.get('access_token')?.value;
  const res = await fetch(`${BASE}/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}