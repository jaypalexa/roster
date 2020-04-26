import LoginModel from 'types/LoginModel';

const AuthenticationService = {
  isAuthenticated: false,
  loggedInUserName: '',
  authenticate(login: LoginModel, cb: (...args: any[]) => void) {
    if (login.userName === 'stinky') { //TODO: DO REAL AUTHENTICATION HERE
      this.isAuthenticated = true;
      this.loggedInUserName = login.userName;
    } else {
      this.isAuthenticated = false;
      this.loggedInUserName = '';
    }
    setTimeout(cb, 100);
  },
  signout(cb: (...args: any[]) => void) {
    this.isAuthenticated = false;
    this.loggedInUserName = '';
    setTimeout(cb, 100);
  }
};

export default AuthenticationService;
