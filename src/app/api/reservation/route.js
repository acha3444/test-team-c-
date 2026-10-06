import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ key: process.env.WEB3FORMS_ACCESS_KEY }, { status: 200 });
}
