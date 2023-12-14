import { Navigate, Outlet } from 'react-router-dom';

interface PrivateWrapperProps {
  isAuthenticated: boolean;
}

function PrivateWrapper({ isAuthenticated }: PrivateWrapperProps) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateWrapper;
