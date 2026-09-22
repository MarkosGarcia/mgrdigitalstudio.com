"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type AssessmentModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AssessmentModalContext = createContext<AssessmentModalContextValue | null>(
  null
);

export const AssessmentModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AssessmentModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </AssessmentModalContext.Provider>
  );
};

export const useAssessmentModal = () => {
  const ctx = useContext(AssessmentModalContext);
  if (!ctx) {
    throw new Error(
      "useAssessmentModal must be used within an AssessmentModalProvider"
    );
  }
  return ctx;
};
