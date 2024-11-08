import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// get all events
export async function GET() {

    const { data, error } = await supabase
      .from("event")
      .select("*")
      .order("eventDate", { ascending: false })

    if(error) { 
        console.log(error)
        return NextResponse.json({mssg: "there is an error getting the events."}, {status: 401})
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
        fineAmount,
        eventDate
    } = await req.json()

    if(!title || !location || !loginTime || !logoutTime || !fineAmount || !eventDate) {
        return NextResponse.json({mssg: "Please fillout all the fields."}, {status: 401})
    }

    const { data, error } = await supabase
      .from("event")
      .insert({
        title,
        location,
        loginTime,
        logoutTime,
        fineAmount,
        eventDate
      })

    if(error) { 
        console.log(error)
        return NextResponse.json({mssg: "there is an error getting the students."}, {status: 401})
    }

    return NextResponse.json({mssg: "Event created Sucessfully"}, {status: 201})
}




