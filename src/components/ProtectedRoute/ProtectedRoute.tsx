import Login from 'components/Login/Login';
import useAuthentication from 'hooks/UseAuthentication';
import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router';

interface ProtectedRouteProps extends RouteProps {
  setLoggedInUserName: React.Dispatch<React.SetStateAction<string>>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { isUserAuthenticated } = useAuthentication();
  const currentLocation = useLocation();

  if (!isUserAuthenticated()) {
    const renderComponent = () => <Login setLoggedInUserName={props.setLoggedInUserName} redirectPathOnAuthentication={currentLocation.pathname} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;