"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SearchOverlayContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SearchOverlayContext = createContext<SearchOverlayContextType>({
  open: false,
  setOpen: () => {},
});

export function SearchOverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SearchOverlayContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchOverlayContext.Provider>
  );
}

export function useSearchOverlay() {
  return useContext(SearchOverlayContext);
}