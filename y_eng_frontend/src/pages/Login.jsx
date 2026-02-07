import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setMsg(error.message);
    else navigate("/dashboard");
  };
  const handleForgotPassword = async () => {
  setMsg("");

  if (!email) {
    setMsg("Please enter your email first.");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/reset-password",
  });

  if (error) setMsg(error.message);
  else setMsg("Password reset email sent. Check your inbox.");
};


  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
           />
          <input
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
            />
        <button style={{ width: "100%", padding: 10 }}>Login</button>
        <button
          type="button"
           onClick={handleForgotPassword}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
            >
          Forgot Password
            </button>

      </form>

      {msg && <p>{msg}</p>}

      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
    
    );
  
}
