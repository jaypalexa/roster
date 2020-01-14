// https://stackoverflow.com/questions/59422159/redirecting-a-user-to-the-page-they-requested-after-successful-authentication-wi/59423442#59423442

import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
  redirectPathOnAuthentication: string;
  setRedirectPathOnAuthentication: (path: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {
  const currentLocation = useLocation();
  if (!props.isAuthenticated) {
    props.setRedirectPathOnAuthentication(currentLocation.pathname);
    const renderComponent = () => <Redirect to={{ pathname: '/login' }} />;
    return <Route {...props} component={renderComponent} render={undefined} />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;