import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  // Dados iniciais padrão (caso tudo falhe, mostramos algo)
  let dolar = "0.0000";
  let euroReal = "0.0000";
  let euroDolar = "0.0000";
  let cafeValue = "Indisponível";

  // 1. Tenta buscar moedas (API externa)
  try {
    const res = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,EUR-USD', { timeout: 5000 });
    dolar = parseFloat(res.data.USDBRL.bid).toFixed(4);
    euroReal = parseFloat(res.data.EURBRL.bid).toFixed(4);
    euroDolar = parseFloat(res.data.EURUSD.bid).toFixed(4);
  } catch (e) {
    console.error("Erro ao buscar moedas:", e);
  }

  // 2. Tenta buscar café (Scraping)
  try {
    const { data } = await axios.get('https://www.noticiasagricolas.com.br/cotacoes/cafe', {
      timeout: 8000,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    });
    
    const $ = cheerio.load(data);
    const el = $('table tbody tr').first().find('td').eq(1);
    if (el.length > 0) {
      cafeValue = el.text().trim();
    }
  } catch (e) {
    console.error("Erro no scraping do café:", e);
  }

  // Retorno sempre 200 OK para o front-end, evitando o Erro 500
  return NextResponse.json({
    dolar,
    euroReal,
    euroDolar,
    cafe: cafeValue,
    timestamp: new Date().toLocaleTimeString('pt-BR')
  }, { status: 200 });
}