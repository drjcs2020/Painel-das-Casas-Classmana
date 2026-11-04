# ClassMana — Placar online e convites persistentes (Google Sheets)

## O que já está preparado

- Planilha **privada** do torneio: https://docs.google.com/spreadsheets/d/18UoJDmBL_xS67tzSpoYZv9VrQarTB_bwXXI8WQtAc2Q/edit
- 78 alunos abreviados, Casas e equipes reais em `Alunos`.
- Abas `Desafios`, `Disparos`, `Sessoes` e `Eventos` para registrar histórico persistente.
- Serviço em `Code.gs`, interface segura de comunicação em `Bridge.html`.
- Cliente `online.js` com login por PIN, notificações de desafios, Aceitar/Recusar, reprodução dos cinco disparos do adversário, ranking de alunos, equipes e Casas.

## Para ativar (necessária uma única configuração pelo proprietário)

1. Abra a planilha acima na sua conta e use **Extensões → Apps Script**.
2. Cole **todo** o conteúdo de `online-server/Code.gs` no arquivo `Code.gs`.
3. Crie um **novo arquivo HTML** com o nome `Bridge` e cole `online-server/Bridge.html`.
4. No editor de Apps Script, execute manualmente **`cmPinSetup`** uma única vez e autorize o acesso à planilha. Os PINs exclusivos de 8 caracteres serão preenchidos em `Alunos`, coluna E. **Não publique a aba nem a compartilhe com estudantes.**
5. Clique em **Implantar → Nova implantação → Aplicativo da Web**; selecione **Executar como: eu** e **Quem tem acesso: qualquer pessoa**. A autenticação ocorre dentro do aplicativo por código e PIN, não por acesso ao Sheets.
6. Copie a URL terminada em `/exec` e coloque-a em `arena/backend-config.js`, no valor de `window.CM_ARENA_BACKEND_URL`. **Somente a URL pública do Apps Script entra no GitHub. Não coloque PINs, tokens, credenciais do Google nem a planilha pública lá.**
7. Publique o commit, abra o jogo com Ctrl+F5. Entre com um aluno, registre um desafio e teste outro aluno em janela anônima. Valide os registros da planilha.

## Regras de disputa

- **Individual:** aluno contra aluno, mesma turma ou outra turma, com convite dirigido ao aluno selecionado.
- **Equipes:** duelo representativo: o criador desafia uma equipe e o primeiro membro elegível que aceitar representa a equipe naquela partida. A pontuação é atribuída às respectivas equipes no ranking.
- **Interclasses:** duelo representativo: um aluno desafia outra turma; o primeiro membro que aceitar representa a turma. Pontos alimentam o ranking por Casa.
- Cada jogador lança 5 flechas. O primeiro salva os 5 impactos na planilha; o adversário pode aceitar e jogar dias depois. O simulador visual reproduz cada uma das 5 pontuações já salvas.
- Regras de vitória: pontuação maior vence, menor perde, pontuação igual empata.
- Uma partida oficial só é gravada após resposta do serviço. Se a gravação falhar, o resultado **não** é marcado como salvo e pode ser reenviado.

## Segurança e limites

- PINs **não são enviados por URL**. As requisições são feitas através da interface HTML hospedada pelo Apps Script usando `google.script.run`; o navegador de jogo troca mensagens apenas com a ponte incorporada.
- A planilha precisa continuar privada e com permissão somente do professor.
- Há bloqueio de PIN após tentativas repetidas, sessão expira em 7 dias, bloqueio de auto-desafio e apenas um aluno pode aceitar um convite destinado a uma equipe/turma.
- O backend recalcula a pontuação a partir das coordenadas dos cinco impactos, em vez de confiar em um campo `score` enviado pelo cliente; **não é antifraude à prova de manipulação**. Para competição de alto impacto é necessário cálculo e validação autoritativos de física, com auditoria adicional.
- O Apps Script tem limites de quotas, execução, largura de banda e simultaneidade; adequado a um torneio escolar pequeno, não a milhares de jogadores simultâneos.
- Não expor nomes completos, históricos individuais sensíveis ou PINs no repositório público.
- A URL do Apps Script permanece em branco até você executar as etapas de implantação. Sem isso, o jogo sinaliza **Configuração online pendente** e não finge que salvou resultados no servidor.