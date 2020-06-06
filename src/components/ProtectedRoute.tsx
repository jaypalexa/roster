import Login from 'components/Login';
import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';

export const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const currentLocation = useLocation();

  if (!AuthenticationService.isUserAuthenticated()) {
    const renderComponent = () => <Login redirectPathOnAuthentication={currentLocation.pathname} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    AuthenticationService.updateUserActivity();
    return <Route {...props} />;
  }
};

export default ProtectedRoute;