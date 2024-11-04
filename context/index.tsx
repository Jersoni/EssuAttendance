'use client'
import React, { createContext, useContext, useState, useEffect, SetStateAction } from 'react';

const AppContext = createContext<any>(undefined)

export const AppWrapper = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <AppContext.Provider value={{
      isNavOpen, 
      setIsNavOpen
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext);
}