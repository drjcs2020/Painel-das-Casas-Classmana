# Metodologia de pontuação ClassMana — 1.0

**Congelada como referência em 18 de outubro de 2026.** Esta é a metodologia acordada para manter **comparabilidade nas atualizações posteriores**. Não é uma reconstrução comprovada da normalização do protótipo de setembro.

## 1. Janela de dados

Toda atualização utiliza **dados acumulados desde o início do projeto até a data de corte**. Nunca substitua o acumulado por dados apenas dos últimos 10–15 dias. O objetivo é não perder eventos em semanas sem exportação. Anote a data de corte em cada versão. As observações de outubro são de 16–17/10/2026, conforme os respectivos relatórios.

## 2. Índice final

Cada eixo varia de 0 a 10. As ponderações, sempre fixas, são:

| Eixo | Chave no sistema | Peso |
|---|---|---:|
| Convivência e Responsabilidade | `conv` | **40%** |
| Tecnologia e Aprendizagem Digital | `tech` | **25%** |
| Aprendizagem e Comprometimento | `learn` | **15%** |
| Desafios e Competições | `comp` | **10%** |
| Missões e Projetos | `mission` | **10%** |

**Índice = 0,40 × conv + 0,25 × tech + 0,15 × learn + 0,10 × comp + 0,10 × mission.**

O índice não é XP, nem média simples de XP, nível, HP, Mana e Ouro. Esses recursos permanecem exibidos separadamente.

## 3. Normalização do eixo Convivência

`P` = quantidade acumulada de reconhecimentos positivos classificados como convivência.  
`N` = soma ponderada de advertências classificadas, com diferenças de gravidade.

**`conv = 10 × P / (P + 0,5 × N)`** (intervalo de 0 a 10).

Em outubro foi utilizada a base classificada: 4º A: P=99, N=141; 4º B: P=93, N=133; 4º C: P=84, N=156,5. O fator **0,5** permanece fixo. As descrições das advertências podem exigir revisão pedagógica; preservar em cada atualização a classificação adotada (ocorrências leves, recorrentes, graves), registrar alterações e não computar o estado “caído” como uma advertência extra.

> **Atenção:** não se dispõe, nos documentos enviados, de uma tabela de gravidade por ocorrência individual que permita reconstruir precisamente as somas históricas ponderadas. Portanto, a base classificada de outubro é o ponto de partida acordado; para tornar os próximos recálculos integralmente auditáveis, guardar daqui em diante um livro de registros classificados ou exportação por evento, com categoria, quantidade, gravidade, data e indicação de ação coletiva. Não inventar eventos ou pesos retroativos.

## 4. Normalização dos outros quatro eixos

Para cada eixo `E`, calcular `taxa = ocorrências_acumuladas_classificadas / número_de_alunos`.

**`nota_E = min(10, 5 + 5 × taxa / referência_fixa_E)`**.

Referências fixas definidas pela base de outubro (não recalcular o máximo a cada atualização):

| Eixo | Referência **fixa**, ocorrências por aluno | Base de origem |
|---|---:|---|
| Tecnologia | **74/24 = 3,0833333333...** | 4º A |
| Aprendizagem | **22/24 = 0,9166666667...** | 4º A |
| Desafios | **117/26 = 4,5** | 4º C |
| Missões | **157/26 = 6,0384615385...** | 4º C |

**Guardar as frações exatas no cálculo**, não apenas os valores decimais arredondados. A escala pode alcançar 10 e permanecer saturada caso o acumulado supere a referência. A escolha desse teto relativo foi aprovada como base de continuidade, mas não permite interpretar 10 como domínio absoluto do currículo.

As contagens classificadas de referência foram:

| Turma | Alunos | Conv P | Conv N | Tecnologia | Aprendizagem | Desafios | Missões concluídas |
|---|---:|---:|---:|---:|---:|---:|---:|
| 4º A | 24 | 99 | 141 | 74 | 22 | 61 | 128 |
| 4º B | 28 | 93 | 133 | 43 | 11 | 66 | 116 |
| 4º C | 26 | 84 | 156,5 | 30 | 6 | 117 | 157 |

Esses registros foram identificados em relatórios acumulados e são **contagens classificadas usadas na simulação de outubro**; não equivalem necessariamente a todas as oportunidades oferecidas em cada eixo. Para maior precisão futura, incluir códigos de evento e registros completos, e evitar contar um mesmo evento em dois eixos sem justificativa.

## 5. Notas-base e índices adotados em outubro

| Eixo | 4º A | 4º B | 4º C |
|---|---:|---:|---:|
| Convivência | 5,84 | 5,83 | 5,18 |
| Tecnologia | 10,00 | 7,49 | 6,87 |
| Aprendizagem | 10,00 | 7,14 | 6,26 |
| Desafios | 7,82 | 7,62 | 10,00 |
| Missões | 9,42 | 8,43 | 10,00 |
| **Índice ponderado** | **8,06** | **6,88** | **6,73** |

Notas e índice são calculados em precisão cheia e **arredondados a duas casas na exibição**. Para a composição usar as notas não arredondadas dos eixos.

## 6. Rankings de equipes, alunos e Casas

- **Alunos:** XP individual acumulado atual, ordem decrescente.
- **Equipes:** XP total atual dos integrantes / quantidade de integrantes da equipe; evita premiar equipes maiores.
- **Casas:** índice ponderado dos cinco eixos, não XP total. Outros saldos e XP médio são indicadores complementares.
- **Mudanças de matrícula:** conferir se os valores pertencem à mesma data de corte e registrar inclusão/saída de aluno.

## 7. Regras de integridade

1. Dados **sempre acumulados**; na próxima atualização, substituir os saldos atuais pelos novos saldos atuais e substituir contagens históricas pelas novas contagens históricas. **Não somar o novo acumulado ao acumulado antigo.**
2. Solicitações de aprovação pendentes não são missões concluídas nem compras aprovadas.
3. `Objetivos de missão concluídos` e `missões concluídas` não devem ser somados entre si: representam métricas relacionadas.
4. A lista de missões atuais pode se sobrepor ao contador histórico; não somar ambos.
5. Rascunhos e missões sem objetivos não contam como oportunidade ativa realizada.
6. Separar advertências coletivas e individuais quando identificadas; gravidade não deve ser igual para todo tipo de ocorrência.
7. Considerar recuperação sem duplicar penalizações.
8. Para dados pedagógicos sensíveis de crianças, usar controle de acesso restrito; relatórios individuais de advertências devem permanecer em área docente.

## 8. Atualização futura e rastreabilidade

Registrar em cada revisão: data de corte, fonte dos relatórios, total de alunos por Casa, cinco contagens por eixo, pesos de advertência utilizados, cinco notas geradas, índice ponderado, versões dos dados e responsáveis pela conferência.

A base legível por programas fica em `data/baseline-indice-2026-10.json`. A tela usa `js/game-data.js`: atualizar as cinco notas da propriedade `axes` e os 78 registros em `STUDENTS`, mantendo os recursos de XP, nível, Mana, HP e Ouro consistentes com os relatórios mais novos. Conferir as fórmulas antes de publicar.

**Nota de transparência:** o código anterior do V15 continha notas fixas de setembro, não uma rotina histórica documentada de categorização e ponderação dos registros. Esta metodologia v1.0 foi definida para estabilidade da nova série histórica a partir de outubro.
