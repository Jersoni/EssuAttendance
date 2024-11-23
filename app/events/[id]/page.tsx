// eslint-disable @next/next/no-async-client-component
"use client";
import { Filter, PageHeader, SearchBar, StudentCard } from "@/components";
import supabase from "@/lib/supabaseClient";
import { Attendance, AuthProps, EventProps, QueryFiltersProps, StudentProps } from "@/types";
import { checkAuth, formatDate } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuScanLine } from "react-icons/lu";
import { CgQr } from "react-icons/cg";
import { RiSearchLine } from "react-icons/ri";
import { BiSearchAlt } from "react-icons/bi";
import { RiFilter2Line } from "react-icons/ri";
import { PiScanBold } from "react-icons/pi";
import InfiniteScroll from 'react-infinite-scroll-component';
import { RotatingLines } from 'react-loader-spinner'
import { Spinner } from "@/components";
import NextTopLoader from "nextjs-toploader";

import styles from "./styles.module.css";import Link from "next/link";
2

/* eslint-disable react-hooks/exhaustive-deps */
const EventPage: React.FC = ({ params }: any) => {

  const router = useRouter();

  // auth verification
  const [ auth, setAuth ] = useState<AuthProps>()
  
  useEffect(() => {
    setAuth(checkAuth(router))
  }, [router])

  const [program, setProgram] = useState<string>() // eg. BSINFOTECH

  // fetch program
  useEffect(() => {
    if (auth) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from("organizations")
            .select("program")
            .eq("id", auth.org_id)
            .single()
            
          if (error) {
            console.error(error)
          } else {
            setProgram(data.program)
          }
        } catch(e) {
          console.error(e)
        }
      })()
    }
  }, [auth])

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<StudentProps[] | undefined>(undefined);
  const [isStudentsEmpty, setIsStudentsEmpty] = useState<boolean | null>(null)
  const [error, setError] = useState(null);
  const [event, setEvent] = useState<EventProps>();
  const [queryParams, setQueryParams] = useState<QueryFiltersProps>()

  // infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const numPerPage = 20;

  // FILTER VARIABLES
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
  const [courses, setCourses] = useState<string[] | undefined>(["AllCourses"]);
  const [years, setYears] = useState<string[] | undefined>(["AllYears"]);
  const [sections, setSections] = useState<string[] | undefined>(["AllSections"]);
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [order, setOrder] = useState<string | undefined>("ascending");
  const allYears = [1, 2, 3, 4];
  const allSections = ["A", "B", "C", "D", "E"];
  const allCourses = [ "BSCE", "BSIT", "BOT", "BSHM", "BSTM", "BSE", "BSBA", "BSAIS", "BAC", "BTVTED", "BSED", "BEED", "BSN", "BSCRIM", "BSINFOTECH" ];

  function getQueryParams() {
    return {
      courses: searchParams.get("courses")?.split(","),
      years: searchParams.get("years")?.split(","),
      sections: searchParams.get("sections")?.split(","),
      order: searchParams.get("order"),
      sortBy: searchParams.get("sortBy"),
    } as QueryFiltersProps
  }

  useEffect(() => {
    let { courses, years, sections, order, sortBy } = getQueryParams()

    setCourses(courses?.length === 15 ? ["AllCourses"] : courses )
    setYears(years?.length === 15 ? ["AllYears"] : years )
    setSections(sections?.length === 15 ? ["AllSections"] : sections )
    setSortBy(sortBy || "name")
    setOrder(order || "ascending")

  }, [searchParams])
  
// EVENT
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
  
// ATTENDANCE
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

  useEffect(() => {
    fetchAttendanceData();
  }, [params.id, searchParams])

// GET STUDENTS
  const getStudents = async (isNewPage = false) => {
    const studentIDs = attendanceData.map((data) => data.studentId);
    // if (queryParams.courses) console.log(queryParams)
    
    async function getData(): Promise<any> {
      if (queryParams === undefined) {
        return supabase
          .from("student")
          .select("*")
          .in("id", studentIDs)
          .order("name", { ascending: true })
          .range(page * numPerPage, (page + 1) * numPerPage - 1);
      } else {

        if (!isNewPage) {
          setPage(0)
        }

        return supabase
          .from("student")
          .select("*")
          .in("id", studentIDs)
          .in("course", queryParams.courses)
          .in("year", queryParams.years)
          .in("section", queryParams.sections)
          .order(queryParams.sortBy, {
            ascending: queryParams.order === "ascending",
          })
          .range(
            isNewPage ? (page * numPerPage) : 0,
            isNewPage ? ((page + 1) * numPerPage - 1) : (numPerPage - 1)
          );
      }
    }

    const {data, error} = await getData()
    
    if (error) {
      console.log(error)
    } else {
      if (isNewPage) {
        setStudents(prev => {
          // add the isPresent to 'students' state variable
          if (prev !== undefined) {
            let modifiedData = data.map((student: StudentProps) => {
              const attendance = attendanceData.find(
                (row) => row.studentId === student.id
              );
              return {
                ...student,
                isLoginPresent: attendance?.isLoginPresent,
                isLogoutPresent: attendance?.isLogoutPresent
              };
            });
    
            if (prev.length > 0 && modifiedData.length > 0) {
              if (prev[0].id !== modifiedData[0].id) {
                return [...prev, ...modifiedData]
              } else {
                return [...prev]
              }
            } else {
              return [...modifiedData]
            }
          }
        })
      } else {
        setStudents(() => {
          // add the isPresent to 'students' state variable
          let modifiedData = data.map((student: StudentProps) => {
            const attendance = attendanceData.find(
              (row) => row.studentId === student.id
            );
            return {
              ...student,
              isLoginPresent: attendance?.isLoginPresent,
              isLogoutPresent: attendance?.isLogoutPresent
            };
          });
  
          return modifiedData
        })
      }

      setHasMore(data.length === numPerPage);
    }
  }

  
// GET QUERY PARAMS and store more neatly as object in queryParams state
useEffect(() => {    
  if (searchParams.size) {
    console.log("new query params")
    setQueryParams(getQueryParams())
  }
}, [searchParams])

// INVOKE STUDENTS
  useEffect(() => {
    if (attendanceData.length > 0) {
      getStudents();
    }
  }, [attendanceData])

  useEffect(() => {
    if (queryParams) {
      getStudents(false)
    }
  }, [queryParams])

  useEffect(() => {
    getStudents(true);
  }, [page])

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<StudentProps[] | any>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

// SEARCH FUNCTIONALITY
  useEffect(() => {
    const fetchSearchQuery = async () => {
      const column = !isNaN(Number(searchQuery.charAt(0)))
      ? "id" // if query is an ID
      : "name" // if query is a string

      const {data, error} = await supabase
        .from("student")
        .select()
        .textSearch(column, searchQuery, {
          type: "websearch",
          config: "english"
        })
        .limit(20)

      if (error) {
        console.error(error)
      } else {
        // if search query does not exactly match any row
        if (data.length === 0 && searchQuery !== "") {
          const {data: data2, error: error2} = await supabase
            .from("student")
            .select()
            .ilike(column, `%${searchQuery}%`)
            .limit(20)
          
          if (error2) {
            console.error(error2)
          } else {
            // add the isPresent to 'students' state variable
            let modifiedData = data2.map((student) => {
              const attendance = attendanceData.find(
                (row) => row.studentId === student.id
              );
              return {
                ...student,
                isLoginPresent: attendance?.isLoginPresent,
                isLogoutPresent: attendance?.isLogoutPresent
              };
            });

            setSearchResults(modifiedData);
            modifiedData.length === 0
            ? setIsStudentsEmpty(true)
            : setIsStudentsEmpty(false)
            // console.log(modifiedData)
          }
        // if search query exactly matches a row
        } else {
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
          
          setSearchResults(modifiedData);
          modifiedData.length === 0
          ? setIsStudentsEmpty(true)
          : setIsStudentsEmpty(false)
          // console.log(modifiedData)
        }
      }
    }
    
    fetchSearchQuery()
  }, [searchQuery])

// FILTER COMPONENT FUNCTIONALITY

  async function applyFilters() {
    setLoading(true);

    const studentIDList: Array<string> | undefined = students?.map((student) => student.id);
    const filterCourses = courses?.includes("AllCourses") ? allCourses : courses;
    const filterYears = years?.includes("AllYears")
      ? allYears
      : years?.map((year) => parseInt(year));
    const filterSections = sections?.includes("AllSections")
      ? allSections
      : sections;
    const filterOrder = order;
    const filterSortBy = sortBy;

    // URL search params
    const queryParams = new URLSearchParams();

    // modify search params
    if (filterCourses) queryParams.set("courses", filterCourses.toString());
    if (filterYears) queryParams.set("years", filterYears.toString());
    if (filterSections) queryParams.set("sections", filterSections.toString());
    if (filterOrder) queryParams.set("order", filterOrder.toString());
    if (filterSortBy) queryParams.set("sortBy", filterSortBy);
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
    };
    // console.log(JSON.stringify(filters, null, 2));
  }, [courses, years, sections, sortBy, order]);

  const [updatedStudent, setUpdatedStudent] = useState<StudentProps | undefined>(undefined)
  const [updatedStudentPayload, setUpdatedStudentPayload] = useState<Attendance | undefined>(undefined)

// REALTIME SUBSCRIPTION
  useEffect(() => {
    const channel = supabase
    .channel("realtime_attendance")
    .on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "attendance",
    },
    (payload) => {
      // setStudents([...students, payload.new as StudentProps])
      // console.log(payload.new)
      setUpdatedStudentPayload(payload.new as Attendance);

      const studentID = payload.new.studentId;

      (async () => {
        const { data, error } = await supabase
          .from('student')
          .select("*")
          .eq('id', studentID)
          .single()

        if (error) {
          console.error(error)
        } else {
          setUpdatedStudent(data as StudentProps)
        }
      })()
    })
    .subscribe()

    return () => {
      supabase.removeChannel(channel);
    };
  }, [])

  useEffect(() => {

    if (updatedStudentPayload !== undefined 
      && updatedStudent !== undefined
      && updatedStudent.id === updatedStudentPayload.studentId
    ) {

      const newStudentData = {
        ...updatedStudent,
        isLoginPresent: updatedStudentPayload.isLoginPresent,
        isLogoutPresent: updatedStudentPayload.isLogoutPresent
      }

      const updatedStudents = students?.map(student =>
        student.id === updatedStudent?.id ? newStudentData : student
      )

      setStudents(updatedStudents)
      setUpdatedStudent(undefined)
      setUpdatedStudentPayload(undefined)

    }

    
  }, [updatedStudent])

  useEffect(() => {
    console.log(event)
  }, [event])
  
  return (
    <div className="relative overflow-hidden min-h-[100vh] pt-24">
      {/* <NextTopLoader 
        color="#16a34a"
        showSpinner={false}
        shadow={false}
      /> */}

      <div className="h-20 w-full fixed z-[300] top-0">
        <PageHeader
          title={event?.title}
          subtitle={event?.eventDate ? formatDate(event?.eventDate) : ""}
          returnPath="/"
        />

        {/* TODO: 
        *  implement new features:
        *  - [ ] close login (prevent further logins)
        *  - [ ] close logout (prevent further logouts)
        */}

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
            onClick={() => {setIsSearchOpen(true)}}
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
          {auth?.role === "admin" && (
            <Link 
              href={`./${params.id}/scanner`}
              className="grid place-items-center p-1.5 rounded-full bg-neutral-10"
            >
              <PiScanBold size={22} />
            </Link>
          )}
        </div>
      </div>

      {/* loading ui */}
      {students === undefined && (
          <div className="flex flex-col h-fit p-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col w-full gap-2 bg-none py-3 border-gray-200 border-">
                <div className='animate-pulse bg-gray-200  rounded-md h-4 w-48'></div>
                <div className="flex flex-row gap-2">
                  <div className='animate-pulse bg-gray-100  rounded-md h-4 w-14'></div>
                  <div className='animate-pulse bg-gray-100  rounded-md h-4 w-20'></div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="overflow-hidden pb-40 px-5">
        <Filter
          // filters data
          courses={courses}
          years={years}
          sections={sections}
          sortBy={sortBy}
          order={order}
          // set functions
          setCourses={setCourses}
          setYears={setYears}
          setSections={setSections}
          setSortBy={setSortBy}
          setOrder={setOrder}
          // submit
          applyFilters={applyFilters}
          // UI logic
          isOpen={isOpen}
          setIsOpen={() => {setIsOpen(!isOpen)}}
          // program/course
          program={program}
        />

        {isSearchOpen && (
          <SearchBar
            query={searchQuery}
            setQuery={(e) => setSearchQuery(e.target.value)}
            closeSearch={() => {
              setIsSearchOpen(false)
              setSearchQuery("")
            }}
          />
        )}

        {/* STUDENTS LIST */}
        <div className={`${styles.studentsList}`}>
          {(students && searchResults.length === 0) &&
            <InfiniteScroll
              dataLength={students.length}
              next={() => {setPage(page + 1)}}
              hasMore={hasMore}
              className={`${styles.studentsList}`}
              endMessage={<div className="absolute w-full text-center left-0 mt-10 font-semibold text-sm text-gray-300" key={1}>Total students found: {students.length}</div>}
              loader={(
                <div className="h-14 absolute left-0 w-full mt-5 items-center flex justify-center">
                  <Spinner />
                </div>
              )}
            >
              {(students.length !== 0 && searchResults.length === 0) &&
                students.map((student: StudentProps, index) => {
                  return (
                    <StudentCard
                      key={student.id}
                      eventId={event?.id}
                      studentData={student}
                    />
                  );
                })
              }
            </InfiniteScroll>
          }
      
          {searchResults.length !== 0 &&
            searchResults?.map((student: StudentProps, index: number) => {
              return (
                <StudentCard
                  key={index}
                  eventId={event?.id}
                  studentData={student}
                />
              );
            })
          }

        </div>
      </div>

    </div>
  );
};

export default EventPage;
