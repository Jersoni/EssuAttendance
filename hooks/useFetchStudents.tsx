import { StudentProps } from "@/types";
import { useState } from "react";

const useFetchStudents = () => {

    const [students, setStudents] = useState<StudentProps[]>([])

    const getStudents = async () => {
        try {
          const res = await fetch('/api/students');
          const json = await res.json();

          if (!res.ok) {
            throw new Error('Error fetching students');
          }
          
          setStudents(json)

        } catch (error) {
          console.error(error);
          throw error;
        }
    };
      
    return {
        students,
        getStudents
    }
}

export default useFetchStudents