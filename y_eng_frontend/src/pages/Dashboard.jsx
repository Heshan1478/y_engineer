import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) navigate("/login");
      else setEmail(data.user.email);
    });
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Dashboard</h2>
      <p>Logged in as: {email}</p>
      <button onClick={logout} style={{ padding: 10 }}>Logout</button>
    </div>
  );
}
