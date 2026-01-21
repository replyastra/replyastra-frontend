import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <Navbar setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "dashboard" && <Dashboard />}
    </div>
  );
}

function Navbar({ setPage }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#667eea" }}>ReplyAstra</h1>
      <div>
        <button onClick={() => setPage("home")} style={{ marginRight: "10px", padding: "10px 20px", background: "transparent", border: "none", cursor: "pointer" }}>Home</button>
        <button onClick={() => setPage("login")} style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Login</button>
      </div>
    </div>
  );
}

function Home({ setPage }) {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px", color: "#fff" }}>
      <h2 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}>Automate Instagram DMs</h2>
      <p style={{ fontSize: "18px", marginBottom: "40px" }}>Turn followers into customers 24/7</p>
      <button onClick={() => setPage("login")} style={{ padding: "15px 30px", fontSize: "18px", background: "#fff", color: "#667eea", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Get Started</button>
    </div>
  );
}

import { API_URL } from "./config";


function Login({ setPage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setPage("dashboard");
      } else {
        setMsg(data.msg || "Login failed");
      }

    } catch (err) {
      setMsg("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">

      <h3 className="text-xl font-bold mb-4">
        Login to ReplyAstra
      </h3>

      <input
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        className="border p-2 w-full mb-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>

      {msg && (
        <p className="text-red-500 mt-3 text-sm">
          {msg}
        </p>
      )}

    </div>
  );
}


function Dashboard() {
  const [trigger, setTrigger] = useState("");
  const [reply, setReply] = useState("");
  const [rules, setRules] = useState([]);

  function saveRule() {
    if (!trigger || !reply) return alert("Fill all fields");
    setRules([...rules, { trigger, reply }]);
    setTrigger("");
    setReply("");
  }

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>Dashboard</h2>
      
      <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", maxWidth: "500px", color: "#333" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Create Automation</h3>
        
        <input 
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="Trigger word " 
          style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "16px" }}
        />
        
        <textarea 
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Auto reply message" 
          style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "16px", minHeight: "100px" }}
        />
        
        <button onClick={saveRule} style={{ padding: "12px 24px", background: "#10b981", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>Save Rule</button>
      </div>

      <div style={{ marginTop: "30px", maxWidth: "500px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Saved Automations</h3>
        {rules.length === 0 && <p style={{ color: "#fff" }}>No rules yet</p>}
        {rules.map((r, i) => (
          <div key={i} style={{ background: "#fff", padding: "15px", marginBottom: "10px", borderRadius: "5px", color: "#333" }}>
            <p><strong>Trigger:</strong> {r.trigger}</p>
            <p><strong>Reply:</strong> {r.reply}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
