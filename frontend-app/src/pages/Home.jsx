import { useState, useEffect } from "react";
import "../css/Home.css";

export default function HomePage() {
  const [ip, setIp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [routers, setRouters] = useState("");
  const [_id, setObject_id] = useState("");

  useEffect(() => {
    const fetchRouters = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/routers");
        const data = await res.json();
        setRouters(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchRouters();
  }, []);

  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRouter = { ip, username, password, _id };

    if (editIndex !== null) {
      const res = await fetch("http://localhost:4000/api/routers/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          object_id: _id,
          ip,
          username,
          password
        })
      });
      const data = await res.json()
      console.log(data)

      const updated = [...routers];
      updated[editIndex] = newRouter;
      setRouters(updated);
      setEditIndex(null);
    } else {
      const res = await fetch("http://localhost:4000/api/routers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip,
          username,
          password
        })
      });
      const data = await res.json()
      console.log(data.insertedId)

      const newRouter = {
        ip,
        username,
        password,
        _id: data.insertedId
      }
      setRouters([...routers, newRouter]);
    }

    // เคลียร์ช่อง input
    setIp("");
    setUsername("");
    setPassword("");
  };

  const handleDelete = async (index) => {
    const router = routers[index]
    const res = await fetch("http://localhost:4000/api/routers/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        object_id: router._id
      })
    });
    const data = await res.json()
    console.log(data)

    const filtered = routers.filter((_, i) => i !== index);
    setRouters(filtered);
  };

  const handleEdit = (index) => {
    const router = routers[index];
    setIp(router.ip);
    setUsername(router.username);
    setPassword(router.password);
    setEditIndex(index);
    setObject_id(router._id)
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
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.ip}</td>
                  <td>{r.username}</td>
                  <td>{r.password}</td>
                  {/* <td>{r._id}</td> */}
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
                    <button
                      className="view"
                      onClick={() => window.location.href = `/router/${r.ip}`}
                    >
                      ดูรายละเอียด
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
