import React, { createContext, useState, FC, ReactNode } from "react";

type SelectedValuesContextType = {
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
};

const SelectedValuesContext = createContext<SelectedValuesContextType | undefined>(undefined);

export const SelectedValuesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return <SelectedValuesContext.Provider value={{ selectedValues, setSelectedValues }}>{children}</SelectedValuesContext.Provider>;
};

export const useSelectedValues = () => {
  const context = React.useContext(SelectedValuesContext);
  if (!context) {
    throw new Error("useSelectedValues must be used within a SelectedValuesProvider");
  }
  return context;
};
