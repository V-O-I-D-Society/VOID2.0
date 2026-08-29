import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "./panelSight.css";

const TOKEN_KEY = "void_admin_token";

export default function PanelSight() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | ready
  const [registrations, setRegistrations] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    (async () => {
      try {
        const verify = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!verify.ok) throw new Error("unauthorized");

        const list = await fetch("/api/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!list.ok) throw new Error("unauthorized");

        setRegistrations(await list.json());
        setStatus("ready");
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    navigate("/", { replace: true });
  };

  if (status !== "ready") {
    return <div className="panel-sight panel-sight-loading" />;
  }

  return (
    <div className="panel-sight">
      <Navbar />
      <div className="panel-sight-header">
        <div>
          <h1 className="panel-sight-title">VOID · PANEL SIGHT</h1>
          <p className="panel-sight-sub">{registrations.length} registration(s)</p>
        </div>
        <button type="button" className="panel-sight-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="panel-sight-table-wrap">
        <table className="panel-sight-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Email</th>
              <th>WhatsApp</th>
              <th>Accommodation</th>
              <th>Date</th>
              <th>Screenshot</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.branch}</td>
                <td>{r.email}</td>
                <td>{r.whatsapp}</td>
                <td>{r.accommodation}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="panel-sight-thumb"
                    onClick={() => setLightbox(r.screenshot)}
                  >
                    <img src={r.screenshot} alt={`Payment proof for ${r.name}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && (
          <p className="panel-sight-empty">No registrations yet.</p>
        )}
      </div>

      {lightbox && (
        <div className="panel-sight-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Payment proof" />
        </div>
      )}
    </div>
  );
}
