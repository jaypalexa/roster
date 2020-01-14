const AuthenticationService = {
  isAuthenticated: false,
  authenticate(cb: (...args: any[]) => void) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb: (...args: any[]) => void) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
};

export default AuthenticationService;
