import { Navigate } from "react-router-dom";

const PublicRoute = ({ component: Component }: { component: any }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/chat" /> : <Component />;
};

export default PublicRoute;
