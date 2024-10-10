"use client";
import React, { ChangeEvent, useEffect } from "react";
import { RiSearchLine } from "react-icons/ri";
import Button from "./Button";

// used to be able to add className for SearchBar
interface searchBarProps {
  className?: string;
  fill?: string;
  query?: string;
  setQuery?: (e: ChangeEvent<HTMLInputElement>) => void;
  closeSearch: () => void
}

// TODO: SearchBar component functionality
const SearchBar: React.FC<searchBarProps> = ({
  className,
  fill,
  query,
  setQuery,
  closeSearch
}) => {

  useEffect(() => {

  }, [])

  return (
    <div>
      <div className={`${className} flex flex-row items-center gap-1 fixed top-2.5 z-[700] right-3 left-5 bg-white`}>
        <form
          className={`${fill} rounded-lg bg-gray-100 flex flex-row items-center w-full border border-gray-200 overflow-hidden`}
        >
          <RiSearchLine size={20} className="opacity-50 ml-2.5" />
          <input
            type="text"
            className={`${fill} bg-gray-100 w-full text-[16px] bg-opacity-0 outline-none p-2 pl-3`}
            placeholder={"Search"}
            value={query}
            onChange={setQuery}
            autoFocus
          />
        </form>
        <Button 
          variant="close"
          onClick={closeSearch}
          className={`!p-1.5`}
        ></Button>
      </div>
      {query === "" &&  (
        <div
          onClick={closeSearch}
          className="fixed bg-opacity-0 bg-black top-0 left-0 right-0 bottom-0 z-[500]"
        ></div>
      )}
    </div>
  );
};

export default SearchBar;
