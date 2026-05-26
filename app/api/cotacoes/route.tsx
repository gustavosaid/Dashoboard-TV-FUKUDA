import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  let dolar = "0.0000", euroReal = "0.0000", euroDolar = "0.0000", cafeValue = "Indisponível";

  // 1. Busca das moedas - Vamos forçar o formato de resposta
  try {
    const res = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,EUR-USD', { timeout: 8000 });
    
    // Verificamos se o objeto existe antes de acessar
    if (res.data.USDBRL) dolar = parseFloat(res.data.USDBRL.bid).toFixed(4);
    if (res.data.EURBRL) euroReal = parseFloat(res.data.EURBRL.bid).toFixed(4);
    if (res.data.EURUSD) euroDolar = parseFloat(res.data.EURUSD.bid).toFixed(4);
    
  } catch (e) {
    console.error("Erro na API de moedas:", e);
  }

  // 2. Busca do café (que já sabemos que funciona)
  try {
    const { data } = await axios.get('https://www.noticiasagricolas.com.br/cotacoes/cafe', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(data);
    const el = $('table tbody tr').first().find('td').eq(1);
    if (el.length > 0) cafeValue = el.text().trim();
  } catch (e) {
    console.error("Erro no scraping do café:", e);
  }

  return NextResponse.json({
    dolar,
    euroReal,
    euroDolar,
    cafe: cafeValue,
    timestamp: new Date().toLocaleTimeString('pt-BR')
  });
}