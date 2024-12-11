"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import CSVupload from "./CSVupload";
import { IFileInfo } from "react-csv-reader";

const BatchRegistrationForm: React.FC<{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}> = ({ isOpen, setOpen }) => {
  
  const toggleForm = () => {
    setOpen(!isOpen)
  }

  // open and close transition
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = bodyRef.current;
    if (main) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        main.style.display = "grid";
        setTimeout(() => {
          main.style.opacity = "1";
        }, 0);
      } else {
        main.style.opacity = "0";
        setTimeout(() => {
          main.style.display = "none";
          document.body.style.overflowY = "auto";
        }, 300);
      }
    }
  }, [isOpen]);

  // submit
  const handleSubmit = () => {};

  const handleChange = () => {};

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e);
  };

  // CSV reader
  const [data, setData] = useState<Array<any>>()
  const [fileInfo, setFileInfo] = useState<IFileInfo>()
  const [originalFile, setOriginalFile] = useState<File>()

  return (
    <div
      ref={bodyRef}
      className={` fixed hidden top-0 bottom-0 right-0 left-0 transition-all duration-200 bg-black/30 backdrop-blur-sm z-[2000] place-items-center`}
    >
      <div
        className={`overflow-hidden pointer-events-auto h-fit max-h-[40rem] w-[90vw] bg-white z-[1400] transition-all duration-[400ms] ease-in-out flex flex-col justify-between rounded-xl`}
      >
        <div className="flex flex-row items-center p-2 bg-white border-b border-gray-300">
          <h1 className="font-semibold absolute p-3 text-black w-full">
            Batch registration
          </h1>
          <Button
            variant="close"
            className="bg-gray-10 h-fit w-fit !p-2.5 !rounded-full ml-auto z-[120] text-black"
            onClick={toggleForm}
          ></Button>
        </div>

        <div className="transition-all duration-300 bg-gray-10 bg-white p-5 flex flex-col gap-5 overflow-y-scroll h-full">
          <p className="text-sm text-gray-800">
            Upload a CSV or TSV file. The first row should be the headers of the
            table, and your headers should not include any special characters
            other than hyphens (-) or underscores ( _ ).
          </p>
          <p className="text-sm text-gray-800">
            Tip: Datetime columns should be formatted as YYYY-MM-DD HH:mm:ss
          </p>

          <CSVupload 
            data={data}
            setData={setData}
            fileInfo={fileInfo}
            setFileInfo={setFileInfo}
            originalFile={originalFile}
            setOriginalFile={setOriginalFile}
          />

        </div>
      </div>
      <div 
        onClick={() => setOpen(false)}
        className="absolute opacity-0 bg-black top-0 left-0 right-0 bottom-0"
      ></div>
    </div>
  );
};

export default BatchRegistrationForm;
