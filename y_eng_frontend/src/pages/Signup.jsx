import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) setMsg(error.message);
    else setMsg("Signup success! If email confirmation is ON, check your email.");
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <button style={{ width: "100%", padding: 10 }}>Create account</button>
      </form>

      {msg && <p>{msg}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
