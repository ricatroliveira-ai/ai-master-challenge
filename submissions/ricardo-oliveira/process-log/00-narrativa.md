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

---

## Onde a IA errou e como corrigi

_(preenchido ao longo do build)_

## O que eu adicionei que a IA sozinha não faria

_(preenchido ao longo do build)_
