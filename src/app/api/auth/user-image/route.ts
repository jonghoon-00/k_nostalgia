import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const formData = await request.formData();
  const file = formData.get('editimage') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const imagepath = `userimage/${randomUUID()}`;

  const { data: imgData, error } = await supabase.storage.from('images').upload(imagepath, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: imgUrl } = supabase.storage.from('images').getPublicUrl(imagepath);

  return NextResponse.json({ imageUrl: imgUrl.publicUrl });
}

