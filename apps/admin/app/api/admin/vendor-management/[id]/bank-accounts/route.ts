import { NextRequest, NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const BASE = RAW_API_BASE.replace(/\/+$/, '').endsWith('/api/v1') ? RAW_API_BASE.replace(/\/+$/, '') : `${RAW_API_BASE.replace(/\/+$/, '')}/api/v1`;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const accessToken = request.cookies.get('tg_at')?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE}/admin/vendors/${params.id}/bank-accounts`, { headers, cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const accessToken = request.cookies.get('tg_at')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const body = await request.json();
  const res = await fetch(`${BASE}/admin/vendors/${params.id}/bank-accounts`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

