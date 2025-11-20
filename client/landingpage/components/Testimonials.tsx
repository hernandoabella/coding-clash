import React from "react";

const testimonials = [
  {
    name: "María López",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "¡Me encanta esta plataforma! Aprendí nuevas técnicas de programación jugando y compitiendo con mis amigos.",
    role: "Desarrolladora Frontend"
  },
  {
    name: "Carlos Pérez",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "Los juegos son desafiantes y divertidos. El sistema de ranking me motivó a seguir mejorando cada día.",
    role: "Estudiante de Ingeniería"
  },
  {
    name: "Ana Torres",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Una herramienta genial para practicar y avanzar en mis habilidades. ¡100% recomendada!",
    role: "Full Stack Developer"
  }
];

const Testimonials: React.FC = () => (
  <section style={{ 
    padding: "3rem 0 2.5rem", 
    background: "#f5f4fa", 
    textAlign: "center" 
  }}>
    <h2 style={{ fontSize: "2rem", color: "#53389E", marginBottom: "2rem" }}>Testimonios</h2>
    <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
      {testimonials.map((t, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 0 18px 4px #e2e0ec26",
            padding: "2rem 1.25rem",
            maxWidth: 330,
            minWidth: 240,
            marginBottom: "1.5rem"
          }}
        >
          <img
            src={t.avatar}
            alt={t.name}
            style={{
              width: 64, height: 64,
              borderRadius: "50%",
              marginBottom: "1rem",
              border: "3px solid #53389E"
            }}
          />
          <p style={{ fontStyle: "italic", lineHeight: 1.5, marginBottom: "1.2rem" }}>"{t.quote}"</p>
          <div style={{ fontWeight: 600, color: "#53389E", marginBottom: "0.3rem" }}>{t.name}</div>
          <div style={{ color: "#888", fontSize: "0.95rem" }}>{t.role}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;