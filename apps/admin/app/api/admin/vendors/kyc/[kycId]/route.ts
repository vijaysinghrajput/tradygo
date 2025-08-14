import { NextRequest, NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const BASE = RAW_API_BASE.replace(/\/+$/, '').endsWith('/api/v1') ? RAW_API_BASE.replace(/\/+$/, '') : `${RAW_API_BASE.replace(/\/+$/, '')}/api/v1`;

export async function PATCH(request: NextRequest, { params }: { params: { kycId: string } }) {
  const accessToken = request.cookies.get('tg_at')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const body = await request.json();
  const res = await fetch(`${BASE}/admin/vendors/kyc/${params.kycId}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: NextRequest, { params }: { params: { kycId: string } }) {
  const accessToken = request.cookies.get('tg_at')?.value;
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE}/admin/vendors/kyc/${params.kycId}`, { method: 'DELETE', headers });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}


