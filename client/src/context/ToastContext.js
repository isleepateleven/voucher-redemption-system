import React, { createContext, useRef, useContext } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const showToast = ({ severity = "info", summary, detail, life = 3000 }) => {
    toastRef.current?.clear();
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