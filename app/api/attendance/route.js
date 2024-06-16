import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// get all events
export async function GET() {

    const { data, error } = await supabase
      .from("attendance")
      .select("*")

    if(error) { 
        console.log(error)
        return NextResponse.json({mssg: "there is an error getting the attendance."}, {status: 401})
    }

    return NextResponse.json(data, {status: 201})
    
}


// create event
export async function POST(req) {
    const {
        studentId,
        eventId
    } = await req.json()

    if(!studentId || !eventId ) {
        return NextResponse.json({mssg: "Please fillout all the fields."}, {status: 401})
    }

    const { data, error } = await supabase
      .from("attendance")
      .insert({
        studentId,
        eventId
      })

    if(error) { 
        console.log(error)
        return NextResponse.json({mssg: "there is an error getting the attendance."}, {status: 401})
    }

    return NextResponse.json({mssg: "attendance created Sucessfully"}, {status: 201})
}




