import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: "Missing 'id' query parameter." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('eventId', id)
      .order('studentId', { ascending: true })

    if (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ message: "There was an error getting the students." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
