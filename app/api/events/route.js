import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// get all events
export async function GET() {

    const { data, error } = await supabase
      .from("event")
      .select("*")

    if(error) { 
        console.log(error)
        return NextResponse.json({mssg: "there is an error getting the students."}, {status: 401})
    }

    return NextResponse.json(data, {status: 201})
    
}


// create event
export async function POST(req) {
    const {
        title,
        location,
        loginTime,
        logoutTime,
        fineAmount
    } = await req.json()

    if(!title || !location || !loginTime || !logoutTime || !fineAmount) {
        return NextResponse.json({mssg: "Please fillout all the fields."}, {status: 401})
    }

    const { data, error } = await supabase
      .from("event")
      .insert({
        title,
        location,
        loginTime,
        logoutTime,
        fineAmount
      })

    if(error) { 
        console.log(error)
        return NextResponse.json({mssg: "there is an error getting the students."}, {status: 401})
    }

    return NextResponse.json({mssg: "Event created Sucessfully"}, {status: 201})
}




