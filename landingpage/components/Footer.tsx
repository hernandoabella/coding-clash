import React from "react";

const Footer: React.FC = () => (
  <footer
    style={{
      background: "#53389E",
      color: "#fff",
      textAlign: "center",
      padding: "2rem 0 1rem 0",
      marginTop: "0",
    }}
  >
    <div style={{ marginBottom: "1rem", fontWeight: 500, fontSize: "1.1rem" }}>
      Plataforma de Juegos de Codificación
    </div>
    <div style={{ marginBottom: "0.5rem", fontSize: "0.98rem", color: "#b8b5e9" }}>
      Aprende, compite y mejora tus habilidades de programación jugando.
    </div>
    <div style={{ color: "#b8b5e9", fontSize: "0.92rem" }}>
      © {new Date().getFullYear()} — Creado por tu equipo de desarrolladores favoritos
    </div>
  </footer>
);

export default Footer;