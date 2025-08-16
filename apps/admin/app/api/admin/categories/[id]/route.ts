import { NextRequest, NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const BASE = RAW_API_BASE.replace(/\/+$/, '').endsWith('/api/v1')
  ? RAW_API_BASE.replace(/\/+$/, '')
  : `${RAW_API_BASE.replace(/\/+$/, '')}/api/v1`;

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const accessToken = request.cookies.get('access_token')?.value;
  const res = await fetch(`${BASE}/admin/categories/${params.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const cascade = request.nextUrl.searchParams.get('cascade');
  const url = `${BASE}/admin/categories/${params.id}${cascade ? `?cascade=${encodeURIComponent(cascade)}` : ''}`;
  const accessToken = request.cookies.get('access_token')?.value;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}