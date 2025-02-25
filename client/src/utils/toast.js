
import { toast } from "react-toastify";

// Default options for the toast
const defaultOptions = {
  position: "top-right",  
  autoClose: 5000,        
  hideProgressBar: false, 
  closeOnClick: true,     
  pauseOnHover: true,    
  draggable: true,       
  progress: undefined,    
};

const showToast = (message, type = "info", options = {}) => {
  const toastOptions = { ...defaultOptions, ...options };

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    case "info":
    default:
      toast.info(message, toastOptions);
      break;
  }
};

export default showToast;
