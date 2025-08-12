import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

// Secret token for security
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, tags, paths } = body;

    // Verify the secret token
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret token' },
        { status: 401 }
      );
    }

    // Revalidate specific tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
        console.log(`Revalidated tag: ${tag}`);
      }
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
        console.log(`Revalidated path: ${path}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Revalidation completed',
      revalidated: {
        tags: tags || [],
        paths: paths || [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}