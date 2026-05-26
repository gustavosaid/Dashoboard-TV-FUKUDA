import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  let dolar = "...", euroReal = "...", euroDolar = "...", cafeValue = "Indisponível";

  // 1. Nova estratégia para moedas: Usar a API do HG Brasil (muito estável e gratuita)
  try {
    const res = await axios.get('https://api.hgbrasil.com/finance?format=json-cors', { timeout: 8000 });
    const currencies = res.data.results.currencies;
    
    dolar = currencies.USD.buy.toFixed(4);
    euroReal = currencies.EUR.buy.toFixed(4);
    // HG Brasil não dá EUR/USD direto, calculamos:
    euroDolar = (currencies.EUR.buy / currencies.USD.buy).toFixed(4);
  } catch (e) {
    console.error("Erro na API HG Brasil:", e);
  }

  // 2. Busca do café
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