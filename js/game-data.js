// Dados ACUMULADOS de outubro de 2026 (não substituir por exportações antigas).
const H = {
  "A": {
    "turma": "4º A",
    "casa": "Águia Dourada",
    "score": 8.06,
    "students": 24,
    "totalXp": 300616,
    "hp": 10.0,
    "level": 13.04,
    "mana": 5.0,
    "gold": 1177,
    "xp": 12526,
    "axes": {
      "conv": 5.84,
      "tech": 10.0,
      "learn": 10.0,
      "comp": 7.82,
      "mission": 9.42
    }
  },
  "B": {
    "turma": "4º B",
    "casa": "Leão de Fogo",
    "score": 6.88,
    "students": 28,
    "totalXp": 382928,
    "hp": 7.07,
    "level": 14.14,
    "mana": 1.0,
    "gold": 1045,
    "xp": 13676,
    "axes": {
      "conv": 5.83,
      "tech": 7.49,
      "learn": 7.14,
      "comp": 7.62,
      "mission": 8.43
    }
  },
  "C": {
    "turma": "4º C",
    "casa": "Dragão de Esmeralda",
    "score": 6.73,
    "students": 26,
    "totalXp": 385504,
    "hp": 10.0,
    "level": 15.35,
    "mana": 3.96,
    "gold": 2061,
    "xp": 14827,
    "axes": {
      "conv": 5.18,
      "tech": 6.87,
      "learn": 6.26,
      "comp": 10.0,
      "mission": 10.0
    }
  }
};
const teamNames = ["Fadas Guerreiras", "Chama Congelante", "Lobos e Gatunos", "Cavaleiros e Guerreiros", "Mágicos e Engenheiros", "Dragões de Combate"];
const STUDENTS = [
  {
    "house": "A",
    "name": "ALICE CAROLINE M. DOS SANTOS",
    "team": "Mágicos e Engenheiros",
    "level": 14,
    "xp": 13572,
    "mana": 5,
    "hp": 10,
    "gold": 1570
  },
  {
    "house": "A",
    "name": "ALINE FERREIRA",
    "team": "Dragões de Combate",
    "level": 13,
    "xp": 12257,
    "mana": 5,
    "hp": 10,
    "gold": 613
  },
  {
    "house": "A",
    "name": "ANA JULIA PIMENTEL GOMES",
    "team": "Fadas Guerreiras",
    "level": 14,
    "xp": 13227,
    "mana": 5,
    "hp": 10,
    "gold": 1504
  },
  {
    "house": "A",
    "name": "ARTHUR OLIVEIRA RICARDO",
    "team": "Cavaleiros e Guerreiros",
    "level": 10,
    "xp": 9862,
    "mana": 5,
    "hp": 10,
    "gold": 310
  },
  {
    "house": "A",
    "name": "ARTHUR SIMER DE SOUZA",
    "team": "Lobos e Gatunos",
    "level": 14,
    "xp": 13442,
    "mana": 5,
    "hp": 10,
    "gold": 971
  },
  {
    "house": "A",
    "name": "CALEB MALGAREZE CARNEIRO",
    "team": "Dragões de Combate",
    "level": 15,
    "xp": 14437,
    "mana": 5,
    "hp": 10,
    "gold": 1725
  },
  {
    "house": "A",
    "name": "DAVI OLIVEIRA CARNEIRO",
    "team": "Chama Congelante",
    "level": 14,
    "xp": 13742,
    "mana": 5,
    "hp": 10,
    "gold": 1685
  },
  {
    "house": "A",
    "name": "DEBORA YASMIN MARTINS LEAL",
    "team": "Fadas Guerreiras",
    "level": 15,
    "xp": 14607,
    "mana": 5,
    "hp": 10,
    "gold": 2169
  },
  {
    "house": "A",
    "name": "ELOA CRISTINA DE LIMA BARRETO",
    "team": "Dragões de Combate",
    "level": 14,
    "xp": 13537,
    "mana": 5,
    "hp": 10,
    "gold": 535
  },
  {
    "house": "A",
    "name": "EMANUEL MACHADO",
    "team": "Mágicos e Engenheiros",
    "level": 10,
    "xp": 9417,
    "mana": 5,
    "hp": 10,
    "gold": 962
  },
  {
    "house": "A",
    "name": "EMANUEL MARCONDES GALVÃO",
    "team": "Mágicos e Engenheiros",
    "level": 14,
    "xp": 13267,
    "mana": 5,
    "hp": 10,
    "gold": 1587
  },
  {
    "house": "A",
    "name": "GUSTAVO WOELLNER PORTELLA",
    "team": "Lobos e Gatunos",
    "level": 15,
    "xp": 14462,
    "mana": 5,
    "hp": 10,
    "gold": 2220
  },
  {
    "house": "A",
    "name": "HENRIQUE",
    "team": "Chama Congelante",
    "level": 9,
    "xp": 8382,
    "mana": 5,
    "hp": 10,
    "gold": 680
  },
  {
    "house": "A",
    "name": "ISABELA PRADO",
    "team": "Dragões de Combate",
    "level": 17,
    "xp": 16532,
    "mana": 5,
    "hp": 10,
    "gold": 893
  },
  {
    "house": "A",
    "name": "JAN IKARO SILVA",
    "team": "Cavaleiros e Guerreiros",
    "level": 13,
    "xp": 12777,
    "mana": 5,
    "hp": 10,
    "gold": 834
  },
  {
    "house": "A",
    "name": "JONAS LEAL",
    "team": "Chama Congelante",
    "level": 13,
    "xp": 12407,
    "mana": 5,
    "hp": 10,
    "gold": 1271
  },
  {
    "house": "A",
    "name": "KAUA HENRIQUE CASTANHO SILVA",
    "team": "Cavaleiros e Guerreiros",
    "level": 14,
    "xp": 13312,
    "mana": 5,
    "hp": 10,
    "gold": 724
  },
  {
    "house": "A",
    "name": "KENIDY RYAN OLIVEIRA DOS SANTOS",
    "team": "Chama Congelante",
    "level": 14,
    "xp": 13282,
    "mana": 5,
    "hp": 10,
    "gold": 1409
  },
  {
    "house": "A",
    "name": "LUIS AUGUSTO DE PAULA ALMEIDA",
    "team": "Lobos e Gatunos",
    "level": 14,
    "xp": 13567,
    "mana": 5,
    "hp": 10,
    "gold": 2056
  },
  {
    "house": "A",
    "name": "MAYARA MARTINS",
    "team": "Mágicos e Engenheiros",
    "level": 12,
    "xp": 11467,
    "mana": 5,
    "hp": 10,
    "gold": 710
  },
  {
    "house": "A",
    "name": "OTAVIO CEZAR LEAL BRANDT",
    "team": "Cavaleiros e Guerreiros",
    "level": 13,
    "xp": 12762,
    "mana": 5,
    "hp": 10,
    "gold": 837
  },
  {
    "house": "A",
    "name": "SOPHIA LOPES",
    "team": "Fadas Guerreiras",
    "level": 14,
    "xp": 13527,
    "mana": 5,
    "hp": 10,
    "gold": 1268
  },
  {
    "house": "A",
    "name": "VALDINEI IZAEL TYMKIW",
    "team": "Lobos e Gatunos",
    "level": 14,
    "xp": 13322,
    "mana": 5,
    "hp": 10,
    "gold": 1062
  },
  {
    "house": "A",
    "name": "VALENTINE TOBIAS",
    "team": "Fadas Guerreiras",
    "level": 4,
    "xp": 3450,
    "mana": 5,
    "hp": 10,
    "gold": 660
  },
  {
    "house": "B",
    "name": "ADRYAN MURILO ALMEIDA LUCIDORIO",
    "team": "Dragões de Combate",
    "level": 14,
    "xp": 13190,
    "mana": 1,
    "hp": 7,
    "gold": 1725
  },
  {
    "house": "B",
    "name": "AGATHA BEATRIZ LEAL SALES",
    "team": "Mágicos e Engenheiros",
    "level": 14,
    "xp": 13419,
    "mana": 1,
    "hp": 7,
    "gold": 81
  },
  {
    "house": "B",
    "name": "ANA ALICE MARCONDES PRADO DA SILVA",
    "team": "Fadas Guerreiras",
    "level": 13,
    "xp": 12751,
    "mana": 1,
    "hp": 7,
    "gold": 1116
  },
  {
    "house": "B",
    "name": "ANA NATHALIA DA CRUZ CARDOSO",
    "team": "Chama Congelante",
    "level": 14,
    "xp": 13574,
    "mana": 3,
    "hp": 9,
    "gold": 514
  },
  {
    "house": "B",
    "name": "BERNARDO MACHADO HENNIPMANN",
    "team": "Lobos e Gatunos",
    "level": 15,
    "xp": 14334,
    "mana": 1,
    "hp": 7,
    "gold": 1782
  },
  {
    "house": "B",
    "name": "DÁFINI GABRIELLY DE MORAIS CORDEIRO",
    "team": "Mágicos e Engenheiros",
    "level": 14,
    "xp": 13789,
    "mana": 1,
    "hp": 7,
    "gold": 1457
  },
  {
    "house": "B",
    "name": "DAVI LUCAS SOUZA",
    "team": "Lobos e Gatunos",
    "level": 13,
    "xp": 12324,
    "mana": 1,
    "hp": 7,
    "gold": 214
  },
  {
    "house": "B",
    "name": "DAVIH EMANUEL MATSEN CAMARGO",
    "team": "Dragões de Combate",
    "level": 12,
    "xp": 11625,
    "mana": 2,
    "hp": 8,
    "gold": 485
  },
  {
    "house": "B",
    "name": "EMANUEL DE PAULA ANDRADE",
    "team": "Lobos e Gatunos",
    "level": 15,
    "xp": 14344,
    "mana": 1,
    "hp": 7,
    "gold": 1841
  },
  {
    "house": "B",
    "name": "HELOISA VITORIA CORREA DA SILVA",
    "team": "Fadas Guerreiras",
    "level": 15,
    "xp": 14791,
    "mana": 1,
    "hp": 7,
    "gold": 902
  },
  {
    "house": "B",
    "name": "ISABELLY DOS SANTOS MOREIRA",
    "team": "Fadas Guerreiras",
    "level": 18,
    "xp": 17451,
    "mana": 1,
    "hp": 7,
    "gold": 1075
  },
  {
    "house": "B",
    "name": "JOAO MIGUEL ANJOS DE DEUS",
    "team": "Cavaleiros e Guerreiros",
    "level": 13,
    "xp": 12750,
    "mana": 0,
    "hp": 6,
    "gold": 281
  },
  {
    "house": "B",
    "name": "JOAO VICTOR DA ROSA CAMARGO",
    "team": "Dragões de Combate",
    "level": 13,
    "xp": 12785,
    "mana": 1,
    "hp": 7,
    "gold": 1246
  },
  {
    "house": "B",
    "name": "KAUA R. GOMES",
    "team": "Cavaleiros e Guerreiros",
    "level": 15,
    "xp": 14650,
    "mana": 2,
    "hp": 8,
    "gold": 1497
  },
  {
    "house": "B",
    "name": "LAÍS",
    "team": "Mágicos e Engenheiros",
    "level": 11,
    "xp": 10747,
    "mana": 1,
    "hp": 7,
    "gold": 1254
  },
  {
    "house": "B",
    "name": "LEANDRO",
    "team": "Lobos e Gatunos",
    "level": 10,
    "xp": 9132,
    "mana": 1,
    "hp": 7,
    "gold": 299
  },
  {
    "house": "B",
    "name": "LIVIA DE LARA DOS SANTOS",
    "team": "Chama Congelante",
    "level": 16,
    "xp": 15944,
    "mana": 1,
    "hp": 7,
    "gold": 1333
  },
  {
    "house": "B",
    "name": "MANUELE CHEM",
    "team": "Fadas Guerreiras",
    "level": 18,
    "xp": 17271,
    "mana": 1,
    "hp": 7,
    "gold": 1303
  },
  {
    "house": "B",
    "name": "MARIA VITORIA",
    "team": "Mágicos e Engenheiros",
    "level": 14,
    "xp": 13007,
    "mana": 1,
    "hp": 7,
    "gold": 0
  },
  {
    "house": "B",
    "name": "MAYSA OLIVEIRA DE ANHAIA",
    "team": "Chama Congelante",
    "level": 15,
    "xp": 14604,
    "mana": 1,
    "hp": 7,
    "gold": 677
  },
  {
    "house": "B",
    "name": "MIGUEL DE MÉLO",
    "team": "Chama Congelante",
    "level": 18,
    "xp": 17594,
    "mana": 2,
    "hp": 8,
    "gold": 2902
  },
  {
    "house": "B",
    "name": "MIGUEL HENRIQUE SAMPAIO BEGES",
    "team": "Mágicos e Engenheiros",
    "level": 15,
    "xp": 14309,
    "mana": 1,
    "hp": 7,
    "gold": 0
  },
  {
    "house": "B",
    "name": "NATHALIA DE LIMA",
    "team": "Lobos e Gatunos",
    "level": 12,
    "xp": 11822,
    "mana": 1,
    "hp": 7,
    "gold": 1099
  },
  {
    "house": "B",
    "name": "RAFAEL TABOR",
    "team": "Dragões de Combate",
    "level": 13,
    "xp": 12703,
    "mana": 0,
    "hp": 6,
    "gold": 876
  },
  {
    "house": "B",
    "name": "SAMEL JUNIOR RODRIGUES DOS SANTOS",
    "team": "Cavaleiros e Guerreiros",
    "level": 13,
    "xp": 12148,
    "mana": 0,
    "hp": 7,
    "gold": 990
  },
  {
    "house": "B",
    "name": "SOFIA DE CASTRO GOMES",
    "team": "Fadas Guerreiras",
    "level": 11,
    "xp": 10806,
    "mana": 1,
    "hp": 7,
    "gold": 308
  },
  {
    "house": "B",
    "name": "VINICIUS GABRIEL BOHMANN SOARES",
    "team": "Cavaleiros e Guerreiros",
    "level": 10,
    "xp": 9890,
    "mana": 0,
    "hp": 6,
    "gold": 544
  },
  {
    "house": "B",
    "name": "YAGO DOMINIQUE FLORINDO LOPES",
    "team": "Chama Congelante",
    "level": 22,
    "xp": 21174,
    "mana": 0,
    "hp": 7,
    "gold": 3448
  },
  {
    "house": "C",
    "name": "ADENIR MIGUEL FERREIRA DA SILVA",
    "team": "Chama Congelante",
    "level": 21,
    "xp": 20405,
    "mana": 5,
    "hp": 10,
    "gold": 3261
  },
  {
    "house": "C",
    "name": "AGATHA APARECIDA CAMARGO",
    "team": "Cavaleiros e Guerreiros",
    "level": 17,
    "xp": 16578,
    "mana": 2,
    "hp": 10,
    "gold": 2065
  },
  {
    "house": "C",
    "name": "ALICE FERNANDA DA SILVA DE OLIVEIRA",
    "team": "Mágicos e Engenheiros",
    "level": 16,
    "xp": 15881,
    "mana": 5,
    "hp": 10,
    "gold": 1532
  },
  {
    "house": "C",
    "name": "ANA MARIA",
    "team": "Lobos e Gatunos",
    "level": 17,
    "xp": 16488,
    "mana": 5,
    "hp": 10,
    "gold": 2153
  },
  {
    "house": "C",
    "name": "ANDREW GUSTAVO FELIX DE FREITAS",
    "team": "Cavaleiros e Guerreiros",
    "level": 17,
    "xp": 16331,
    "mana": 5,
    "hp": 10,
    "gold": 2361
  },
  {
    "house": "C",
    "name": "ANGELA TAYLINE RODRIGUES DA CRUZ",
    "team": "Fadas Guerreiras",
    "level": 18,
    "xp": 17788,
    "mana": 2,
    "hp": 10,
    "gold": 2467
  },
  {
    "house": "C",
    "name": "ARTHUR CALEB SANTOS LIMA",
    "team": "Lobos e Gatunos",
    "level": 16,
    "xp": 15223,
    "mana": 5,
    "hp": 10,
    "gold": 2505
  },
  {
    "house": "C",
    "name": "BRAIAN DA SILVA DE OLIVEIRA",
    "team": "Mágicos e Engenheiros",
    "level": 18,
    "xp": 17936,
    "mana": 3,
    "hp": 10,
    "gold": 3009
  },
  {
    "house": "C",
    "name": "DAVI NICOLAS MATOS ALVES",
    "team": "Dragões de Combate",
    "level": 14,
    "xp": 13313,
    "mana": 3,
    "hp": 10,
    "gold": 1154
  },
  {
    "house": "C",
    "name": "DERICK AUGUSTO DOMINGUES BUENO",
    "team": "Chama Congelante",
    "level": 10,
    "xp": 9763,
    "mana": 5,
    "hp": 10,
    "gold": 1197
  },
  {
    "house": "C",
    "name": "EMILY DOS SANTOS BUENO",
    "team": "Chama Congelante",
    "level": 15,
    "xp": 14413,
    "mana": 2,
    "hp": 10,
    "gold": 1880
  },
  {
    "house": "C",
    "name": "ESTER SOUSA ALVES",
    "team": "Lobos e Gatunos",
    "level": 18,
    "xp": 17320,
    "mana": 4,
    "hp": 10,
    "gold": 2167
  },
  {
    "house": "C",
    "name": "FELIPE BONFIM BRANDT DA SILVA",
    "team": "Cavaleiros e Guerreiros",
    "level": 9,
    "xp": 8220,
    "mana": 5,
    "hp": 10,
    "gold": 780
  },
  {
    "house": "C",
    "name": "GUILHERME FAHR",
    "team": "Lobos e Gatunos",
    "level": 16,
    "xp": 15518,
    "mana": 3,
    "hp": 10,
    "gold": 1772
  },
  {
    "house": "C",
    "name": "ISABELLA DE LARA SARAIVA",
    "team": "Fadas Guerreiras",
    "level": 17,
    "xp": 16318,
    "mana": 2,
    "hp": 10,
    "gold": 2708
  },
  {
    "house": "C",
    "name": "LAVÍNIA RAMOS",
    "team": "Lobos e Gatunos",
    "level": 6,
    "xp": 5315,
    "mana": 5,
    "hp": 10,
    "gold": 1230
  },
  {
    "house": "C",
    "name": "LAVINIA SAMIELLY",
    "team": "Mágicos e Engenheiros",
    "level": 4,
    "xp": 3000,
    "mana": 5,
    "hp": 10,
    "gold": 780
  },
  {
    "house": "C",
    "name": "MARIA EDUARDA SANTOS SILVA",
    "team": "Dragões de Combate",
    "level": 16,
    "xp": 15695,
    "mana": 5,
    "hp": 10,
    "gold": 2560
  },
  {
    "house": "C",
    "name": "MARIA VITORIA DA SILVA CASTRO",
    "team": "Cavaleiros e Guerreiros",
    "level": 17,
    "xp": 16748,
    "mana": 5,
    "hp": 10,
    "gold": 2385
  },
  {
    "house": "C",
    "name": "MIGUEL JUSTUS LEITE",
    "team": "Chama Congelante",
    "level": 15,
    "xp": 14523,
    "mana": 3,
    "hp": 10,
    "gold": 2190
  },
  {
    "house": "C",
    "name": "NICOLAS ANTONIO DIAS GONÇALVES",
    "team": "Dragões de Combate",
    "level": 18,
    "xp": 17637,
    "mana": 4,
    "hp": 10,
    "gold": 2911
  },
  {
    "house": "C",
    "name": "RAFAEL FERNANDO DOS SANTOS CORDEIRO",
    "team": "Dragões de Combate",
    "level": 14,
    "xp": 13960,
    "mana": 5,
    "hp": 10,
    "gold": 1928
  },
  {
    "house": "C",
    "name": "RALINNE ELIZA",
    "team": "Mágicos e Engenheiros",
    "level": 17,
    "xp": 16646,
    "mana": 3,
    "hp": 10,
    "gold": 1982
  },
  {
    "house": "C",
    "name": "SAMANTHA DIRCÉIA DOS SANTOS SILVA",
    "team": "Fadas Guerreiras",
    "level": 19,
    "xp": 18000,
    "mana": 5,
    "hp": 10,
    "gold": 2276
  },
  {
    "house": "C",
    "name": "SOPHIA DA ROSA",
    "team": "Fadas Guerreiras",
    "level": 17,
    "xp": 16211,
    "mana": 5,
    "hp": 10,
    "gold": 2050
  },
  {
    "house": "C",
    "name": "YURI PIETRO PORTES E GOES",
    "team": "Mágicos e Engenheiros",
    "level": 17,
    "xp": 16274,
    "mana": 2,
    "hp": 10,
    "gold": 2292
  }
];
