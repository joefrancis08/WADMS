import { Bounce, toast } from 'react-toastify';

export function showSuccessToast(message, position = 'bottom-right', autoClose = 2000) {
  const toastOptions = {
    position,
    autoClose,
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

export function showErrorToast(message, position = 'top-right', autoClose = 5000) {
  const toastOptions = {
    position,
    autoClose,
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

export function showWarnToast(message, position = 'top-right', autoClose = 5000) {
  const toastOptions = {
    position,
    autoClose,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  };

  toast.warn(message, toastOptions);
}
