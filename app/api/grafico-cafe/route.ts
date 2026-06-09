import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  // KC=F é o código do contrato futuro de café no Yahoo Finance
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/KC=F?range=1mo&interval=1d`;

  try {
    const response = await axios.get(url);
    const result = response.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0].close;

    // 1. Transformamos os dados brutos
    // 2. Usamos .slice(-15) para pegar apenas os últimos 15 elementos do array
    const dadosFormatados = timestamps
      .map((ts: number, index: number) => ({
        // Formatamos para exibir apenas dia/mês para ficar mais limpo na TV
        data: new Date(ts * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        preco: quotes[index] ? parseFloat(quotes[index].toFixed(2)) : 0
      }))
      .slice(-15); 

    return NextResponse.json(dadosFormatados);
  } catch (error) {
    console.error("Erro ao buscar dados do Yahoo Finance:", error);
    return NextResponse.json({ error: "Falha ao buscar histórico" }, { status: 500 });
  }
}