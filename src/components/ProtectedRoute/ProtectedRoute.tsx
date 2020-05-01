import Login from 'components/Login/Login';
import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router';
import AuthenticationService from 'services/AuthenticationService';

interface ProtectedRouteProps extends RouteProps {
  setLoggedInUserName: React.Dispatch<React.SetStateAction<string>>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const currentLocation = useLocation();

  if (!AuthenticationService.isUserAuthenticated()) {
    const renderComponent = () => <Login setLoggedInUserName={props.setLoggedInUserName} redirectPathOnAuthentication={currentLocation.pathname} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;