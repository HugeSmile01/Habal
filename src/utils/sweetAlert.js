import Swal from 'sweetalert2';

// Custom styled SweetAlert2 wrapper with Habal theme
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showSuccess = (message, title = 'Success!') => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK'
  });
};

export const showError = (message, title = 'Error!') => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK'
  });
};

export const showWarning = (message, title = 'Warning!') => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'OK'
  });
};

export const showInfo = (message, title = 'Info') => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'OK'
  });
};

export const showConfirm = (message, title = 'Are you sure?') => {
  return Swal.fire({
    icon: 'question',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, proceed!',
    cancelButtonText: 'Cancel'
  });
};

export const showToast = (message, type = 'success') => {
  return Toast.fire({
    icon: type,
    title: message
  });
};

export const showLoading = (title = 'Processing...', text = 'Please wait') => {
  return Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const closeLoading = () => {
  Swal.close();
};

// Ride specific alerts
export const showRideRequestSuccess = (distance, fee) => {
  return Swal.fire({
    icon: 'success',
    title: 'Ride Requested Successfully!',
    html: `
      <div style="text-align: left; padding: 10px;">
        <p><strong>Distance:</strong> ${distance}</p>
        <p><strong>Estimated Fee:</strong> ${fee}</p>
        <p style="margin-top: 15px; color: #666;">
          Your ride request has been sent to nearby drivers. 
          You'll be notified when a driver accepts your ride.
        </p>
      </div>
    `,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK'
  });
};

export const showRideAcceptedAlert = (driverName, vehicleInfo) => {
  return Swal.fire({
    icon: 'success',
    title: 'Ride Accepted!',
    html: `
      <div style="text-align: left; padding: 10px;">
        <p><strong>Driver:</strong> ${driverName}</p>
        <p><strong>Vehicle:</strong> ${vehicleInfo}</p>
        <p style="margin-top: 15px; color: #666;">
          Your driver is on the way to pick you up!
        </p>
      </div>
    `,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK'
  });
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showToast,
  showLoading,
  closeLoading,
  showRideRequestSuccess,
  showRideAcceptedAlert
};
