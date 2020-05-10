import Login from 'components/Login/Login';
import React, { useEffect, useState } from 'react';
import { Route, RouteProps, useLocation } from 'react-router';
import AuthenticationService from 'services/AuthenticationService';

interface ProtectedRouteProps extends RouteProps {
  setLoggedInUserName: React.Dispatch<React.SetStateAction<string>>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const currentLocation = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      const isUserAuthenticated = await AuthenticationService.isUserAuthenticated(`ProtectedRoute::${props.path}`)
      setIsUserAuthenticated(isUserAuthenticated);
    }
    checkAuthentication();
  });

  if (!isUserAuthenticated) {
    const renderComponent = () => <Login setLoggedInUserName={props.setLoggedInUserName} redirectPathOnAuthentication={currentLocation.pathname} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;