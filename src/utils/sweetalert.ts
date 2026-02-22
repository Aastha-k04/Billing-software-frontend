import Swal from 'sweetalert2';

/**
 * Pre-configured SweetAlert2 instance with project theme colors
 */
export const themedSwal = Swal.mixin({
  background: '#171412', // --premium-base
  color: '#F0ECE6',      // --premium-text-primary
  confirmButtonColor: '#B45309', // --premium-amber-700
  cancelButtonColor: '#2E2A27',  // --premium-elevated
  customClass: {
    popup: 'premium-swal-popup',
    title: 'premium-swal-title',
    htmlContainer: 'premium-swal-text',
    confirmButton: 'premium-swal-confirm',
    cancelButton: 'premium-swal-cancel',
  },
  buttonsStyling: true,
});

/**
 * Show a success toast/popup
 */
export const showSuccess = (title: string, text?: string) => {
  return themedSwal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: 2000,
    showConfirmButton: false,
    iconColor: '#F59E0B', // --premium-amber-500
  });
};

/**
 * Show an error popup
 */
export const showError = (title: string, text?: string) => {
  return themedSwal.fire({
    icon: 'error',
    title: title,
    text: text,
    iconColor: '#f87171', // Matches status-overdue
  });
};

/**
 * Show a warning/info popup
 */
export const showWarning = (title: string, text?: string) => {
  return themedSwal.fire({
    icon: 'warning',
    title: title,
    text: text,
    iconColor: '#fbbf24', // Matches status-pending
  });
};

/**
 * Show a confirmation dialog
 */
export const showConfirm = (title: string, text: string, confirmText: string = 'Yes, proceed') => {
  return themedSwal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    iconColor: '#F59E0B',
  });
};

export default themedSwal;
