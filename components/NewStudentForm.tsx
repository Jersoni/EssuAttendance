'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components";
import { FiPlus } from "react-icons/fi";
import supabase from '../lib/supabaseClient';
import { useRouter } from "next/navigation";
import { StudentProps } from "@/types";

// NEW STUDENT FORM COMPONENT

const NewStudentForm = () => {

  // Frontend
  
  const [isOpen, setIsOpen] = useState(false)
  const toggleNewStudentForm = () => {
      setIsOpen(!isOpen);
  };

  function scrollTop() {
    window.scrollTo(0, 0)
  }

  // Backend

  const [formData, setFormData] = useState<StudentProps>({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    id: 0,
    course: "",
    year: 0,
    section: "",
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const {data, error} = await supabase.from('student').insert([
      {...formData}
    ])

    if (error) {
      // Handle error
      console.error(error);
    } else {
      // Handle success
      console.log(data);
      
      // Reset all form data
      // setFormData({ 
      //   firstName: '',
      //   lastName: '', 
      //   middleName: '',
      //   suffix: '',
      //   id: 0,
      //   course: '',
      //   year: 0,
      //   section: ''
      // });

      // redirect to "Generate QR Code" page
      router.push(`/qrcode/${formData.id}`)
    }
  }



  // OnChange handler for all input elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    let {name, value} = e.target

    let updatedValue: string | number = value.charAt(0).toUpperCase() + value.slice(1);
    
    // convert year and id input to number and remove dashes if any
    if (name === 'year' || name === 'id') {
      updatedValue = parseInt(value.replace(/-/g, ''));
    }
    
    setFormData({ ...formData, [name]: updatedValue });
  };

  // keydown event on input
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    const { name, value } = e.target as HTMLInputElement

    if (name === 'section') {
      if((e.target as HTMLInputElement).value.length > 0) {
        if (e.key !== 'Backspace') {
          e.preventDefault()
        }
      }
    }

    if (name === 'id')
      if ( /^[a-zA-Z]$/.test(e.key) || value.length > 6 && e.key !== 'Backspace')
        e.preventDefault()

  }

  useEffect(() => {
    // console.log(formData)
  }, [formData])

  return (
    <div>
      <Button variant={'small-circle'} className='z-[30] absolute top-4 right-[70px]' onClick={toggleNewStudentForm}>
        <FiPlus size={24} />
      </Button>

      {/* NEW   STUDENT FORM */}
      <div className={`${isOpen ? "" : "translate-y-full" } bottom-0 absolute rounded-t-2xl left-0 top-0 mt-[5vh] w-full bg-white z-[120] transition-all duration-300 flex flex-col justify-between`}>

        <div className='flex flex-row items-center p-1'>
        <h1 className='font-semibold text-lg p-5 absolute text-center w-full'>New Student</h1>
        <Button variant='close' className='ml-auto z-[120]' onClick={toggleNewStudentForm}></Button>
        </div>

        <form id="newStudentForm" onSubmit={handleSubmit} className='p-5 pt-0 flex flex-col gap-4 overflow-y-scroll h-full pb-[8rem]'>

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="firstName">First Name</label>
            <input required onChange={handleChange} autoComplete='off' type="text" name="firstName" id="firstName" className={`form__input`} onBlur={scrollTop}  />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="lastName">Last Name</label>
            <input required onChange={handleChange} autoComplete='off' type="text" name="lastName" id="lastName" className={`form__input`} onBlur={scrollTop}  />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="middleName">Middle Name</label>
            <input required onChange={handleChange} autoComplete='off' type="text" name="middleName" id="middleName" className={`form__input`} onBlur={scrollTop}  />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="suffix">Suffix</label>
            <input onChange={handleChange} autoComplete='off' type="text" name="suffix" id="suffix" className={`form__input`} onBlur={scrollTop} />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="id">Student ID</label>
            <input required onChange={handleChange} onKeyDown={handleKeydown} autoComplete='off' type="text" name="id" id="id" className={`form__input`} onBlur={scrollTop} />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="course">Course</label>
            <select required onChange={handleChange} name="course" id="course" className='form__input'>
              <option value="NoCoure" selected></option>
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

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="year">Year</label>
            <select required onChange={handleChange} name="year" id="year" className='form__input'>
              <option value="NoYear" selected></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='form__label' htmlFor="section">Section</label>
            <input required onChange={handleChange} onKeyDown={handleKeydown} autoComplete='off' type="text" name="section" id="section" className={`form__input`} onBlur={scrollTop}  />
          </div>

        </form>

        {/* FORM ACTION BUTTONS */}
        <div className={`z-[120] flex gap-3 w-full p-5 pb-8 bg-white`}>
          <Button variant='secondary' onClick={() => {
            toggleNewStudentForm()
          }}>Cancel</Button>
          <Button type="submit" form="newStudentForm" variant='primary' onClick={() => {
            toggleNewStudentForm()
          }}>Post</Button>
        </div>
      </div>


      {/* BACKDROP */}
      <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`} onClick={toggleNewStudentForm}></div>
    </div>
  )
}

export default NewStudentForm