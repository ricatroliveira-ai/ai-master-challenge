# Process log: narrativa

Diário de como eu e a IA chegamos na solução. Atualizado a cada etapa, junto com os commits.

**Ferramenta principal:** Claude Code (Opus), rodando dentro do meu sistema operacional pessoal (um vault Obsidian com meu contexto, regras e histórico de trabalho).

---

## Etapa 0: entender o problema antes de abrir qualquer ferramenta (23/10)

- Escolhi o 003, Lead Scorer, porque é o que eu faço há anos: liderar time comercial e decidir onde o vendedor gasta a semana.
- Pedi pro Claude ler o README do challenge, o CONTRIBUTING, o guia de submissão e o template direto do repositório, em vez de colar o brief num chat.
- O que tirei da leitura: o pedido real da Head de RevOps não é "prever quem fecha". É "o vendedor abre na segunda e sabe onde focar". Probabilidade de ganho é só um pedaço disso.
- Ângulo definido: **prioridade não é probabilidade**. Prioridade = chance de ganhar x valor em jogo x urgência (o deal está esfriando em relação ao ciclo normal de quem ganha?). Cada deal sai com o motivo em português claro e uma próxima ação.
- Regra que eu impus: nenhuma variável entra no score sem provar, nos deals já fechados, que mexe na taxa de ganho. E o score passa por um backtest num período posterior antes de ir pra tela.

## Etapa 1: setup

- Fork, clone e branch `submission/ricardo-oliveira` feitos pelo Claude Code com a credencial git que já estava configurada na minha máquina.
- Pegadinha: o `.gitignore` do próprio repo ignora `submissions/`, e a regra do PR proíbe mexer em qualquer arquivo fora da minha pasta. Editar o `.gitignore` quebraria a regra. Solução: `git add -f` só na minha pasta.

## Etapa 2: método e primeira pergunta pros dados (23/10)

- Antes de qualquer código, defini o método e pedi pro Claude organizar num SOP: primeiro o ICP (quem compra, recompra e fica, por região se mudar), depois o MEDDPICC deal a deal, e só então a prioridade.
- O Claude leu os CSVs e trouxe o que muda o plano: 68% dos deals abertos (1.425 de 2.089) não têm conta, região é o escritório do vendedor e não do cliente, e o CRM não tem nenhum campo de MEDDPICC além de aproximações.
- Minha primeira pergunta no pipeline: quantas contas únicas, quantas ganhamos, quantas perdemos. Resposta: 85 contas, e as 85 têm deal ganho e deal perdido. Nenhuma conta só ganha ou só perde. Taxa de ganho por conta vai de 53% a 75% (mediana 63%, geral 63,2%).
- Leitura: contar contas não separa nada. O ICP vai ter que sair da taxa de ganho, do ticket e da recompra por conta, não de "comprou ou não comprou".
- Minha hipótese seguinte: o jogo é upsell e cross-sell na mesma conta. Pedi pro Claude testar antes de assumir. Resultado: não é bem isso. Toda conta já comprou 6 ou 7 dos 7 produtos, e 88% dos ganhos (3.716 de 4.238) são recompra de um produto que a conta já tinha. É um motion de recompra em alto volume (mediana de 83 deals por conta em 14 meses), não de expansão. Ressalva: os fechamentos só começam em mar/2017, então a primeira compra de cada conta pode ser anterior à janela.
- Achado de RevOps que eu não esperava: mediana de 14 vendedores diferentes trabalhando a mesma conta. Não existe dono de conta.
- Subi o pipeline numa Google Sheet pra olhar com meus próprios olhos e criei a coluna `sales_cycle_days` (close_date menos engage_date). Pedi pro Claude abrir uma aba por estágio (Won 4.238, Lost 2.473, Engaging 1.589, Prospecting 500) com FILTER sobre a aba original, pra ver o funil etapa por etapa sem duplicar dado. Ele conferiu as contagens contra o CSV e apontou que minha coluna de ciclo quebra nos deals abertos (sem close_date a conta fica negativa e aparece como data de 1782).
- Mantive `sales_cycle_days` só pra Won e Lost (em branco nos abertos).
- Foquei nos ganhos e pedi duas tabelas na planilha, uma por conta e uma por vendedor, todas em fórmula sobre a aba Won (dá pra clicar e ver de onde vem cada número). O Claude rodou a mesma análise em código antes e conferiu a planilha contra ela. O que saiu:
  - De 8 a 29 vendedores ganharam deal na mesma conta (mediana 10). Dentro da conta, o mesmo produto é vendido por mais de um vendedor em 502 de 522 combinações conta e produto. Não há dono de conta nem especialização por produto.
  - LTV por conta de 51,6 mil a 341 mil (mediana 111,5 mil). Três contas puxam o topo (Kan-code, Konex, Condax), o resto é uma curva suave. As 21 maiores somam 37% do LTV: não é 80/20. Tiers por quartil (A a partir de 140 mil, B 111,5 mil, C 85 mil, D abaixo), com os cortes em células que eu posso mudar.
  - O vendedor que mais fecha deals na conta é o mesmo que mais fatura nela em 47 de 85 contas. No geral, volume e valor são habilidades diferentes, como eu suspeitava: Anna Snelling é 4ª em deals e 18ª em receita (ticket médio 1.322), Versie Hillebrand é 5ª e 27ª; Elease Gluck é 26ª em deals e 16ª em receita (ticket 3.615).
  - Ciclo médio por produto quase não muda: de 48 a 55 dias, só o GTK 500 vai a 64 (15 deals). Na matriz vendedor x produto, várias células têm 1 a 3 deals, então a média ali é ruído até ter amostra mínima.
- Troquei a planilha pra dólar (o dataset é em USD) e pedi os 3 produtos mais vendidos por conta, pra ver se conta Tier A compra um tipo de produto diferente. Resultado: o mix é quase o mesmo em todos os tiers. Tier A compra menos MG Special (16% dos deals contra 24% no Tier D) e concentra 9 dos 15 ganhos de GTK 500.
- Levantei duas hipóteses de operação comercial: (1) os 3 vendedores que vendem GTK 500 virarem especialistas só nesse produto; (2) os outros virarem AEs com conta própria, pra acabar com até 29 vendedores na mesma conta. Antes de afirmar, pedi a mesma leitura pros perdidos. O que os dados disseram:
  - GTK 500 é o produto mais caro (26.768 dólares), não de entrada. São 40 deals no pipeline inteiro, 12 contas compraram, e os 3 vendedores já cuidam de 37 dos 40. A especialização já existe na prática. Com 15 ganhos em 14 meses (400 mil dólares), um vendedor só de GTK 500 faturaria abaixo da média do time.
  - Ter mais vendedores na conta não derruba a taxa de ganho: correlação de -0,01 entre número de vendedores e win rate da conta. Vendedor com 10+ deals fechados na mesma conta ganha 62,5%; com 1 a 4, 66,3%. O argumento pro modelo de AE por conta existe (coordenação, plano de conta, expansão pra série mais cara), mas não é conversão.
  - Darcel Schlecht é o 1º em deals e em receita, mas tem win rate de 63,1%, igual à média. A vantagem dele é volume, não conversão. Win rate por vendedor vai de 55,0% a 70,4%; por produto, de 60% a 65%. Perdas acontecem mais rápido que ganhos (41,5 dias contra 51,8).
- Pedi o ciclo médio por produto dentro de cada conta e um alerta de qual produto está chegando na "renovação". Não existe campo de contrato, então definimos a renovação como recompra: última compra ganha + intervalo médio entre compras daquele produto naquela conta. Resultado em 31/12/2017 (última data do dataset): 180 pares conta e produto atrasados, 203 vencendo em até 30 dias, 126 ainda não, 13 com uma compra só. Intervalo típico de recompra: 34 dias (mediana por par), mas irregular (coeficiente de variação 0,81), então a data prevista é uma estimativa, não um compromisso. 366 dos 522 pares já têm deal aberto com conta.
- Achado lateral: os ganhos sobem no último mês de cada trimestre (mar 531, jun 531, set 503, dez 511, contra 280 a 450 nos outros meses). Fechamento de trimestre é o evento de urgência mais claro que o dataset tem.
- Minha proposta de operação: os 3 vendedores que já venderam GTK 500 cuidam das 12 contas que compraram GTK 500, e o resto do time passa a ter carteira fixa de contas. O argumento não é que isso melhora conversão (os dados não mostram isso), é que também não piora, e organiza cadência e responsabilidade. Pedi pro Claude testar a parte do GTK antes de fechar. O que voltou:
  - Os 3 (Elease, Markita, Rosalina) são todos do mesmo manager, Celia Rouche, região West. Vender GTK 500 é prática de um time, não de 3 pessoas soltas.
  - As 12 contas são 18% do LTV e geraram 1.086 deals no período. Os 3 vendedores, somados, tocaram 643 deals no total. Não dá conta só com 3. Dá com o time inteiro da Celia (6 vendedores, uns 180 deals cada).
  - Nessas 12 contas, os 3 ganham 64,9% e os outros 64,1%. Mesma conversão, o que reforça o argumento de organização, não de performance.
- LTV tier x produto: o mix é quase igual em todos os tiers. O que separa tier é frequência e porte: correlação de 0,86 entre LTV e número de deals, 0,76 com a receita da empresa, 0,68 com funcionários, e só 0,35 com ticket médio. A única relação de produto é fraca e negativa: quanto mais o mix da conta é MG Special, menor o LTV (-0,38). Isso vai direto pro ICP: porte da empresa é o melhor sinal de conta boa.
- Hipótese minha: os deals sem conta são conta nova (new logo), então cada vendedor vive dois mundos, recompra em conta antiga e abertura de conta nova, e a prioridade é recompra primeiro porque quem já confia na gente fecha mais fácil. Pedi pra testar. Os dados não sustentam nenhuma das duas partes:
  - Todo deal fechado (6.711) é de uma das 85 contas que já compram. Em 14 meses nenhuma conta nova fechou. Os 1.425 sem conta estão todos abertos e têm o mesmo mix de produto dos abertos com conta. A leitura mais segura é furo de cadastro (a conta é preenchida no fechamento), não new logo.
  - Relação anterior não aumenta conversão: deal de produto que a conta já comprava ganha 61,5%, produto novo pra conta 67,9%. Parte disso é efeito da janela (972 deals fechados começaram antes de mar/2017, quando a gente ainda não enxerga compras anteriores), então o certo é dizer que os dados não mostram vantagem, nem pra um lado nem pro outro.
  - Ajustei a regra: deal sem conta não é "conta nova", é "identificar a conta". Depois de identificada, vai pro dono da conta. Se não for nenhuma das 85, aí sim vira new logo.
- Regra acordada: topo da lista é produto atrasado ou vencendo em até 30 dias com deal aberto pro mesmo produto na mesma conta. 280 pares, 518 dos 664 deals abertos com conta. Virou a coluna Priority ("Focus now") na planilha e entrou no SOP.

---

## Onde a IA errou e como corrigi

- A fórmula de top 3 produtos voltava a linha de cabeçalho da QUERY no lugar do produto nº 1. O Claude achou o erro só quando montou a versão dos perdidos e corrigiu nas duas abas.

## O que eu adicionei que a IA sozinha não faria

- A leitura de operação comercial: carteira fixa por vendedor justificada por organização e cadência, assumindo abertamente que os dados não mostram ganho de conversão.
