import React from "react";

// Puedes reemplazar estos datos mockeados más adelante por datos reales
const mockLeaders = [
  { username: "CodeMaster", points: 1800 },
  { username: "AlexPro", points: 1620 },
  { username: "NandoDev", points: 1470 },
  { username: "ScriptKid", points: 1250 },
  { username: "JSamurai", points: 1160 },
];

const Leaderboard: React.FC = () => (
  <section style={{
    padding: "3rem 0 2rem",
    background: "#fff",
    textAlign: "center",
    borderTop: "1px solid #ede8f7",
    borderBottom: "1px solid #ede8f7"
  }}>
    <h2 style={{ fontSize: "2rem", color: "#53389E", marginBottom: "1.5rem" }}>
      Ranking de Jugadores
    </h2>
    <table style={{
      margin: "0 auto",
      minWidth: 320,
      borderCollapse: "collapse",
      background: "#f8f8fc",
      borderRadius: "10px",
      boxShadow: "0 2px 12px 2px #e2e0ec44"
    }}>
      <thead>
        <tr>
          <th style={{ padding: "0.8rem", color: "#888", fontWeight: 700, fontSize: "1rem" }}>Posición</th>
          <th style={{ padding: "0.8rem", color: "#888", fontWeight: 700, fontSize: "1rem" }}>Usuario</th>
          <th style={{ padding: "0.8rem", color: "#888", fontWeight: 700, fontSize: "1rem" }}>Puntos</th>
        </tr>
      </thead>
      <tbody>
        {mockLeaders.map((leader, idx) => (
          <tr key={leader.username}>
            <td style={{ padding: "0.6rem", fontWeight: 600, color: "#53389E" }}>
              {idx + 1}
            </td>
            <td style={{ padding: "0.6rem", fontWeight: 500 }}>
              {leader.username}
            </td>
            <td style={{ padding: "0.6rem", color: "#42307D", fontWeight: 600 }}>
              {leader.points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default Leaderboard;