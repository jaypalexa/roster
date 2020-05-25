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

const subject = new Subject<TextMessage>();
const userNameSubject = new Subject<UserNameMessage>();
const isUpdateAvailableSubject = new Subject<IsUpdateAvailableMessage>();

export const MessageService = {
    sendMessage: (message: string) => subject.next({ text: message }),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable(),

    notifyUserNameChanged: (userName: string) => userNameSubject.next({ userName }),
    observeUserNameChanged: () => userNameSubject.asObservable(),

    notifyIsUpdateAvailableChanged: (isUpdateAvailable: boolean) => isUpdateAvailableSubject.next({ isUpdateAvailable }),
    observeIsUpdateAvailableChanged: () => isUpdateAvailableSubject.asObservable(),
};

export default MessageService;