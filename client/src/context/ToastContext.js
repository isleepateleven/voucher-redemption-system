import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast"; 

// Create a Context object (global container)
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  // toastRef is a reference object that gives us access to the Toast component so we can control it (e.g. show messages).
  const toastRef = useRef(null);

   // function to trigger toast popup
  const showToast = ({ severity = "info", summary, detail, life = 3000 }) => {
    // clear any existing toast message
    toastRef.current?.clear();  // ?. = only run if toastRef.current exists

    // show a new toast message
    toastRef.current?.show({ severity, summary, detail, life });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <>
        {children}
        <Toast ref={toastRef} position="top-right" />   
      </>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);