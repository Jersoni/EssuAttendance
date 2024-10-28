'use client'
import { Button } from "@/components";
import { FormOperationProps, StudentFormProps, StudentProps } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMiniUserPlus } from "react-icons/hi2";
import supabase from '../lib/supabaseClient';

// NEW STUDENT FORM COMPONENT
const StudentForm: React.FC<FormOperationProps> = () => {

  // function to convert string to Title Case
  const toTitleCase = (name: string) => {
    return name
        .toLowerCase() // Convert the entire string to lowercase
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
        .join(' '); // Join words back together with spaces
  };

  // Frontend
  
  const [isOpen, setIsOpen] = useState(false)
  const toggleStudentForm = () => {
      setIsOpen(!isOpen);
  };

  function scrollTop() {
    window.scrollTo(0, 0)
  }

  // Backend

  const [formData, setFormData] = useState<StudentFormProps>({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    id: '',
    course: '',
    year: 0,
    section: ''
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("handling submit")
    console.log(formData)

    const formattedData: StudentProps = {
      id: formData.id,
      course: formData.course,
      year: Number(formData.year),
      section: formData.section,
      name: toTitleCase(`${formData.lastName}, ${formData.firstName} ${formData.middleName}.${formData.suffix !== '' ? `, ${formData.suffix}` : ``}`)
    }

    console.log(formattedData)

    const {data, error} = await supabase
      .from('student')
      .insert([{
        ...formattedData
      }])
      
    if (error) {
      console.error(error);
    } else {
      console.log(data);
      
      // Reset all form data
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        suffix: '',
        id: '',
        course: '',
        year: 0,
        section: ''
      });

      // redirect to "Generate QR Code" page
      // ( qr code implementation is cancelled )
      // router.push(`/qrcode/${formData.id}`)
    }
  }

  // OnChange handler for all input elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    let {name, value} = e.target

    setFormData({ ...formData, [name]: toTitleCase(value) });
    
  };

  // keydown event on section, prevent more than 1 character input
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if((e.target as HTMLInputElement).value.length > 0) {
      if (e.key !== 'Backspace') {
        e.preventDefault()
      }
    }

    // if (name === 'id')
    //   if ( /^[a-zA-Z]$/.test(e.key) || value.length > 6 && e.key !== 'Backspace')
    //     e.preventDefault()
  }

  useEffect(() => {
    console.log(formData)
  }, [formData])

  return (
    <div>
      <button className='fixed top-2 right-1.5 pl-4 grid place-items-center p-2.5 z-[1200] text-gray-600 h-10 border-l border-gray-300' onClick={toggleStudentForm}>
        <HiMiniUserPlus size={22} className="translate-y-[2px]" />
      </button>

      {/* NEW   STUDENT FORM */}
      <div className={`${isOpen ? "!h-full" : "" } h-0 w-full fixed left-0 bottom-0 bg-white z-[1200] transition-all duration-200 flex flex-col justify-between`}>

        <div className='flex flex-row items-center p-2 bg-white border-b border-gray-300'>
          <h1 className='font-bold absolute p-3 text-emerald-700 w-full'>Register Student</h1>
          <Button variant='close' className='bg-gray-100 h-fit w-fit !p-2.5 !rounded-full ml-auto z-[120] text-green-900 mr-1' onClick={toggleStudentForm}></Button>
        </div>
        
        <form id="newStudentForm" onSubmit={handleSubmit} className='p-5 flex flex-col gap-4 overflow-y-scroll h-full pb-[8rem] bg-gray-100 pt-8'>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="lastName">Last Name</label>
            <input required onChange={handleChange} autoComplete='off' type="text" name="lastName" id="lastName" className={`form__input`} onBlur={scrollTop}  />
          </div>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="firstName">First Name</label>
            <input required onChange={handleChange} autoComplete='off' type="text" name="firstName" id="firstName" className={`form__input`} onBlur={scrollTop}  />
          </div>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="middleName">Middle Initial</label>
            <input required onChange={handleChange} autoComplete='off' type="text" name="middleName" id="middleName" className={`form__input`} onBlur={scrollTop}  />
          </div>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="suffix">Suffix</label>
            <input onChange={handleChange} autoComplete='off' type="text" name="suffix" id="suffix" className={`form__input`} onBlur={scrollTop} />
          </div>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="id">Student ID</label>
            <input required onChange={handleChange} autoComplete='off' type="text" name="id" id="id" className={`form__input`} onBlur={scrollTop} />
          </div>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="course">Course</label>
            <select required onChange={handleChange} name="course" id="course" className='form__input' defaultValue='NoCourse'>
              <option value="NoCourse"></option>
              <option value="BSCE">BSCE</option>
              <option value="BSINFOTECH">BS INFO TECH</option>
              <option value="BSIT">BSIT</option>
              <option value="BOT">BOT</option>
              <option value="BSHM">BSHM</option>
              <option value="BSTM">BSTM</option>
              <option value="BSE">BSE</option>
              <option value="BSBA">BSBA</option>
              <option value="BSAIS">BSAIS</option>
              <option value="BAC">BAC</option>
              <option value="BTVTED">BTVTED</option>
              <option value="BSEd.">BSEd.</option>
              <option value="BEED">BEED</option>
              <option value="BSN">BSN</option>
              <option value="BSCRIM">BSCRIM</option>
            </select>
          </div>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="year">Year</label>
            <select required onChange={handleChange} name="year" id="year" className='form__input' defaultValue={'NoYear'}>
              <option value="NoYear"></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className='flex flex-col gap-1 bg-white border border-gray-300 rounded-2xl p-3'>
            <label className='form__label' htmlFor="section">Section</label>
            <input required onChange={handleChange} onKeyDown={handleKeydown} autoComplete='off' type="text" name="section" id="section" className={`form__input`} onBlur={scrollTop}  />
          </div>

        </form>

        {/* FORM ACTION BUTTONS */}
        <div className={`z-[120] flex gap-3 w-full p-5 pb-8 bg-white border-t border-gray-300`}>
          {/* <Button variant='secondary' onClick={() => {
            toggleStudentForm()
          }}>Cancel</Button> */}
          <Button 
            type="submit" 
            form="newStudentForm" 
            variant='primary' 
            className="font-bold py-3 bg-emerald-500 !rounded-full w-full text-[15px] px-12 ml-auto"
            onClick={() => {
              toggleStudentForm()
            }}
          >Register Student</Button>
        </div>
      </div>


      {/* BACKDROP */}
      {/* <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`} onClick={toggleStudentForm}></div> */}
    </div>
  )
}

export default StudentForm