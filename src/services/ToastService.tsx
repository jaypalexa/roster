import { ToastProps } from 'components/Toast/Toast';
import { v4 as uuidv4 } from 'uuid';
import MessageService from './MessageService';
  
const onToastClose = (toastProps: ToastProps) => {
  MessageService.notifyToastRequest({...toastProps, isOpen: false});
};

const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' | undefined) => {
  const toastProps = {
    key: uuidv4().toLowerCase(),
    isOpen: true,
    message: message,
    severity: severity,
  } as ToastProps;
  toastProps.onClose = () => onToastClose(toastProps);
  MessageService.notifyToastRequest(toastProps);
};

export const ToastService = {

  success(message: string) {
    showToast(message, 'success');
  },

  info(message: string) {
    showToast(message, 'info');
  },

  warning(message: string) {
    showToast(message, 'warning');
  },

  error(message: string) {
    showToast(message, 'error');
  },

}

export default ToastService;
