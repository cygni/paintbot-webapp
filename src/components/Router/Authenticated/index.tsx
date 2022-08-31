import React, { memo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function Authenticated() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to={'/account'} state={{ from: location }} replace />;
  }
}

export default memo(Authenticated);
