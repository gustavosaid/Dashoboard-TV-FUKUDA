'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState({ 
    dolar: '...', 
    euroReal: '...', 
    euroDolar: '...', 
    cafe: '...', 
    timestamp: '' 
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/cotacoes');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Erro ao atualizar", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); 
    return () => clearInterval(interval);
  }, []);

  const baseCardStyle = {
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center" as const,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E2E8F0"
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "'Segoe UI', Roboto, Arial, sans-serif" }}>
      
      {/* HEADER PADRÃO FUKUDA */}
      <header style={{ 
        padding: "20px 40px", 
        backgroundColor: "#FFFFFF", // Fundo branco para o logo aparecer (se o logo for escuro/colorido)
        borderBottom: "1px solid #EBEBEB",
        textAlign: "center",
        marginBottom: "40px"
      }}>
        {/* Se a logo estiver em /public/fukuda_logo.png */}
        <img 
          src="/fukuda_logo_horizontal_positivo.png" 
          alt="Fukuda Logo" 
          style={{ width: "270px", height: "auto" }} 
        />
      </header>

      {/* CONTEÚDO DO PAINEL */}
      <div style={{ padding: "0 40px 40px 40px" }}>
        <h1 style={{ color: "#1E293B", marginBottom: "40px", textAlign: "center", fontSize: "28px", fontWeight: "600" }}>
          Painel de Cotações
        </h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "25px", maxWidth: "1000px", margin: "0 auto" }}>
          
          <div style={{...baseCardStyle, borderTop: "5px solid #A3202E"}}>
            <h2 style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>USD / BRL</h2>
            <p style={{ fontSize: "56px", fontWeight: "700", color: "#A3202E", margin: "10px 0" }}>{data.dolar}</p>
          </div>

          <div style={{...baseCardStyle, borderTop: "5px solid #2563EB"}}>
            <h2 style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>EUR / BRL</h2>
            <p style={{ fontSize: "56px", fontWeight: "700", color: "#2563EB", margin: "10px 0" }}>{data.euroReal}</p>
          </div>

          <div style={{...baseCardStyle, borderTop: "5px solid #7C3AED"}}>
            <h2 style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>EUR / USD</h2>
            <p style={{ fontSize: "56px", fontWeight: "700", color: "#7C3AED", margin: "10px 0" }}>{data.euroDolar}</p>
          </div>

          <div style={{...baseCardStyle, borderTop: "5px solid #D97706"}}>
            <h2 style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>Preço do Café</h2>
            <p style={{ fontSize: "56px", fontWeight: "700", color: "#D97706", margin: "10px 0" }}>{data.cafe}</p>
          </div>

        </div>

        <div style={{ textAlign: "center", marginTop: "40px", fontSize: "13px", color: "#94A3B8" }}>
          Atualizado às: {data.timestamp} | <strong>Desenvolvido pela TI - ti@fukuda.co</strong>
        </div>
      </div>
    </div>
  );
}