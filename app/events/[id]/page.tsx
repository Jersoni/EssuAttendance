// eslint-disable @next/next/no-async-client-component
"use client";
import { Filter, PageHeader, SearchBar, StudentCard } from "@/components";
import supabase from "@/lib/supabaseClient";
import { Attendance, EventProps, StudentProps } from "@/types";
import { formatDate } from "@/utils/utils";
import { lineSpinner } from "ldrs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuScanLine } from "react-icons/lu";
import { CgQr } from "react-icons/cg";
import { RiSearchLine } from "react-icons/ri";
import { BiSearchAlt } from "react-icons/bi";
import { RiFilter2Line } from "react-icons/ri";
import { PiScanBold } from "react-icons/pi";

import styles from "./styles.module.css";2

const EventPage: React.FC = ({ params }: any) => {
  lineSpinner.register();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // FETCH EVENT
  const [event, setEvent] = useState<EventProps>();

  useEffect(() => {
    const getEvent = async () => {
      try {
        const res = await fetch(`/api/events/event?id=${params.id}`, {
          method: "GET",
        });

        if (res) {
          const json = await res.json();
          if (json) setEvent(json);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getEvent();
  }, [params.id]);
  
  // FETCH ATTENDANCE
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<StudentProps[] | null>(null);
  const [isStudentsEmpty, setIsStudentsEmpty] = useState<boolean | null>(null)
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // console.log(students)
    // students.length === 0
    // ? setIsStudentsEmpty(true)
    // : setIsStudentsEmpty(false)
  }, [students])

  // filter & search
  useEffect(() => {
    // if URL has search params
    if (searchParams.get("order")) {
        
      const fetchAttendanceData = async () => {
        const { data: attendanceData, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("eventId", 9)

        if (attendanceData) {
          const studentIDs = attendanceData.map((data) => data.studentId);
          const queryParams = {
            courses: searchParams.get("courses")?.split(","),
            years: searchParams.get("years")?.split(",").map((i) => parseInt(i)),
            sections: searchParams.get("sections")?.split(","),
            order: searchParams.get("order"),
            sortBy: searchParams.get("sortBy"),
          };

          if (
            queryParams.courses &&
            queryParams.years &&
            queryParams.sections &&
            queryParams.sortBy
          ) {
            const { data, error } = await supabase
              .from("student")
              .select("*")
              .in("id", studentIDs)
              .in("course", queryParams.courses)
              .in("year", queryParams.years)
              .in("section", queryParams.sections)
              .order(queryParams.sortBy, {
                ascending: queryParams.order === "true",
              });

            if (data) {
              // add the isPresent to 'students' state variable
              let modifiedData = data.map((student) => {
                const attendance = attendanceData.find(
                  (row) => row.studentId === student.id
                );
                return {
                  ...student,
                  isLoginPresent: attendance?.isLoginPresent,
                  isLogoutPresent: attendance?.isLogoutPresent
                };
              });

              setStudents(modifiedData);
            }
          }
        }
      };

      fetchAttendanceData();
    } else {
      const fetchAttendanceData = async () => {
        try {
          const response = await fetch(`/api/getAttendance?id=${params.id}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          setAttendanceData(result);
        } catch (error: any) {
          setError(error.message);
        }
      };

      fetchAttendanceData();
    }


    // subscribe to supabase realtime channel to listen for realtime updates
    const channel = supabase.channel("realtime_attendance").on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "attendance",
      },
      (payload) => {
        // setStudents([...students, payload.new as StudentProps])
        // console.log(payload);
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id, searchParams]);

  // Filter Component UI logic
  const [isOpen, setIsOpen] = useState(false);

  const [courses, setCourses] = useState(["AllCourses"]);
  const [years, setYears] = useState(["AllYears"]);
  const [sections, setSections] = useState(["AllSections"]);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ascending");
  const [displayOption, setDisplayOption] = useState("showAll");

  const allCourses = [
    "BSCE",
    "BSIT",
    "BOT",
    "BSHM",
    "BSTM",
    "BSE",
    "BSBA",
    "BSAIS",
    "BAC",
    "BTVTED",
    "BSED",
    "BEED",
    "BSN",
    "BSCRIM",
    "BSINFOTECH",
  ];
  const allYears = [1, 2, 3, 4];
  const allSections = ["A", "B", "C", "D", "E"];
  const allDisplayOptions = ["true", "false"];

  // TODO: APPLY FILTERS FUNCTIONALITY
  async function applyFilters() {
    setLoading(true);

    const studentIDList: Array<string> | undefined = students?.map((student) => student.id);
    const filterCourses = courses.includes("AllCourses") ? allCourses : courses;
    const filterYears = years.includes("AllYears")
      ? allYears
      : years.map((year) => parseInt(year));
    const filterSections = sections.includes("AllSections")
      ? allSections
      : sections;
    const filterOrder = order === "ascending";
    const filterSortBy = sortBy;
    const filterDisplayOption =
      displayOption === "showAll"
        ? allDisplayOptions
        : displayOption === "present"
        ? ["true"]
        : ["false"];

    // URL search params
    const queryParams = new URLSearchParams();

    // modify search params
    queryParams.set("courses", filterCourses.toString());
    queryParams.set("years", filterYears.toString());
    queryParams.set("sections", filterSections.toString());
    queryParams.set("order", filterOrder.toString());
    queryParams.set("sortBy", filterSortBy);
    // queryParams.set("displayOption", filterDisplayOption.toString());

    // push to the new URL with new params

    router.push(`?${queryParams.toString()}`);

    setIsOpen(false);
    setLoading(false);
  }

  // pretty print all filters data
  useEffect(() => {
    const filters = {
      courses,
      years,
      sections,
      sortBy,
      order,
      displayOption,
    };
    // console.log(JSON.stringify(filters, null, 2));
  }, [courses, years, sections, sortBy, order, displayOption]);

  // FETCH STUDENTS after getting the attendance data
  useEffect(() => {
    let studentsIDs: string[] = [];

    // get all student IDs
    attendanceData.map((row: Attendance) => {
      studentsIDs.push(row.studentId);
    });

    const fetchStudentsData = async () => {
      try {
        const { data, error } = await supabase
          .from("student")
          .select("*")
          .in("id", studentsIDs)
          .order("name", { ascending: true });

        if (error) {
          throw error;
        }

        // add the isPresent to 'students' state variable
        let modifiedData = data.map((student) => {
          const attendance = attendanceData.find(
            (row) => row.studentId === student.id
          );
          return {
            ...student,
            isLoginPresent: attendance?.isLoginPresent,
            isLogoutPresent: attendance?.isLogoutPresent
          };
        });

        setStudents(modifiedData);
        modifiedData.length === 0
        ? setIsStudentsEmpty(true)
        : setIsStudentsEmpty(false)
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchStudentsData();

    const channel = supabase.channel("realtime_students").on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "student",
      },
      (payload) => {
        // setStudents([...students, payload.new as StudentProps])
        // console.log(payload);
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [attendanceData]);

  // Search bar
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<StudentProps[] | any>([]);

  // On Search Input Change
  // useEffect(() => {
  //   // replace dashes from the input
  //   const formattedSearchQuery = searchQuery.replace(/-/g, '')

  //   // if input contains spaces
  //   if (formattedSearchQuery.includes(' ')) {
  //     const arrayFormattedSearchQuery = formattedSearchQuery.split(' ')
  //     console.log(arrayFormattedSearchQuery)

  //     const fetchSearchQuery = async () => {
  //       // console.log(`firstName.in.(${arrayFormattedSearchQuery})`)
  //       const { data, error } = await supabase
  //         .from("student")
  //         .select()
  //         .or(`firstName.in.(${arrayFormattedSearchQuery}), lastName.in.(${arrayFormattedSearchQuery})`)
          
  //       setSearchResults(data)
  //     };
      
  //     console.log('1')
  //     fetchSearchQuery();
  //   } 
  //   // if input is a number
  //   else if (!isNaN(Number(formattedSearchQuery))) {
  //     // console.log(formattedSearchQuery)
  //     const fetchSearchQuery = async () => {
  //       const { data, error } = await supabase
  //         .from("student")
  //         .select()
  //         .eq('id', formattedSearchQuery)
  
  //       setSearchResults(data)
  //     };
  
  //     console.log('2')
  //     fetchSearchQuery();
  //   }
  //   // if input is NaN and One word only
  //   else {
  //     const fetchSearchQuery = async () => {
  //       // console.log(formattedSearchQuery)
  //       const { data, error } = await supabase
  //         .from("student")
  //         .select()
  //         .or(`firstName.ilike.%${formattedSearchQuery}%, lastName.ilike.%${formattedSearchQuery}%`)
          
  //       setSearchResults(data)
  //     };
      
  //     console.log('3')
  //     fetchSearchQuery();
  //   }

  // }, [searchQuery]);

  // useEffect(() => {
  //   console.log(searchResults)
  // }, [searchResults])

  return (
    <div className=" overflow-hidden pt-24">
      <div className="h-20 w-full fixed z-[300] top-0">
        <PageHeader
          title={event?.title}
          subtitle={event?.eventDate ? formatDate(event?.eventDate) : ""}
          returnPath="/"
        />
        <div className="w-full flex flex-row items-center text-xs text-gray-400 justify-between px-5 py-2 border-b border-b-gray-200 bg-white" >
          <span>Student</span>
          <div className="flex flex-row gap-2">
            <span>Login</span>
            <span>Logout</span>
          </div>
        </div>
        {/* buttons */}
        <div className={`flex flex-row absolute top-3 right-3 gap-2 items-center `}>
          <button 
            onClick={() => {}}
            className="grid place-items-center p-1.5 rounded-full bg-neutral-10"
          >
            <BiSearchAlt size={22} />
          </button>
          <button 
            onClick={() => {setIsOpen(true)}}
            className="grid place-items-center p-1.5 rounded-full bg-neutral-10"
          >
            <RiFilter2Line size={20} />
          </button>
          <button 
            onClick={() => {router.push(`./${params.id}/scanner`)}}
            className="grid place-items-center p-1.5 rounded-full bg-neutral-10"
          >
            <PiScanBold size={22} />
          </button>
        </div>
      </div>



      {/* <button className=" fixed z-[500] top-4 right-[60px]">
        <LuScanLine onClick={() => router.push(`./5/scanner`)} size={24} />
      </button> */}

      <div className="overflow-hidden pb-40 px-5">
        <Filter
          data={students}
          // filters data
          courses={courses}
          years={years}
          sections={sections}
          sortBy={sortBy}
          order={order}
          displayOption={displayOption}
          // set functions
          setCourses={setCourses}
          setYears={setYears}
          setSections={setSections}
          setSortBy={setSortBy}
          setOrder={setOrder}
          setDisplayOption={setDisplayOption}
          // submit
          applyFilters={applyFilters}
          // UI logic
          isOpen={isOpen}
          setIsOpen={() => {setIsOpen(!isOpen)}}
        />

        {/* <SearchBar
          className="mr-5"
          query={searchQuery}
          setQuery={(e) => setSearchQuery(e.target.value)}
        /> */}

        {/* STUDENTS LIST */}
        <div className={`${styles.studentsList}`}>
          {students?.length !== 0 &&
            students?.map((student: StudentProps) => {
              return (
                <StudentCard
                  key={student.id}
                  eventId={event?.id}
                  studentData={student}
                />
              );
            })
          }

          {students?.length === 0 &&
            <div className="mt-5">No Student Found.</div>
          }

        </div>
      </div>

      {loading || isStudentsEmpty == null && (
        <div className="absolute top-0 left-0 w-full h-full z-[200] grid place-items-center">
          <l-line-spinner
            size="30"
            stroke="2"
            speed="1"
            color="black"
          ></l-line-spinner>
        </div>
      )}
    </div>
  );
};

export default EventPage;
