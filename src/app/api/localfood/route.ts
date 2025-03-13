import supabase from '@/utils/supabase/client';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  try {
    const { data: localFoodData, error: localFoodError } = await supabase
      .from('local_food')
      .select('*');

    if (localFoodError) {
      return NextResponse.json(
        { error: localFoodError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(localFoodData);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
