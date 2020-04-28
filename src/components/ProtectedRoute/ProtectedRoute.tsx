import Login from 'components/Login/Login';
import useAuthentication from 'hooks/UseAuthentication';
import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router';

export const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const { isUserAuthenticated } = useAuthentication();
  const currentLocation = useLocation();

  if (!isUserAuthenticated()) {
    const renderComponent = () => <Login redirectPathOnAuthentication={currentLocation.pathname} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;