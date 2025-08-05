import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showSuccess = (message) => {
  return MySwal.fire({
    icon: 'success',
    title: 'نجاح',
    text: message,
    confirmButtonText: 'حسناً',
    confirmButtonColor: '#3085d6',
  });
};

export const showError = (message) => {
  return MySwal.fire({
    icon: 'error',
    title: 'خطأ',
    text: message,
    confirmButtonText: 'حسناً',
    confirmButtonColor: '#d33',
  });
};

export const showConfirm = (message, confirmButtonText = 'نعم', cancelButtonText = 'إلغاء') => {
  return MySwal.fire({
    title: 'هل أنت متأكد؟',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  });
};

export const showLoading = (message = 'جاري التحميل...') => {
  MySwal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      MySwal.showLoading();
    },
  });
};

export const closeLoading = () => {
  MySwal.close();
};
