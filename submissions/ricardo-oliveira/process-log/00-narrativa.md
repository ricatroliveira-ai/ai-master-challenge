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

---

## Onde a IA errou e como corrigi

_(preenchido ao longo do build)_

## O que eu adicionei que a IA sozinha não faria

_(preenchido ao longo do build)_
