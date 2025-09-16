import axios from "axios";
import React, { useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  
  useEffect(() => {
      const checkAuth = async () => {
          try {
              const res = await axios.get("http://localhost:8003/admin/checkAuth", {
                  withCredentials: true, // ✅ important for cookies
                });
                console.log(res,"--------------------------------------------");
                setIsAuth(res.data.success);
    } catch (err) {
      setIsAuth(false);
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
},[]);


  if (loading) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to="/login" replace />;
}