import Login from 'components/Login/Login';
import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router';
import AuthenticationService from 'services/AuthenticationService';

export const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const currentLocation = useLocation();
  if (!AuthenticationService.isAuthenticated) {
    const renderComponent = () => <Login redirectPathOnAuthentication={currentLocation.pathname} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;