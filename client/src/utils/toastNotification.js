import { Bounce, toast } from 'react-toastify';

const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
};

export function showSuccessToast(message) {
  toast.success(message, toastOptions);
}

export function showErrorToast(message) {
  toast.error(message, toastOptions);
}