'use client'
import { Filter, SearchBar, Spinner, StudentCard, StudentForm, BatchRegistrationForm } from "@/components";
import supabase from '@/lib/supabaseClient';
import { AuthProps, StudentProps } from '@/types';
import { checkAuth } from "@/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { LuFileText, LuListFilter, LuUserPlus2 } from "react-icons/lu";
import { MdPersonAdd } from "react-icons/md";
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './styles.module.css';

const StudentsPage = () => {

  const router = useRouter()
  const pathname = usePathname();

  // get user role
  const [ auth, setAuth ] = useState<AuthProps>()

  useEffect(() => {
    setAuth(checkAuth(router, pathname))
  }, [router, pathname])

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

  const [students, setStudents] = useState<StudentProps[] | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const numPerPage = 20;
  const searchParams = useSearchParams();

  // search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<StudentProps[] | any>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStudentsEmpty, setIsStudentsEmpty] = useState(false);

  const fetchStudentsDataWithFilters = async (
      isNewPage = false, 
      program = ""
  ) => {
    const queryParams = {
      courses: searchParams.get("courses")?.split(","),
      years: searchParams.get("years")?.split(",").map((i) => parseInt(i)),
      sections: searchParams.get("sections")?.split(","),
      order: searchParams.get("order"),
      sortBy: searchParams.get("sortBy")
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
        .eq("course", program)
        .in("course", queryParams.courses)
        .in("year", queryParams.years)
        .in("section", queryParams.sections)
        .order(queryParams.sortBy, {
          ascending: queryParams.order === "ascending",
        })
        .range(
            !isNewPage ? 0 : (page * numPerPage), 
            !isNewPage ? numPerPage - 1 : ((page + 1) * numPerPage - 1)
        )

      if (!isNewPage) {
        setPage(0)
      }

      if (error) {
        console.error(error)
      } else {
        isNewPage
        ? setStudents((prev) => { 
          if (prev) {
            return (prev[0]?.id !== data[0]?.id) ? [...prev, ...data] : prev}
          })
        : setStudents(data)
        
        setHasMore(data.length === numPerPage);
        data.length === 0
        ? setIsStudentsEmpty(true)
        : setIsStudentsEmpty(false)
      }
    }
  }

  const fetchStudents = async (
      isNewPage = false, 
      program = ""
  ) => {

    const { data, error } = program === "ALL" 
      ? await supabase
        .from("student")
        .select("*")
        .order("name", { ascending: true })
        .range(page * numPerPage, (page + 1) * numPerPage - 1)
      : await supabase
        .from("student")
        .select("*")
        .eq("course", program)
        .order("name", { ascending: true })
        .range(page * numPerPage, (page + 1) * numPerPage - 1)

    if (error) {
      console.error(error);
    } else {
      isNewPage 
      ? setStudents((prev) => { 
        if (prev) {
          return (prev[0]?.id !== data[0]?.id) ? [...prev, ...data] : prev}
        })
      : setStudents(data)

      setHasMore(data.length === numPerPage);
      data.length === 0
      ? setIsStudentsEmpty(true)
      : setIsStudentsEmpty(false)
    }        
  };

  const getStudents = (isNewPage = false, program = "") => {
    if (program !== "") {
        if (searchParams.get("order")) {
          fetchStudentsDataWithFilters(isNewPage, program)
        } else {
          fetchStudents(isNewPage, program);
        }

        setLoading(false);
    }
  }

  useEffect(() => {
    getStudents(false, program)
  }, [searchParams, program]);

  useEffect(() => {
    getStudents(true, program)
  }, [page, program])

  useEffect(() => {
    const channel = supabase
      .channel('realtime_students_A')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'student'
      }, (payload) => {
        // console.log('new student: ')
        // console.log(payload.new)
        setStudents((prevStudents) => { 
          if (prevStudents) {
            return [...prevStudents, payload.new as StudentProps]
          }
        })
            // getStudents()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'student'
      }, (payload) => {
        // console.log('updated student: ')
        // console.log(payload.new)
        setStudents((prevStudents) => { 
          if (prevStudents) {
            return [...prevStudents, payload.new as StudentProps]
          }
        })
            // getStudents()
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'student'
      }, (payload) => {
        // console.log('deleted student id: ' + payload.old)
        // getStudents()
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // search
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
        console.log(data)
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
            console.log(data2)
            setSearchResults(data2);
            data2.length === 0
            ? setIsStudentsEmpty(true)
            : setIsStudentsEmpty(false)
          }
        // if search query exactly matches a row
        } else {
          setSearchResults(data);
          data.length === 0
          ? setIsStudentsEmpty(true)
          : setIsStudentsEmpty(false)
        }
      }
    }
    
    if (isSearchOpen) fetchSearchQuery()
  }, [searchQuery])

  useEffect(() => {
    if (searchResults) setStudents([ ...searchResults ])
  }, [searchResults])

  useEffect(() => {
    console.log("___________________")
    console.log(`page: ${page + 1}`)
    console.log(`students: ${students?.length}`)
    console.log(`filters: ${searchParams.get('order') !== null}`)
  }, [page, students, searchParams])

  // filters
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
  const [courses, setCourses] = useState<string[] | undefined>(["AllCourses"]);
  const [years, setYears] = useState<string[] | undefined>(["AllYears"]);
  const [sections, setSections] = useState<string[] | undefined>(["AllSections"]);
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [order, setOrder] = useState<string | undefined>("ascending");
  const allYears = [1, 2, 3, 4];
  const allSections = ["A", "B", "C", "D", "E"];
  const allCourses = [ "BSCE", "BSIT", "BOT", "BSHM", "BSTM", "BSE", "BSBA", "BSAIS", "BAC", "BTVTED", "BSED", "BEED", "BSN", "BSCRIM", "BSINFOTECH" ];

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

  useEffect(() => {
    let paramsCourses = searchParams.get("courses")?.split(",")
    let paramsYears = searchParams.get("years")?.split(",")
    let paramsSections = searchParams.get("sections")?.split(",")
    let paramsSortBy = searchParams.get("sortBy")
    let paramsOrder = searchParams.get("order")

    setCourses(paramsCourses?.length === 15 ? ["AllCourses"] : paramsCourses )
    setYears(paramsYears?.length === 15 ? ["AllYears"] : paramsYears )
    setSections(paramsSections?.length === 15 ? ["AllSections"] : paramsSections )
    setSortBy(paramsSortBy || "name")
    setOrder(paramsOrder || "ascending")

  }, [searchParams])


  const [isFormOpen, setIsFormOpen] = useState(false)
  const toggleStudentForm = () => {
      setIsFormOpen(!isFormOpen);
  };

  // add options modal & button
  const [ isOptionsOpen, setIsOptionsOpen ] = useState(false)
  const optionsModalRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  const toggleOptionsOpen = () => {
    setIsOptionsOpen(!isOptionsOpen)
  }

  useEffect(() => {
  
    const optionsModal = optionsModalRef.current
    const addButton = addButtonRef.current

    if (optionsModal && addButton) {

      const closeOptionsModal = () => {
        setIsOptionsOpen(false)
        optionsModal.style.opacity = "0"
        optionsModal.classList.toggle("translate-y-10")
        setTimeout(() => {
          optionsModal.style.display = "none"
        }, 100)
      }

      const openOptionsModal = () => {
        setIsOptionsOpen(true)
        optionsModal.style.display = "flex"
        setTimeout(() => {
          optionsModal.classList.toggle("translate-y-10")
          optionsModal.style.opacity = "1"
        }, 100)
      }
  
      const handleClick = (e: MouseEvent) => {
        if ( e.target !== optionsModal && e.target !== addButton && isOptionsOpen) {
          closeOptionsModal()
        } else if (e.target === addButton) {
          if (isOptionsOpen) {
            openOptionsModal()
          } else {
            closeOptionsModal()
          }
        }
      }
  
      window.addEventListener("click",handleClick)
      window.addEventListener("scroll", closeOptionsModal)
  
      return () => {
        window.removeEventListener("click", handleClick)
        window.removeEventListener("scroll", closeOptionsModal)
      }
    }


  }, [isOptionsOpen])

  // BATCH REGISTRATION FORM
  const [isBatchFormOpen, setBatchFormOpen] = useState(false)
  const toggleBatchForm = () => {
    setBatchFormOpen(!isBatchFormOpen)
  }

  return (
    <div className='bg-white min-h-[100vh] pt-20'> 
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

      {auth?.role === "admin" && (
        <div>
          {/* ADD STUDENT BUTTON */}
          <button
            onClick={toggleOptionsOpen}
            ref={addButtonRef}
            className='fixed bottom-4 right-4 pl-4 grid place-items-center p-2.5 z-[500] bg-white border border-gray-100 w-16 h-16 shadow-lg rounded-full' 
          >
            <MdPersonAdd size={22} className="text-green-700 -translate-x-1 pointer-events-none" />
          </button>

          {/* MODAL */}
          <div
            ref={optionsModalRef}
            className={`opacity-0 hidden translate-y-10 transition-all duration-200 h-fit w-fit p-1.5 fixed z-[500] bottom-24 right-4 rounded-xl bg-white border border-gray-200 shadow-md flex-col text-sm`}
          >
            <button
              className="flex flex-col w-full rounded-md p-3 active:bg-gray-100"
              onClick={toggleStudentForm}
            >
              <span className="text-nowrap w-fit text-gray-800 flex flex-row gap-3 items-center">
                <LuUserPlus2 size={20} className=" text-gray-600 translate-x-0.5" />
                Register student
              </span>
              <span></span>
            </button>
            <button 
              onClick={toggleBatchForm}
              className="flex flex-col w-full rounded-md p-3 active:bg-gray-100"
            >
              <span className="text-nowrap w-fit text-gray-800 flex flex-row gap-3 items-center">
                <LuFileText size={20} className=" text-gray-600 " />
                Batch registration (CSV)
              </span>
              <span></span>
            </button>
          </div>

          <StudentForm 
            isOpen={isFormOpen}
            toggleStudentForm={toggleStudentForm}
          />

          <BatchRegistrationForm 
            isOpen={isBatchFormOpen}
            toggleForm={toggleBatchForm}
          />

        </div>
      )}

      {/* buttons */}
      <div className="fixed flex flex-row top-0 right-4 h-14 z-[1300] ">
        <button 
          onClick={() => {
            setIsSearchOpen(true)
            setSearchQuery("")
          }}
          className="grid place-items-center p-2 h-full bg-neutral-10 text-gray-700"
        >
          <HiOutlineSearch size={20} />
        </button>
        <button 
          onClick={() => {
            setIsOpen(true)
          }}
          className="grid place-items-center p-2 h-full bg-neutral-10 text-gray-700"
        >
          <LuListFilter size={21} />
        </button>
      </div>

      {isSearchOpen && (
        <SearchBar
          query={searchQuery}
          setQuery={(e) => setSearchQuery(e.target.value)}
          closeSearch={() => {
            setIsSearchOpen(false)
            setSearchQuery("")
            if (searchQuery !== "") {
              setStudents([])
              getStudents(false, program)
            }
          }}
        />
      )}

      {students === undefined && (
        <div className="flex flex-col h-fit p-5">
          {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col w-full gap-2 bg-white py-3 border-gray-200 border-b">
                <div className='animate-pulse bg-gray-200  rounded-md h-4 w-48'></div>
                <div className="flex flex-row gap-2">
                  <div className='animate-pulse bg-gray-100  rounded-md h-4 w-14'></div>
                  <div className='animate-pulse bg-gray-100  rounded-md h-4 w-20'></div>
                </div>
              </div>
          ))}
        </div>
      )}
      
      <div className={` ${styles.studentsList} pb-40 px-5`}>
        {/* <SearchBar className='mb-6 pt-20' fill='bg-gray-200' />  */}
        {isStudentsEmpty ? (
          <div>
            <p className="text-sm font-semibold text-gray-400 text-center">No students found.</p>
          </div>
        ) : (
          <div className='h-fit'>
            {students !== undefined && (
              <InfiniteScroll
                dataLength={students.length}
                next={() => {setPage(page + 1)}}
                hasMore={hasMore}
                endMessage={<div className="absolute w-full text-center left-0 mt-10 font-semibold text-sm text-gray-300" key={1}>Total students found: {students.length}</div>}
                loader={(
                  <div className="h-14 absolute left-0 w-full mt-5 items-center flex justify-center">
                    <Spinner />
                  </div>
                )}
              >
                {students !== undefined && students?.map((student, index) => {
                  return (
                    <StudentCard key={index} studentData={student} />
                  )
                })}
              </InfiniteScroll>
            )}
          </div>
        )}
      </div>
     
    </div>
  )
}

export default StudentsPage