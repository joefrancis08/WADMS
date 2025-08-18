import { Bounce, toast } from 'react-toastify';

export function showSuccessToast(message, position = "bottom-right") {
  const toastOptions = {
    position,
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  };

  toast.success(message, toastOptions);
}

export function showErrorToast(message, position = "top-right") {
  const toastOptions = {
    position,
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  };

  toast.error(message, toastOptions);
}