'use client';
import { useEffect, useState } from 'react';
import GraficoCafe from './components/GraficoCotacao';

export default function Dashboard() {
  const [data, setData] = useState({ 
    dolar: '...', euroReal: '...', euroDolar: '...', cafe: '...', timestamp: '' 
  });
  // 1. Tipagem explícita: define o que é o dado do histórico
  const [historico, setHistorico] = useState<{data: string, preco: number}[]>([]); 
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resCotacoes, resGrafico] = await Promise.all([
        fetch('/api/cotacoes', { cache: 'no-store' }),
        fetch('/api/grafico-cafe', { cache: 'no-store' })
      ]);
      
      if (resCotacoes.ok) {
        const jsonCotacoes = await resCotacoes.json();
        setData(jsonCotacoes);
      }

      if (resGrafico.ok) {
        // 2. Aqui eliminamos o erro forçando a tipagem do resultado
        const jsonGrafico: {data: string, preco: number}[] = await resGrafico.json();
        if (Array.isArray(jsonGrafico)) {
          setHistorico(jsonGrafico);
        }
      }
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const baseCardStyle = {
    borderRadius: "16px", padding: "30px", textAlign: "center" as const,
    backgroundColor: "#FFFFFF", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E2E8F0"
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Carregando painel...</div>;

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", fontFamily: "'Segoe UI', Roboto, Arial, sans-serif" }}>
      
      {/* HEADER */}
      <header style={{ padding: "20px 40px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #EBEBEB", textAlign: "center", marginBottom: "40px" }}>
        <img src="/fukuda_logo_horizontal_positivo.png" alt="Fukuda Logo" style={{ width: "270px" }} />
      </header>

      <div style={{ padding: "0 40px 40px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#1E293B", marginBottom: "40px", textAlign: "center", fontSize: "28px", fontWeight: "600" }}>
          Painel de Cotações
        </h1>
        
        {/* GRID PRINCIPAL */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "25px", marginBottom: "30px" }}>
          
          <div style={{...baseCardStyle, borderTop: "5px solid #A3202E"}}>
            <h2 style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase" }}>USD / BRL</h2>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#A3202E" }}>{data.dolar}</p>
          </div>

          <div style={{...baseCardStyle, borderTop: "5px solid #2563EB"}}>
            <h2 style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase" }}>EUR / BRL</h2>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#2563EB" }}>{data.euroReal}</p>
          </div>

          <div style={{...baseCardStyle, borderTop: "5px solid #7C3AED"}}>
            <h2 style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase" }}>EUR / USD</h2>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#7C3AED" }}>{data.euroDolar}</p>
          </div>

          <div style={{...baseCardStyle, borderTop: "5px solid #D97706"}}>
            <h2 style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase" }}>Indicador Café Arábica</h2>
            <p style={{ fontSize: "32px", fontWeight: "700", color: "#D97706" }}>{data.cafe}</p>
          </div>
        </div>

        {/* CARD DO GRÁFICO (OCUPA LARGURA TOTAL) */}
        <div style={{...baseCardStyle, borderTop: "5px solid #D97706"}}>
            <h2 style={{ fontSize: "16px", color: "#64748B", marginBottom: "20px", textAlign: "left" }}>
              Café Contrato C Futuros
            </h2>
            <div style={{ width: "100%", height: "300px" }}>
              <GraficoCafe dados={historico} cor="#D97706" />
            </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px", fontSize: "13px", color: "#94A3B8" }}>
          Atualizado às: {data.timestamp} | <strong>Desenvolvido pela TI - ti@fukuda.co</strong>
        </div>
      </div>
    </div>
  );
}