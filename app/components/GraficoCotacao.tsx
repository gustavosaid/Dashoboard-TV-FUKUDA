import { AreaChart, Area, XAxis, ResponsiveContainer, LabelList } from 'recharts';

export default function GraficoCotacao({ dados, cor }: { dados: any[], cor: string }) {
    if (!dados || dados.length === 0) return <div>Sem dados</div>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dados} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={cor} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={cor} stopOpacity={0} />
                    </linearGradient>
                </defs>

                {/* O eixo X mostra as datas automaticamente */}
                <XAxis
                    dataKey="data"
                    stroke="#64748B"
                    fontSize={10} // Diminuímos um pouco para caber mais
                    tickMargin={10}
                    interval={0} // O segredo para mostrar TUDO
                    angle={-20}  // Inclina as datas em 45 graus
                    textAnchor="end" // Alinha o texto corretamente após a rotação
                    height={80} // Aumentamos a altura para dar espaço às datas inclinadas
                />

                <Area
                    type="monotone"
                    dataKey="preco"
                    stroke={cor}
                    fill="url(#colorPrice)"
                    strokeWidth={3}
                >
                    {/* Esta é a chave: LabelList configurado para mostrar data e valor */}
                    <LabelList
                        dataKey="preco"
                        position="top"
                        fontSize={12}
                        fill="#334155"
                        fontWeight="bold"
                        formatter={(value: any) => {
                            // 1. Verificação de segurança: Se não houver valor, retorna vazio
                            if (value === undefined || value === null) return "";

                            // 2. Garante que o valor seja convertido para número
                            const num = typeof value === 'number' ? value : parseFloat(value);

                            // 3. Formata com 2 casas decimais e o símbolo de dólar
                            return `$${num.toFixed(2)}`;
                        }}
                    />
                </Area>
            </AreaChart>
        </ResponsiveContainer>
    );
}