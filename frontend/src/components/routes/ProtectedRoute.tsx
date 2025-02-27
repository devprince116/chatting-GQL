import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }: { component: any }) => {
  const token = localStorage.getItem("token");
  return token ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;