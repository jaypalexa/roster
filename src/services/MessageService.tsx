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

    sendUserNameChanged: (userName: string) => userNameSubject.next({ userName }),
    getUserNameChanged: () => userNameSubject.asObservable(),

    sendIsUpdateAvailableChanged: (isUpdateAvailable: boolean) => isUpdateAvailableSubject.next({ isUpdateAvailable }),
    getIsUpdateAvailableChanged: () => isUpdateAvailableSubject.asObservable(),
};

export default MessageService;