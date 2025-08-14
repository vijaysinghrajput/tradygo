import { NextRequest, NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const BASE = RAW_API_BASE.replace(/\/+$/, '').endsWith('/api/v1') ? RAW_API_BASE.replace(/\/+$/, '') : `${RAW_API_BASE.replace(/\/+$/, '')}/api/v1`;

export async function POST(request: NextRequest, { params }: { params: { id: string; userId: string } }) {
  const accessToken = request.cookies.get('tg_at')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE}/admin/vendors/${params.id}/portal-user/${params.userId}/reset-password`, { method: 'POST', headers });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}


