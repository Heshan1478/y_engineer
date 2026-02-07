import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setMsg(error.message);
    else {
      setMsg("Password updated successfully. You can login now.");
      setTimeout(() => navigate("/login"), 800);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleUpdatePassword}>
        <input
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
          placeholder="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={{ width: "100%", padding: 10 }}>Update Password</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
