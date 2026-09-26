"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type FilterContextType = {
  subjectId: number | null
  subjectUnitId: number | null
  showAll: boolean
  setFilter: (subjectId: number | null, subjectUnitId: number | null) => void
  clearFilter: () => void
  setShowAll: (value: boolean) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [subjectId, setSubjectId] = useState<number | null>(null)
  const [subjectUnitId, setSubjectUnitId] = useState<number | null>(null)
  const [showAll, setShowAll] = useState<boolean>(false)

  const setFilter = (subjectId: number | null, subjectUnitId: number | null) => {
    setSubjectId(subjectId)
    setSubjectUnitId(subjectUnitId)
    // Al cambiar el filtro, deshabilita la visualización de todos
    setShowAll(false)
  }

  const clearFilter = () => {
    setSubjectId(null)
    setSubjectUnitId(null)
    setShowAll(false)
  }

  return (
    <FilterContext.Provider
      value={{
        subjectId,
        subjectUnitId,
        showAll,
        setFilter,
        clearFilter,
        setShowAll,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}
