import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="container">
        <h1>Carregando...</h1>
        <p>Verificando sua sessão.</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/produtos" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;