"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type FilterContextType = {
  categoryFilter: string | null
  subCategoryFilter: string | null
  setFilter: (category: string | null, subCategory: string | null) => void
  clearFilter: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | null>(null)

  const setFilter = (category: string | null, subCategory: string | null) => {
    setCategoryFilter(category)
    setSubCategoryFilter(subCategory)
  }

  const clearFilter = () => {
    setCategoryFilter(null)
    setSubCategoryFilter(null)
  }

  return (
    <FilterContext.Provider
      value={{
        categoryFilter,
        subCategoryFilter,
        setFilter,
        clearFilter,
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
