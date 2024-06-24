import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";


// get all student
export async function GET() {

    const { data, error } = await supabase
      .from("student")
      .select("*")

    if(error) { 
        console.log(error)
        return NextResponse.json({mssg: "there is an error getting the students."}, {status: 401})
    }

    return NextResponse.json(data, {status: 201})
    
}

// create or insert new student
export async function POST(req) {
    const {
        firstName,
        lastName,
        college,
        yearLevel,
        section
    } = await req.json()

    if(!firstName || !lastName || !college || !yearLevel || !section) {
        return NextResponse.json({mssg: "Please fillout all the fields."}, {status: 401})
    }

    const { data, error} = await supabase
      .from("student")
      .insert({
        firstName,
        lastName,
        college,
        yearLevel,
        section
      })

    if(error) {
        return NextResponse.json({mssg: "there is an error getting the inserting the student."}, {status: 401})
    }

    return NextResponse.json({mssg: "Student created Successfully"}, {status: 201})

}
