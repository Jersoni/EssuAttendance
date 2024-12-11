"use client";
import { useEffect, useState } from "react";
import CSVReader, { IFileInfo } from "react-csv-reader";
import { MdOutlineFileUpload } from "react-icons/md";

interface CSVreader {
  data?: Array<any>;
  setData: (data: Array<any>) => void;
  fileInfo?: IFileInfo;
  setFileInfo: (fileInfo: IFileInfo) => void;
  originalFile?: File;
  setOriginalFile: (file: File) => void;
}

const CSVupload = ({ 
  data, 
  setData,
  fileInfo,
  setFileInfo,
  originalFile,
  setOriginalFile
}: CSVreader) => {

  useEffect(() => {
    console.log("loaded");
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault(); // Prevent default drag behavior
    };
    window.addEventListener("dragover", handleDragOver);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  const [error, setError] = useState<string>();

  const handleUpload = (
    data: Array<any>,
    fileInfo: IFileInfo,
    originalFile?: File
  ) => {

    const header = ["id", "name", "course", "year", "section", "rfid"];
  
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        for (let j = 0; j < header.length; j++) {
          if (data[0][j] !== header[j] ) {
            
          }
        }
      }

      if (data[i].length > header.length) {
        setError(
          "Invalid CSV format. Ensure rows are properly delimited, columns are consistent, and data is valid."
        );
        console.log("Error")
        break;
      } else {
        setData(data);
        setError(undefined)
        console.log("No Error")
      }
    }
    
  };

  return (
    <>
      <div className="form__input border !p-0 border-black border-dashed !h-40 grid place-items-center">

        <div className=" relative h-full w-full grid place-items-center">

          <label htmlFor="csvInput" className="flex flex-row items-center gap-2">
            <MdOutlineFileUpload size={24} />
            <span className="text-green-600">Browse</span> your files
          </label>

          <CSVReader
            onFileLoaded={handleUpload}
            inputName="csvInput"
            onError={(error) => console.error("Error reading CSV:", error)}
            cssClass="absolute opacity-0 top-0 left-0 right-0 bottom-0 h-full w-full inline-block"
            cssInputClass="bg-black w-full h-full "
          />
        </div>
      </div>
      {error && (
        <div className="bg-red-400 text-sm text-white p-4 mb-4 rounded-lg">{error}</div>
      )}
    </>
  );
};

export default CSVupload;

//hello world kapanga
