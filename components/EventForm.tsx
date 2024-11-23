"use client";
import { Button } from "@/components";
import supabase from "@/lib/supabaseClient";
import { FormEventProps } from "@/types";
import { useEffect, useRef, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { Spinner } from '@/components';


// NEW EVENT FORM COMPONENT
const EventForm: React.FC<{
  isOpen: boolean;
  toggleEventForm: () => void;
  orgId: number;
}> = ({ isOpen, toggleEventForm, orgId }) => {
  const today = new Date().toISOString().split("T")[0];

  // Frontend
  const dateInputRef = useRef(null);
  const loginTimeAMInputRef = useRef(null);
  const logoutTimeAMInputRef = useRef(null);

  const loginTimePMInputRef = useRef(null);
  const logoutTimePMInputRef = useRef(null);

  const handleDateClick = () => {
    if (dateInputRef.current)
      (dateInputRef.current as HTMLInputElement).focus();
  };

  const handleLoginTimeClickAM = () => {
    if (loginTimeAMInputRef.current)
      (loginTimeAMInputRef.current as HTMLInputElement).focus();
  };

  const handleLogoutTimeClickAM = () => {
    if (logoutTimeAMInputRef.current)
      (logoutTimeAMInputRef.current as HTMLInputElement).focus();
  };

  const handleLoginTimeClickPM = () => {
    if (loginTimePMInputRef.current)
      (loginTimePMInputRef.current as HTMLInputElement).focus();
  };

  const handleLogoutTimeClickPM = () => {
    if (logoutTimePMInputRef.current)
      (logoutTimePMInputRef.current as HTMLInputElement).focus();
  };

  // newEventButton Click Handler
  // const [isOpen, setIsOpen] = useState(false);
  // const toggleEventForm = () => {
  //     setIsOpen(!isOpen);
  // };

  function scrollTop() {
    window.scrollTo(0, 0);
  }

  // Backend logic___________________________________________________________________________

  const [formData, setFormData] = useState<FormEventProps>({
    title: "",
    location: "",
    loginTimeAM: "",
    logoutTimeAM: "",
    loginTimePM: "",
    logoutTimePM: "",
    fineAmount: "",
    eventDate: "",
  });

  const [isMorningChecked, setMorningChecked] = useState(true);
  const [isAfternoonChecked, setAfternoonChecked] = useState(true);

  // OnChange handler for all input elements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    let updatedValue: string | number =
      value.charAt(0).toUpperCase() + value.slice(1);

    setFormData({ ...formData, [name]: updatedValue });
  };

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false)
  const [formValidationError, setFormValidationError] = useState<string>();

  // form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    setFormValidationError("");

    console.log("handling submit");
    console.log(formData);

    if (formData.loginTimeAM !== "" && formData.logoutTimeAM !== "") {
      const { loginTimeAM, logoutTimeAM, loginTimePM, logoutTimePM, ...rest } =
        formData;

      const amForm = {
        ...rest,
        loginTime: formData.loginTimeAM,
        logoutTime: formData.logoutTimeAM,
      };

      console.log(amForm);

      try {
        if (orgId !== 0) {
          console.log(orgId);

          const { data, error } = await supabase
            .from("event")
            .insert([{ ...amForm, org_id: orgId }]);

          if (error) {
            console.error(error);
            setLoading(false)
            setError(error.message);
          } else {
            console.log(data);
            resetForm();
            toggleEventForm();
            setLoading(false)
          }
        }
      } catch (e) {
        console.error(e);
        setLoading(false)
      }
    }

    if (formData.loginTimePM !== "" && formData.logoutTimePM !== "") {
      const { loginTimeAM, logoutTimeAM, loginTimePM, logoutTimePM, ...rest } =
        formData;

      const pmForm = {
        ...rest,
        loginTime: formData.loginTimePM,
        logoutTime: formData.logoutTimePM,
      };

      console.log(pmForm);

      try {
        if (orgId !== 0) {
          console.log(orgId);

          const { data, error } = await supabase
            .from("event")
            .insert([{ ...pmForm, org_id: orgId }]);

          if (error) {
            console.error(error);
            setError(error.message);
          } else {
            console.log(data);
            resetForm();
            toggleEventForm();
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (
      formData.loginTimePM === "" &&
      formData.logoutTimeAM === "" &&
      formData.loginTimePM === "" &&
      formData.logoutTimePM === ""
    ) {
      setFormValidationError("time");
    }
  };

  const resetForm = () => {
    setMorningChecked(true);
    setAfternoonChecked(true);
    setFormData({
      title: "",
      location: "",
      loginTimeAM: "08:00",
      logoutTimeAM: "12:00",
      loginTimePM: "13:00",
      logoutTimePM: "16:00",
      fineAmount: "",
      eventDate: "",
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (isMorningChecked === false) {
      setFormData((prev) => ({
        ...prev,
        loginTimeAM: "",
        logoutTimeAM: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        loginTimeAM: "08:00",
        logoutTimeAM: "12:00",
      }));
    }
  }, [isMorningChecked]);

  useEffect(() => {
    if (isAfternoonChecked === false) {
      setFormData((prev) => ({
        ...prev,
        loginTimePM: "",
        logoutTimePM: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        loginTimePM: "13:00",
        logoutTimePM: "16:00",
      }));
    }
  }, [isAfternoonChecked]);

  return (
    <div className="overflow-hidden">
      {/* NEW EVENT BUTTON */}
      <button
        onClick={toggleEventForm}
        className="z-[500] fixed bottom-4 right-4 grid place-items-center bg-white border border-gray-100 w-16 h-16 shadow-md rounded-full"
      >
        <IoAdd size={26} className="text-emerald-500" />
      </button>

      {/* NEW EVENT FORM */}
      <div
        className={`${
          isOpen ? "!h-full" : ""
        } h-0 w-full fixed left-0 bottom-0 bg-white z-[1500] transition-all duration-200 flex flex-col justify-between`}
      >
        <form
          id="form"
          onSubmit={handleSubmit}
          className="p-5 flex flex-col gap-4 overflow-y-scroll h-full pb-[8rem] bg-gray-100 pt-20"
        >
          <div className="absolute flex flex-row items-center p-2 top-0 left-0 w-full bg-white border-b border-gray-300">
            <h1 className="font-bold absolute p-3 text-emerald-700 w-full">
              Create Attendance
            </h1>
            <Button
              variant="close"
              className="h-fit w-fit !p-2.5 !rounded-full ml-auto z-[120] text-green-900 mr-1"
              onClick={() => {
                toggleEventForm();
              }}
            ></Button>
          </div>

          {error && (
            <div className="bg-red-200 border-red-300 border p-2 rounded-lg text-red-900">
              Something went wrong. Please reload the page and try again.
            </div>
          )}

          <div className="flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3">
            <label className="form__label" htmlFor="title">
              Title
            </label>
            <input
              onChange={handleChange}
              autoComplete="off"
              type="text"
              name="title"
              id="title"
              value={formData?.title}
              className={`form__input`}
              required
              onBlur={scrollTop}
            />
          </div>
          <div className="flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3">
            <label className="form__label" htmlFor="location">
              Venue
            </label>
            <input
              onChange={handleChange}
              value={formData?.location}
              autoComplete="off"
              type="text"
              name="location"
              id="location"
              required
              className={`form__input`}
              onBlur={scrollTop}
            />
          </div>
          <div className="flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3">
            <label className="form__label" htmlFor="fineAmount">
              Fine
            </label>
            <input
              onChange={handleChange}
              value={formData?.fineAmount}
              autoComplete="off"
              type="number"
              name="fineAmount"
              id="fineAmount"
              className={`form__input`}
              onBlur={scrollTop}
              required
            />
          </div>
          <div className="flex flex-col gap-1 bg-white border border-gray-300 rounded-lg p-3">
            <label className="form__label" htmlFor="eventDate">
              Date
            </label>
            <div
              className={`form__input !pl-0 w-full flex`}
              onClick={handleDateClick}
            >
              <input
                onChange={handleChange}
                value={formData?.eventDate}
                type="date"
                name="eventDate"
                ref={dateInputRef}
                id="eventDate"
                className="outline-none pl-[14px] rounded-full p-0 w-full bg-gray-100"
                required
                min={today}
              />
            </div>
          </div>

          <div className="w-full bg-white border border-gray-300 rounded-lg p-3 pb-0 transition-all">
            <div
              className={`border-b border-gray-300 pb-3 ${
                !isMorningChecked ? "!border-b-0" : ""
              }`}
            >
              <label className="label cursor-pointer">
                <span className="text-sm font-semibold">Morning session</span>
                <input
                  type="checkbox"
                  checked={isMorningChecked}
                  onChange={() => {
                    setMorningChecked(!isMorningChecked);
                  }}
                  className={`toggle border-gray-300 bg-white [--tglbg:#d1d5db] hover:bg-white`}
                />
              </label>
            </div>
            <div
              className={`flex flex-row gap-4 w-full mt-4 
              ${isMorningChecked ? "pb-3" : "hidden"} 
            `}
            >
              <div className="flex flex-col gap-1 w-1/2">
                <label className="form__label" htmlFor="loginTimeAM">
                  Login Time
                </label>
                <div
                  onClick={handleLoginTimeClickAM}
                  className="form__input w-full flex items-center !pl-0"
                >
                  <input
                    onChange={handleChange}
                    value={formData.loginTimeAM}
                    ref={loginTimeAMInputRef}
                    type="time"
                    name="loginTimeAM"
                    id="loginTimeAM"
                    className={`w-full pl-[14px] bg-gray-100 outline-none`}
                    min={"04:00"}
                    max={"12:00"}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label className="form__label" htmlFor="logoutTimeAM">
                  Logout Time
                </label>
                <div
                  onClick={handleLogoutTimeClickAM}
                  className="form__input w-full flex items-center !pl-0"
                >
                  <input
                    onChange={handleChange}
                    value={formData.logoutTimeAM}
                    ref={logoutTimeAMInputRef}
                    type="time"
                    name="logoutTimeAM"
                    id="logoutTimeAM"
                    className={`w-full pl-[14px] bg-gray-100 outline-none`}
                    min={"04:00"}
                    max={"12:00"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-white border border-gray-300 rounded-lg p-3 pb-0 transition-all">
            <div
              className={`border-b border-gray-300 pb-3 ${
                !isAfternoonChecked ? "!border-b-0" : ""
              }`}
            >
              <label className="label cursor-pointer">
                <span className="text-sm font-semibold">Afternoon session</span>
                <input
                  type="checkbox"
                  checked={isAfternoonChecked}
                  onChange={() => {
                    setAfternoonChecked(!isAfternoonChecked);
                  }}
                  className={`toggle border-gray-300 bg-white [--tglbg:#d1d5db] hover:bg-white`}
                />
              </label>
            </div>
            <div
              className={`flex flex-row gap-4 w-full mt-4 
              ${isAfternoonChecked ? "pb-3" : "h-0 !m-0 overflow-hidden"} 
            `}
            >
              <div className="flex flex-col gap-1 w-1/2">
                <label className="form__label" htmlFor="loginTimePM">
                  Login Time
                </label>
                <div
                  onClick={handleLoginTimeClickPM}
                  className="form__input w-full flex items-center !pl-0"
                >
                  <input
                    onChange={handleChange}
                    value={formData.loginTimePM}
                    ref={loginTimePMInputRef}
                    type="time"
                    name="loginTimePM"
                    id="loginTimePM"
                    className={`w-full pl-[14px] bg-gray-100 outline-none`}
                    min={"12:00"}
                    max={"24:00"}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label className="form__label" htmlFor="logoutTimePM">
                  Logout Time
                </label>
                <div
                  onClick={handleLogoutTimeClickPM}
                  className="form__input w-full flex items-center !pl-0"
                >
                  <input
                    onChange={handleChange}
                    value={formData.logoutTimePM}
                    ref={logoutTimePMInputRef}
                    type="time"
                    name="logoutTimePM"
                    id="logoutTimePM"
                    className={`w-full pl-[14px] bg-gray-100 outline-none`}
                    min={"12:00"}
                    max={"24:00"}
                  />
                </div>
              </div>
            </div>
          </div>

          {formValidationError === "time" && (
            <span className="font-medium text-sm text-red-400 ">
              Please fill out Login time and Logout Time fields.
            </span>
          )}

          <div className={`flex gap-3 w-full mt-4 border-gray-300`}>
            {/* <Button variant='secondary'  onClick={toggleEventForm}>Cancel</Button> */}
            <Button
              variant="primary"
              type="submit"
              form="form"
              className=" bg-emerald-500 min-w-48 grid place-items-center text-sm py-2.5 font-semibold !rounded-lg ml-auto"
              disabled={loading}
            >
              {loading ? (
                <Spinner size='1' color='white' className='translate-y-[3px]' />
              ) : (
                "Create attendance"
              )}
            </Button>
          </div>
          {/* <div className='flex flex-col gap-1'>
            <label className='form__label'>Attendees</label>
            <div className='flex flex-wrap mt-1 gap-2 h-fit'>
              <ToggleBox text='All Colleges' />
              <ToggleBox text='BSCE' />
              <ToggleBox text='BS INFO TECH' /> 
              <ToggleBox text='BSIT' />
              <ToggleBox text='BOT' />
              <ToggleBox text='BSHM' />
              <ToggleBox text='BSTM' />
              <ToggleBox text='BSE' />
              <ToggleBox text='BSBA' />
              <ToggleBox text='BSAIS' />
              <ToggleBox text='BAC' />
              <ToggleBox text='BTVTED' />
              <ToggleBox text='BSEd.' />
              <ToggleBox text='BEED' />
              <ToggleBox text='BSN' />
              <ToggleBox text='BSCRIM' />
              <input type="text" placeholder='Other (comma separated)' className={`form__input w-full`} onBlur={scrollTop} />
            </div>
          </div> */}
        </form>
      </div>

      {/* BACKDROP */}
      {/* <div className={`z-[110] bottom-0 left-0 absolute h-full w-full bg-black bg-opacity-70 ${isOpen ? "block" : "hidden" }`} onClick={toggleEventForm}></div> */}
    </div>
  );
};

export default EventForm;
