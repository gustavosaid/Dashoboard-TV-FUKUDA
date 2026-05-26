import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    // 1. Busca das moedas
    const res = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,EUR-USD');
    const { USDBRL, EURBRL, EURUSD } = res.data;

    // 2. Busca do site do café (primeiro baixa os dados)
    const { data } = await axios.get('https://www.noticiasagricolas.com.br/cotacoes/cafe', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.google.com/'
      }
    });

    // 3. Agora sim, carregamos o cheerio com o 'data' baixado
    const $ = cheerio.load(data);

    // 4. E agora podemos extrair o valor
    const cafe = $('table tbody tr').first().find('td').eq(1).text().trim() || "Valor não encontrado";

    return NextResponse.json({
      dolar: parseFloat(USDBRL.bid).toFixed(4),
      euroReal: parseFloat(EURBRL.bid).toFixed(4),
      euroDolar: parseFloat(EURUSD.bid).toFixed(4),
      cafe: cafe,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (error) {
    console.error(error); // Isso ajuda a ver o erro no terminal
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}