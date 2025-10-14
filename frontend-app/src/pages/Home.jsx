import { useState } from "react";
import "../css/Home.css";

export default function HomePage() {
  const [ip, setIp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const status = "Connecting";
  const [routers, setRouters] = useState([
    { id: 1, ip: "192.168.1.1", username: "admin", password: "1234", status: "Connected" },
    { id: 2, ip: "192.168.1.2", username: "root", password: "abcd", status: "Failed" },
  ]);

  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRouter = { ip, username, password, status };

    if (editIndex !== null) {
      // แก้ไขข้อมูล
      const updated = [...routers];
      updated[editIndex] = newRouter;
      setRouters(updated);
      setEditIndex(null);
    } else {
      // เพิ่มข้อมูลใหม่
      setRouters([...routers, newRouter]);
    }

    // เคลียร์ช่อง input
    setIp("");
    setUsername("");
    setPassword("");
  };

  const handleDelete = (index) => {
    const filtered = routers.filter((_, i) => i !== index);
    setRouters(filtered);
  };

  const handleEdit = (index) => {
    const router = routers[index];
    setIp(router.ip);
    setUsername(router.username);
    setPassword(router.password);
    setEditIndex(index);
  };

  return (
    <>
      <header className="main">
        <h1>EveryLog</h1>
        <h2>Input Router Information</h2>
        <form onSubmit={handleSubmit}>
          <label>IP</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            required
          />

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {editIndex !== null ? "อัปเดตข้อมูล" : "เพิ่ม Router"}
          </button>
        </form>
      </header>

      <div className="container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>IP</th>
              <th>Username</th>
              <th>Password</th>
              <th>Status</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {routers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  ยังไม่มีข้อมูล router
                </td>
              </tr>
            ) : (
              routers.map((r, i) => (
                <tr key={i} onClick={() => window.location.href = `/router/${r.ip}`}>
                  <td>{i + 1}</td>
                  <td>{r.ip}</td>
                  <td>{r.username}</td>
                  <td>{r.password}</td>
                  <td className={
                    r.status === "Connecting" ? "status connecting" :
                      r.status === "Connected" ? "status connected" :
                        r.status === "Failed" ? "status failed" : ""
                  }>
                    {r.status}
                  </td>
                  <td>
                    <button
                      className="edit"
                      onClick={() => handleEdit(i)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(i)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
