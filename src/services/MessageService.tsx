import { ToastProps } from 'components/Toast/Toast';
import { Subject } from 'rxjs';

export interface TextMessage {
  [key: string]: any;
  text: string;
};

export interface UserNameMessage {
  [key: string]: any;
  userName: string;
};

export interface IsUpdateAvailableMessage {
  [key: string]: any;
  isUpdateAvailable: boolean;
};

export interface LastUpdateCheckDateTimeMessage {
  [key: string]: any;
  lastUpdateCheckDateTime: string;
};

const subject = new Subject<TextMessage>();
const toastSubject = new Subject<ToastProps>();
const userNameSubject = new Subject<UserNameMessage>();
const isUpdateAvailableSubject = new Subject<IsUpdateAvailableMessage>();
const lastUpdateCheckDateTimeSubject = new Subject<LastUpdateCheckDateTimeMessage>();

export const MessageService = {
    sendMessage: (message: string) => subject.next({ text: message }),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable(),

    notifyToastRequest: (toastProps: ToastProps) => toastSubject.next(toastProps),
    observeToastRequest: () => toastSubject.asObservable(),

    notifyUserNameChanged: (userName: string) => userNameSubject.next({ userName }),
    observeUserNameChanged: () => userNameSubject.asObservable(),

    notifyIsUpdateAvailableChanged: (isUpdateAvailable: boolean) => isUpdateAvailableSubject.next({ isUpdateAvailable }),
    observeIsUpdateAvailableChanged: () => isUpdateAvailableSubject.asObservable(),

    notifyLastUpdateCheckDateTimeChanged: (lastUpdateCheckDateTime: string) => lastUpdateCheckDateTimeSubject.next({ lastUpdateCheckDateTime }),
    observeLastUpdateCheckDateTimeChanged: () => lastUpdateCheckDateTimeSubject.asObservable(),
};

export default MessageService;