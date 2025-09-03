"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type FilterContextType = {
  categoryFilter: string | null
  subCategoryFilter: string | null
  showAll: boolean
  setFilter: (category: string | null, subCategory: string | null) => void
  clearFilter: () => void
  setShowAll: (value: boolean) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | null>(null)
  const [showAll, setShowAll] = useState<boolean>(false)

  const setFilter = (category: string | null, subCategory: string | null) => {
    setCategoryFilter(category)
    setSubCategoryFilter(subCategory)
    // Al cambiar el filtro, deshabilita la visualización de todos
    setShowAll(false)
  }

  const clearFilter = () => {
    setCategoryFilter(null)
    setSubCategoryFilter(null)
    setShowAll(false)
  }

  return (
    <FilterContext.Provider
      value={{
        categoryFilter,
        subCategoryFilter,
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
