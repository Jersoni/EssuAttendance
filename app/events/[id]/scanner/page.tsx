"use client";
import { PageHeader, StudentCard } from "@/components";
import supabase from "@/lib/supabaseClient";
import { StudentProps } from "@/types";
import { lineSpinner } from "ldrs";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { CameraType } from "react-camera-pro/dist/components/Camera/types";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineFlipCameraAndroid } from "react-icons/md";
import Tesseract from "tesseract.js";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel, TabList, TabContext } from '@mui/lab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Scanner = () => {
  lineSpinner.register();
  // Change body styles
  useEffect(() => {
    document.body.style.backgroundColor = "rgb(243 244 246)";
    return () => {
      document.body.style.backgroundColor = ""; // Reset to default on unmount
    };
  }, []);

  const cameraErrorMessages = {
    noCameraAccessible:
      "Unable to access the camera. Please enable camera permissions in your settings.",
    permissionDenied:
      "Permission denied. Please refresh and give camera permission.",
    switchCamera:
      "It is not possible to switch camera to different one because there is only one video device accessible.",
    canvas: "Canvas is not supported.",
  };
  const camera = useRef<CameraType>(null);
  const [scanning, setScanning] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState<number>();
  const [resultID, setResultID] = useState<string>();
  const eventId = usePathname().split("/")[2];
  const [student, setStudent] = useState<StudentProps | null>(null);

  // takePhoto
  const takePhoto = (scanning: boolean) => {
    if (camera.current && scanning === true) {
      console.log("scanning");
      const photo = camera.current.takePhoto(); // capture photo

      if (typeof photo === "string") {
        Tesseract.recognize(photo as string, "eng", {
          logger: (m) => {
            // console.log(m)
          },
        })
          .then(({ data: { text } }) => {
            // find matching ID
            const matchingID = text.match(/\b(\d{2}-\d{4}|\d{6})\b/g);

            if (matchingID) {
              // if ID is found
              console.log(`FOUND A MATCH: ${matchingID}`);
              setResultID(matchingID[0]);
              setScanning(false);
            } else {
              console.log(text);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        console.log("photo is not a string");
      }
    }
  };

  // get student info when resultID changes
  useEffect(() => {
    const fetchStudent = async () => {
      const newID = !resultID?.includes("-")
        ? `${resultID?.slice(0, 2)}-${resultID?.slice(2)}`
        : resultID;

      console.log(resultID);
      console.log(newID);

      if (resultID && eventId && newID) {
        const { data, error } = await supabase
          .from("student")
          .select()
          .eq("id", newID)
          .single();

        if (error) {
          console.error(error);
        } else {
          // then get login and logout status of student
          const { data: attendanceData, error: attendanceError } =
            await supabase
              .from("attendance")
              .select()
              .match({ eventId: eventId, studentId: resultID })
              .single();

          if (attendanceError) {
            console.error(attendanceError);
          } else {
            // Set student data
            const newData = {
              ...data,
              isLoginPresent: attendanceData?.isLoginPresent,
              isLogoutPresent: attendanceData?.isLogoutPresent,
            } as StudentProps;

            setStudent(newData);
            console.log(newData);
          }
        }
      } else {
        console.log("no resultID or eventID");
      }
    };

    if (resultID) fetchStudent();
  }, [resultID, eventId]);

  // call the function takePhoto every 1000ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      takePhoto(scanning);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [scanning]);

  // handle click for switch camera
  const switchCamera = () => {
    if (camera.current) {
      const result = camera.current.switchCamera();
      console.log(result);
    }
  };

  // Tabs
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setValue(1);
  }, [])

  return (
    <div>
      <PageHeader title={`Scanner ${value}`} className="!border-0" />

      <div className="min-h-[100vh] w-full">

        {/* TABLIST */}
        <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', background: "white" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#16a34a', // Custom color for the indicator
                },
                '& .MuiTab-root': {
                  color: 'gray', // Default text color for tabs
                },
                '& .MuiTab-root.Mui-selected': {
                  color: '#16a34a', // Text color for selected tab
                },
              }}
            >
              <Tab 
                sx={{
                  width: "50%",
                }} 
                value="1" 
                label="School ID" 
              />
              <Tab 
                sx={{
                  width: "50%",
                }} 
                value="2" 
                label="RFID" 
              />
            </Tabs>
          </Box>
          <TabPanel value="1">
            <div className="h-[fit] rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-600 text-sm text-white w-full h-[30vh] overflow-hidden !border-0 relative">
                <Camera
                  ref={camera}
                  numberOfCamerasCallback={(i) => {
                    setNumberOfCameras(i);
                  }}
                  errorMessages={cameraErrorMessages}
                />
                {scanning ? (
                  <div>
                    <button
                      onClick={() => setScanning(false)}
                      className="absolute bg-gray-800 text-white bg-opacity-40 p-2.5 px-4 rounded-lg bottom-3 left-3 active:bg-gray-900 active:bg-opacity-50"
                    >
                      <span>Stop</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setScanning(true)}
                      className="absolute bg-gray-800 text-white bg-opacity-40 p-2.5 px-4 rounded-lg bottom-3 left-3 active:bg-gray-900 active:bg-opacity-50"
                    >
                      <span>Scan</span>
                    </button>
                  </div>
                )}
                <button
                  onClick={switchCamera}
                  className=" w-10 h-10 ml-auto bg-gray-800 rounded-full bg-opacity-40 grid place-items-center absolute bottom-3 right-3"
                >
                  <MdOutlineFlipCameraAndroid size={24} fill={"#ffffff"} />
                </button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            Hello
          </TabPanel>
        </TabContext>

        <div className="">
          <div className="mt-5 bg-white w-full h-fit rounded-xl overflow-hidden border border-gray-200 shadow-sm px-5">
            {student !== null && scanning === false && (
              <div>
                <div className="w-full flex flex-row items-center text-xs text-gray-400 justify-between py-2 border-b border-b-gray-200 bg-white">
                  <span>Student</span>
                  <div className="flex flex-row gap-2">
                    <span>Login</span>
                    <span>Logout</span>
                  </div>
                </div>
                <StudentCard
                  eventId={9}
                  studentData={student}
                  className="!border-0"
                />
              </div>
            )}

            {student === null && scanning === false && (
              <div className="py-5 flex flex-row items-center gap-1.5">
                <IoIosCloseCircleOutline size={18} className="fill-gray-500" />
                <span className="text-gray-500 text-sm">No ID detected.</span>
              </div>
            )}

            {scanning && (
              <div className="flex flex-row items-center gap-3 text-sm text-gray-600 py-5">
                <l-line-spinner
                  size="20"
                  stroke="2"
                  speed="1"
                  color="gray"
                ></l-line-spinner>
                <span>Scanning</span>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col text-xs">
            <span className="font-semibold">Guidelines</span>
            <ul className="list-disc ml-4 mt-1">
              <li>Ensure the text on the ID is clear and legible.</li>
              <li>
                You may only use either a{" "}
                <span className="font-semibold">Library ID</span> or a{" "}
                <span className="font-semibold">School ID</span> as valid
                identification.
              </li>
              <li>
                If School ID is used, Hold the ID horizontally, with the top
                edge rotated counterclockwise.
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className='w-full bg-white h-[100vh] p-5'>
          Photo taken:
          <canvas ref={canvasRef} className='w-full rounded-lg'></canvas>
      </div> */}
      {/* <div className='mt-12 w-full items-center flex flex-row'>
        <button 
          onClick={takePhoto}
          className='w-[4.5rem] h-[4.5rem] bg-gray-400 bg-opacity-45 rounded-full p-2 ml-auto absolute left-1/2 translate-x-[-50%]'
        >
          <div className='bg-white w-full h-full rounded-full active:bg-gray-200 grid place-items-center'>
            <IoCamera size={28} className='opacity-20' />
          </div>
        </button>
      </div> */}

      {/* <ConfirmationModal 
          title='Confirm Attendance Update'
          content={description}
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={onConfirm}
          /> */}
    </div>
  );
};

export default Scanner;
