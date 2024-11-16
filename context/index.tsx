'use client'
import { AuthProps } from '@/types';
import React, { createContext, useContext, useState, useEffect, SetStateAction } from 'react';

const AppContext = createContext<any>(undefined)

export const AppWrapper = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [orgId, setOrgId] = useState(0)

  return (
    <AppContext.Provider value={{
      isNavOpen, setIsNavOpen,
      orgId, setOrgId,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext);
}