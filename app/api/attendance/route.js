import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// get all attendees
export async function GET(req) {

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const { data: attendanceData, attendanceError } = await supabase
      .from('attendance')
      .select('studentId')
      .eq('eventId', id);

    console.log("attendance data: ",attendanceData)


    if(attendanceError) { 
        console.log(attendanceError.message)
        return NextResponse.json({mssg: "there is an error getting the attendance."}, {status: 401})
    }

    const studentIds = attendanceData.map(row => row.studentId);
    console.log('Student IDs:', studentIds);


    if (studentIds.length === 0) {
      console.log('No students attended the event.');
      return NextResponse.json({mssg: "No students attended the event."}, {status: 401});
    }

    const { data: studentsData, error: studentsError } = await supabase
    .from("student")
    .select("*")
    .in("id", studentIds)

    
    console.log("students data: ", studentsData)

    
    if (studentsError) {
      console.error('Error fetching students data:', studentsError.message);
      return NextResponse.json({error: "Error fetching students data"}, {status: 401});
    }

    return NextResponse.json(studentsData, {status: 201})
    
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




