import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// get a single student
export async function GET(req) {

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { data, error } = await supabase
    .from("student")
    .select("*")
    .eq("id", id)
    .single()

  if(error) { 
      console.log(error)
      return NextResponse.json({mssg: "there is an error getting the students."}, {status: 400})
  }

  return NextResponse.json(data, {status: 201})
}

// delete a student
export async function DELETE(req) {
  
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { data, error } = await supabase
    .from("student")
    .delete()
    .eq("id", id)

  if(error) { 
      console.log(error)
      return NextResponse.json({mssg: "there is an error deleting the students."}, {status: 400})
  }

  return NextResponse.json({mssg: "student deleted sucessfully"}, {status: 201})
}

