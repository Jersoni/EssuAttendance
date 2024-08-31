import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// get a single event
export async function GET(req) {

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { data, error } = await supabase
  .from('event')
  .select('*')
  .eq('id', id)
  .single()

  if(error) { 
      console.log(error)
      return NextResponse.json({error: "there is an error getting the students."}, {status: 401})
  }

  if(data.length === 0) {
      return NextResponse.json({error: "No such event."}, {status: 401})
  }

  return NextResponse.json(data, {status: 201})
}

// delete event
export async function DELETE(req) {

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { data, error } = await supabase
    .from("event")
    .delete() 
    .eq("id", id)

  if(error) { 
      console.log(error)
      return NextResponse.json({error: "there is an error deleting the students."}, {status: 401})
  }

  return NextResponse.json({mssg: "student deleted sucessfully"}, {status: 201})
}

  
