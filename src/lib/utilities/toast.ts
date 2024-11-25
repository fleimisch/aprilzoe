import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  success: (message: string) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)'
      }
    }).showToast();
  },
  
  error: (message: string) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top', 
      position: 'right',
      style: {
        background: 'linear-gradient(to right, #ff5f6d, #ffc371)'
      }
    }).showToast();
  }
};