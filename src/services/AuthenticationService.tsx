const AuthenticationService = {
  isAuthenticated: false,
  loggedInUserName: '',
  authenticate(loggedInUserName: string, cb: (...args: any[]) => void) {
    this.isAuthenticated = true;
    this.loggedInUserName = loggedInUserName;
    // localStorage.setItem('lastLogin', new Date().valueOf().toString());
    // localStorage.setItem('loggedInUserName', loggedInUserName);
    setTimeout(cb, 100);
  },
  signout(cb: (...args: any[]) => void) {
    this.isAuthenticated = false;
    this.loggedInUserName = '';
    // localStorage.removeItem('lastLogin');
    // localStorage.removeItem('loggedInUserName');
    setTimeout(cb, 100);
  }
};

export default AuthenticationService;
