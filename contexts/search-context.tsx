"use client"

import { createContext, useContext, useState } from "react"

const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: (query: string) => {},
})

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  return useContext(SearchContext)
}