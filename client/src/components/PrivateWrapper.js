import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateWrapper = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

PrivateWrapper.propTypes = {
  isAuthenticated: PropTypes.bool,
};

export default PrivateWrapper;
