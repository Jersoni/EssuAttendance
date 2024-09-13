"use client";
import React, { ChangeEvent } from "react";
import { RiSearchLine } from "react-icons/ri";

// used to be able to add className for SearchBar
interface searchBarProps {
  className?: string;
  fill?: string;
  query: string;
  setQuery: (e: ChangeEvent<HTMLInputElement>) => void;
}

// TODO: SearchBar component functionality
const SearchBar: React.FC<searchBarProps> = ({
  className,
  fill,
  query,
  setQuery,
}) => {
  return (
    <div className={`${className} flex flex-row items-center gap-3`}>
      <form
        className={`${fill} rounded-xl bg-gray-100 flex flex-row items-center pl-[12px] w-full`}
      >
        <RiSearchLine size={20} className="opacity-50" />
        <input
          type="text"
          className={`${fill} bg-gray-100 w-[90%] text-sm bg-opacity-0 outline-none p-2 pl-3`}
          placeholder={"Search"}
          value={query}
          onChange={setQuery}
        />
      </form>
    </div>
  );
};

export default SearchBar;
