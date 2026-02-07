/**
 * Livro de Aberturas - Catálogo ECO Reduzido
 *
 * ECO (Encyclopedia of Chess Openings) codificação:
 * A00-A39: Aberturas de Peão da Dama (irregulares)
 * A40-A99: Defesas Índias e Semi-Abertas
 * B00-B19: Defesas de 1...e6 e 1...e5
 * B20-B99: Defesa Siciliana
 * C00-C19: Defesa Francesa
 * C20-C59: Aberturas Abertas (1.e4 e5)
 * C60-C99: Abertura Espanhola e Italianas
 * D00-D69: Gambitos e Sistemas Fechados
 * D70-D99: Defesas Índias e Grunfeld
 * E00-E99: Catalã, Benoni, Holandesa
 */

import type { OpeningData, OpeningCategory } from '@shared/types/chess';

/**
 * Categorias de aberturas por estilo de jogo
 */
export const OPENING_CATEGORIES: Record<OpeningCategory, readonly string[]> = {
  /** Aberturas agressivas - favoritas de Drakon */
  aggressive: ['B20', 'B21', 'B22', 'B40', 'B90', 'C30', 'C33', 'C34', 'B01'],
  /** Aberturas sólidas - favoritas de Fortress */
  solid: ['B10', 'B11', 'B12', 'B18', 'D10', 'D12', 'A46', 'A48', 'E00'],
  /** Aberturas posicionais - favoritas de Strategos */
  positional: ['A10', 'A13', 'A14', 'A15', 'A09', 'E01', 'E06', 'D02', 'D05'],
  /** Aberturas táticas - favoritas de Tactical */
  tactical: ['C50', 'C55', 'C57', 'C58', 'C60', 'C65', 'C70', 'C80', 'C88']
};


/**
 * Catálogo completo de aberturas
 * FEN simplificado (sem contadores) → array de OpeningData
 */
export const OPENINGS: OpeningData[] = [
  // =====================================================
  // B20-B99: DEFESA SICILIANA (Semi-Aberta)
  // =====================================================
  {
    eco: 'B20',
    name: 'Siciliana',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5'],
    weight: 10
  },
  {
    eco: 'B21',
    name: 'Siciliana - Smith-Morra Gambit',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'd2d4', 'c5d4', 'c2c3'],
    weight: 6
  },
  {
    eco: 'B22',
    name: 'Siciliana - Alapin (2.c3)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'c2c3'],
    weight: 7
  },
  {
    eco: 'B23',
    name: 'Siciliana - Fechada',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'b1c3'],
    weight: 5
  },
  {
    eco: 'B30',
    name: 'Siciliana - Nxd4 sem Nf6',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'b8c6', 'd2d4'],
    weight: 8
  },
  {
    eco: 'B32',
    name: 'Siciliana - Lowenthal',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'b8c6', 'd2d4', 'c5d4', 'f3d4', 'e7e5'],
    weight: 5
  },
  {
    eco: 'B40',
    name: 'Siciliana - Paulsen/Kan',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'a7a6'],
    weight: 7
  },
  {
    eco: 'B41',
    name: 'Siciliana - Paulsen (6.Bd3)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'a7a6', 'c2c4'],
    weight: 6
  },
  {
    eco: 'B43',
    name: 'Siciliana - Kan (5.Bd3)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'a7a6', 'f1d3'],
    weight: 6
  },
  {
    eco: 'B44',
    name: 'Siciliana - Taimanov',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'b8c6'],
    weight: 7
  },
  {
    eco: 'B46',
    name: 'Siciliana - Taimanov (6.Be3)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'b8c6', 'b1c3', 'a7a6', 'c1e3'],
    weight: 6
  },
  {
    eco: 'B47',
    name: 'Siciliana - Taimanov (6.Be2)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'b8c6', 'b1c3', 'd8c7'],
    weight: 5
  },
  {
    eco: 'B48',
    name: 'Siciliana - Taimanov (6.Be3 a6)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'b8c6', 'b1c3', 'a7a6', 'c1e3'],
    weight: 6
  },
  {
    eco: 'B49',
    name: 'Siciliana - Taimanov (6.Be2 a6)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'b8c6', 'b1c3', 'a7a6', 'f1e2'],
    weight: 5
  },
  {
    eco: 'B51',
    name: 'Siciliana - Rossolimo (3.Bb5)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'f1b5'],
    weight: 7
  },
  {
    eco: 'B52',
    name: 'Siciliana - Rossolimo (3...Bd7)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'f1b5', 'c8d7'],
    weight: 6
  },
  {
    eco: 'B54',
    name: 'Siciliana - Praga (6.c4)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'e7e6', 'd2d4', 'c5d4', 'f3d4', 'g8f6'],
    weight: 6
  },
  {
    eco: 'B56',
    name: 'Siciliana - Clássica',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'b8c6'],
    weight: 8
  },
  {
    eco: 'B57',
    name: 'Siciliana - Sozin',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'b8c6', 'f1c4'],
    weight: 6
  },
  {
    eco: 'B58',
    name: 'Siciliana - Boleslavsky',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'b8c6', 'f1e2', 'e7e5'],
    weight: 7
  },
  {
    eco: 'B60',
    name: 'Siciliana - Richter-Rauzer',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'b8c6', 'c1g5'],
    weight: 7
  },
  {
    eco: 'B70',
    name: 'Siciliana - Dragão (Clássica)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'g7g6'],
    weight: 8
  },
  {
    eco: 'B76',
    name: 'Siciliana - Dragão (Yugoslava)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'g7g6', 'c1e3', 'f8g7', 'f2f3'],
    weight: 7
  },
  {
    eco: 'B90',
    name: 'Siciliana - Najdorf',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'a7a6'],
    weight: 10
  },
  {
    eco: 'B96',
    name: 'Siciliana - Najdorf (6.Bg5)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'a7a6', 'c1g5'],
    weight: 8
  },
  {
    eco: 'B97',
    name: 'Siciliana - Najdorf (Poisoned Pawn)',
    category: 'semi-open',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'a7a6', 'c1g5', 'e7e6', 'f2f4', 'd8b6'],
    weight: 6
  },

  // =====================================================
  // C00-C19: DEFESA FRANCESA (Semi-Aberta)
  // =====================================================
  {
    eco: 'C00',
    name: 'Francesa',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6'],
    weight: 9
  },
  {
    eco: 'C01',
    name: 'Francesa - Exchange',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'e4d5'],
    weight: 5
  },
  {
    eco: 'C02',
    name: 'Francesa - Advance',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'e4e5'],
    weight: 7
  },
  {
    eco: 'C03',
    name: 'Francesa - Tarrasch (3.Nd2)',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1d2'],
    weight: 7
  },
  {
    eco: 'C05',
    name: 'Francesa - Tarrasch (4...Nf6)',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1d2', 'g8f6'],
    weight: 6
  },
  {
    eco: 'C09',
    name: 'Francesa - Tarrasch (5.Ngf3)',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1d2', 'c7c5', 'e4d5'],
    weight: 6
  },
  {
    eco: 'C10',
    name: 'Francesa - Paulsen',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3'],
    weight: 7
  },
  {
    eco: 'C11',
    name: 'Francesa - Steinitz',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3', 'g8f6'],
    weight: 7
  },
  {
    eco: 'C15',
    name: 'Francesa - Winawer',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3', 'f8b4'],
    weight: 8
  },
  {
    eco: 'C18',
    name: 'Francesa - Winawer (5.a3 Bxc3+)',
    category: 'semi-open',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3', 'f8b4', 'a2a3', 'b4c3'],
    weight: 6
  },

  // =====================================================
  // B10-B19: CARO-KANN (Semi-Aberta)
  // =====================================================
  {
    eco: 'B10',
    name: 'Caro-Kann',
    category: 'semi-open',
    moves: ['e2e4', 'c7c6'],
    weight: 9
  },
  {
    eco: 'B12',
    name: 'Caro-Kann - Advance',
    category: 'semi-open',
    moves: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'e4e5'],
    weight: 7
  },
  {
    eco: 'B13',
    name: 'Caro-Kann - Exchange',
    category: 'semi-open',
    moves: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'e4d5'],
    weight: 6
  },
  {
    eco: 'B14',
    name: 'Caro-Kann - Panov-Botvinnik',
    category: 'semi-open',
    moves: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'e4d5', 'c6d5', 'c2c4'],
    weight: 7
  },
  {
    eco: 'B17',
    name: 'Caro-Kann - Steinitz',
    category: 'semi-open',
    moves: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'b1c3', 'd5e4', 'c3e4', 'b8d7'],
    weight: 7
  },
  {
    eco: 'B18',
    name: 'Caro-Kann - Clássica',
    category: 'semi-open',
    moves: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'b1c3', 'd5e4', 'c3e4', 'c8f5'],
    weight: 8
  },

  // =====================================================
  // C20-C59: ABERTURAS ABERTAS (1.e4 e5)
  // =====================================================
  {
    eco: 'C20',
    name: 'Abertura Aberta (1.e4 e5)',
    category: 'open',
    moves: ['e2e4', 'e7e5'],
    weight: 10
  },
  {
    eco: 'C21',
    name: 'Abertura do Centro',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'd2d4', 'e5d4'],
    weight: 6
  },
  {
    eco: 'C25',
    name: 'Abertura Viena',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'b1c3'],
    weight: 6
  },
  {
    eco: 'C30',
    name: 'Gambito do Rei',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'f2f4'],
    weight: 7
  },
  {
    eco: 'C33',
    name: 'Gambito do Rei Aceito',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'f2f4', 'e5f4'],
    weight: 6
  },
  {
    eco: 'C34',
    name: 'Gambito do Rei - Fischer Defesa',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'f2f4', 'e5f4', 'g1f3', 'd7d6'],
    weight: 5
  },
  {
    eco: 'C40',
    name: 'Abertura do Cavalo do Rei',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3'],
    weight: 9
  },
  {
    eco: 'C41',
    name: 'Defesa Philidor',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'd7d6'],
    weight: 6
  },
  {
    eco: 'C42',
    name: 'Russa (Petroff)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'g8f6'],
    weight: 8
  },
  {
    eco: 'C44',
    name: 'Abertura do Cavalo do Rei - Ponziani',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'c2c3'],
    weight: 6
  },
  {
    eco: 'C45',
    name: 'Escocesa',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'd2d4', 'e5d4', 'f3d4'],
    weight: 8
  },
  {
    eco: 'C46',
    name: 'Três Cavaleiros',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'b1c3'],
    weight: 6
  },
  {
    eco: 'C47',
    name: 'Quatro Cavaleiros',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'b1c3', 'g8f6'],
    weight: 7
  },
  {
    eco: 'C50',
    name: 'Italiana (Giuoco Piano)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5'],
    weight: 9
  },
  {
    eco: 'C51',
    name: 'Italiana - Evans Gambit',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'b2b4'],
    weight: 6
  },
  {
    eco: 'C54',
    name: 'Italiana - Giuoco Pianissimo',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'd2d3'],
    weight: 7
  },
  {
    eco: 'C55',
    name: 'Dois Cavaleiros',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6'],
    weight: 8
  },
  {
    eco: 'C56',
    name: 'Dois Cavaleiros - Max Lange',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'd2d4', 'e5d4', 'e1g1'],
    weight: 5
  },
  {
    eco: 'C57',
    name: 'Dois Cavaleiros - Fried Liver',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'f3g5'],
    weight: 7
  },
  {
    eco: 'C58',
    name: 'Dois Cavaleiros - Morphy',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'f3g5', 'd7d5', 'e4d5', 'c6a5'],
    weight: 6
  },
  {
    eco: 'C59',
    name: 'Dois Cavaleiros - Polerio',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'f3g5', 'd7d5', 'e4d5', 'c6a5', 'c4b5'],
    weight: 5
  },

  // =====================================================
  // C60-C99: ESPANHOLA (Ruy Lopez) e Italianas
  // =====================================================
  {
    eco: 'C60',
    name: 'Espanhola (Ruy Lopez)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5'],
    weight: 10
  },
  {
    eco: 'C65',
    name: 'Espanhola - Clássica',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'g8f6'],
    weight: 8
  },
  {
    eco: 'C67',
    name: 'Espanhola - Aberta (6.d4)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'g8f6', 'e1g1', 'f6e4', 'd2d4'],
    weight: 7
  },
  {
    eco: 'C70',
    name: 'Espanhola - Bird',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b5a4', 'g8f6', 'e1g1'],
    weight: 6
  },
  {
    eco: 'C78',
    name: 'Espanhola - Molha',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b5a4', 'g8f6', 'e1g1', 'b7b5', 'a4b3', 'c6a5'],
    weight: 6
  },
  {
    eco: 'C80',
    name: 'Espanhola - Aberta (6.d4)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b5a4', 'g8f6', 'e1g1', 'f6e4', 'd2d4'],
    weight: 7
  },
  {
    eco: 'C83',
    name: 'Espanhola - Aberta (9...Be7)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b5a4', 'g8f6', 'e1g1', 'f6e4', 'd2d4', 'b7b5', 'a4b3', 'd7d5', 'd4e5', 'c8e6', 'b1d2'],
    weight: 6
  },
  {
    eco: 'C88',
    name: 'Espanhola - Fechada (6.Re1)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b5a4', 'g8f6', 'e1g1', 'b7b5', 'a4b3', 'f8e7'],
    weight: 7
  },
  {
    eco: 'C90',
    name: 'Espanhola - Fechada (9.d3)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b5a4', 'g8f6', 'e1g1', 'b7b5', 'a4b3', 'f8e7', 'c2c3', 'd7d6'],
    weight: 6
  },
  {
    eco: 'C92',
    name: 'Espanhola - Fechada (9.h3)',
    category: 'open',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b4a4', 'g8f6', 'e1g1', 'b7b5', 'a4b3', 'f8e7', 'c2c3', 'd7d6', 'h2h3'],
    weight: 7
  },

  // =====================================================
  // B01: ESCANDINAVA (Semi-Aberta)
  // =====================================================
  {
    eco: 'B01',
    name: 'Escandinava',
    category: 'semi-open',
    moves: ['e2e4', 'd7d5'],
    weight: 7
  },
  {
    eco: 'B01b',
    name: 'Escandinava - 3...Qa5',
    category: 'semi-open',
    moves: ['e2e4', 'd7d5', 'e4d5', 'd8d5', 'b1c3', 'd5a5'],
    weight: 6
  },
  {
    eco: 'B01c',
    name: 'Escandinava - Mieses-Kotroc',
    category: 'semi-open',
    moves: ['e2e4', 'd7d5', 'e4d5', 'd8d5', 'b1c3', 'd5d6'],
    weight: 6
  },

  // =====================================================
  // A10-A99: INGLESA e Sistemas Fechados
  // =====================================================
  {
    eco: 'A10',
    name: 'Inglesa',
    category: 'closed',
    moves: ['c2c4'],
    weight: 9
  },
  {
    eco: 'A11',
    name: 'Inglesa - Caro-Kann',
    category: 'closed',
    moves: ['c2c4', 'c7c6'],
    weight: 6
  },
  {
    eco: 'A13',
    name: 'Inglesa - 1...e6',
    category: 'closed',
    moves: ['c2c4', 'e7e6'],
    weight: 7
  },
  {
    eco: 'A14',
    name: 'Inglesa - Réti (3.g3)',
    category: 'closed',
    moves: ['c2c4', 'e7e6', 'g1f3', 'd7d5', 'g2g3'],
    weight: 6
  },
  {
    eco: 'A15',
    name: 'Inglesa - Anglo-Indiana',
    category: 'closed',
    moves: ['c2c4', 'g8f6'],
    weight: 7
  },
  {
    eco: 'A16',
    name: 'Inglesa - Anglo-Indiana (2.Nc3)',
    category: 'closed',
    moves: ['c2c4', 'g8f6', 'b1c3'],
    weight: 6
  },
  {
    eco: 'A20',
    name: 'Inglesa - 1...e5',
    category: 'closed',
    moves: ['c2c4', 'e7e5'],
    weight: 7
  },
  {
    eco: 'A21',
    name: 'Inglesa - Reversa Siciliana',
    category: 'closed',
    moves: ['c2c4', 'e7e5', 'b1c3', 'b8c6'],
    weight: 6
  },
  {
    eco: 'A22',
    name: 'Inglesa - 2.Nc3 Nf6',
    category: 'closed',
    moves: ['c2c4', 'e7e5', 'b1c3', 'g8f6'],
    weight: 6
  },
  {
    eco: 'A25',
    name: 'Inglesa - Simetria Fechada',
    category: 'closed',
    moves: ['c2c4', 'e7e5', 'b1c3', 'b8c6', 'g2g3', 'g7g6', 'f1g2', 'f8g7'],
    weight: 6
  },
  {
    eco: 'A28',
    name: 'Inglesa - Quatro Cavaleiros',
    category: 'closed',
    moves: ['c2c4', 'e7e5', 'b1c3', 'b8c6', 'g1f3', 'g8f6'],
    weight: 6
  },
  {
    eco: 'A29',
    name: 'Inglesa - Quatro Cavaleiros (4.g3)',
    category: 'closed',
    moves: ['c2c4', 'e7e5', 'b1c3', 'b8c6', 'g1f3', 'g8f6', 'g2g3'],
    weight: 6
  },
  {
    eco: 'A30',
    name: 'Inglesa - Simetria',
    category: 'closed',
    moves: ['c2c4', 'c7c5'],
    weight: 6
  },
  {
    eco: 'A34',
    name: 'Inglesa - Simetria (2.Nc3)',
    category: 'closed',
    moves: ['c2c4', 'c7c5', 'b1c3'],
    weight: 5
  },
  {
    eco: 'A36',
    name: 'Inglesa - Simetria (2.g3)',
    category: 'closed',
    moves: ['c2c4', 'c7c5', 'g2g3'],
    weight: 5
  },
  {
    eco: 'A40',
    name: 'Polonesa',
    category: 'closed',
    moves: ['d2d4', 'e7e6'],
    weight: 5
  },

  // =====================================================
  // D00-D69: GAMBITOS e SISTEMAS FECHADOS
  // =====================================================
  {
    eco: 'D00',
    name: 'Gambito do Peão da Dama',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4'],
    weight: 8
  },
  {
    eco: 'D02',
    name: 'Peão da Dama - Londres System',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'g1f3', 'g8f6', 'c1f4'],
    weight: 8
  },
  {
    eco: 'D03',
    name: 'Torre',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'g1f3', 'g8f6', 'c1g5'],
    weight: 6
  },
  {
    eco: 'D04',
    name: 'Colle',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'g1f3', 'g8f6', 'e2e3'],
    weight: 6
  },
  {
    eco: 'D05',
    name: 'Colle-Zukertort',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'g1f3', 'g8f6', 'e2e3', 'e7e6', 'f1d3', 'c7c5', 'b2b3'],
    weight: 5
  },
  {
    eco: 'D06',
    name: 'Gambito do Peão da Dama - Defesa QGD',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'c7c6'],
    weight: 7
  },
  {
    eco: 'D10',
    name: 'Eslava',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'c7c6', 'b1c3'],
    weight: 7
  },
  {
    eco: 'D12',
    name: 'Eslava - Exchange',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'c7c6', 'b1c3', 'g8f6', 'e2e3', 'c8f5', 'c4d5', 'c6d5'],
    weight: 6
  },
  {
    eco: 'D15',
    name: 'Eslava - 4.Nc3',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'c7c6', 'b1c3', 'g8f6', 'g1f3'],
    weight: 6
  },
  {
    eco: 'D30',
    name: 'Gambito da Dama Recusado',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'e7e6'],
    weight: 8
  },
  {
    eco: 'D35',
    name: 'QGD - Exchange (4.cxd5)',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'e7e6', 'b1c3', 'g8f6', 'c4d5', 'e6d5'],
    weight: 6
  },
  {
    eco: 'D37',
    name: 'QGD - 4.Nc3 Be7',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'e7e6', 'b1c3', 'g8f6', 'c1g5', 'f8e7'],
    weight: 6
  },
  {
    eco: 'D38',
    name: 'QGD - Ragozin',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'e7e6', 'b1c3', 'g8f6', 'c1g5', 'f8b4'],
    weight: 6
  },
  {
    eco: 'D52',
    name: 'QGD - Cambridge Springs',
    category: 'closed',
    moves: ['d2d4', 'd7d5', 'c2c4', 'e7e6', 'b1c3', 'g8f6', 'c1g5', 'b8d7', 'e2e3', 'c7c6', 'g1f3', 'd8a5'],
    weight: 5
  },

  // =====================================================
  // E00-E99: CATALÃ, BENONI, HOLANDESA
  // =====================================================
  {
    eco: 'E00',
    name: 'Catalã',
    category: 'closed',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'g2g3'],
    weight: 8
  },
  {
    eco: 'E01',
    name: 'Catalã - 4.Bg2',
    category: 'closed',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'g2g3', 'd7d5', 'f1g2'],
    weight: 7
  },
  {
    eco: 'E04',
    name: 'Catalã - Aberta',
    category: 'closed',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'g2g3', 'd7d5', 'f1g2', 'd5c4', 'g1f3'],
    weight: 6
  },
  {
    eco: 'E06',
    name: 'Catalã - Fechada',
    category: 'closed',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'g2g3', 'd7d5', 'f1g2', 'f8e7', 'g1f3'],
    weight: 6
  },
  {
    eco: 'E20',
    name: 'Nimzo-Indiana',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'b1c3', 'f8b4'],
    weight: 8
  },
  {
    eco: 'E32',
    name: 'Nimzo-Indiana - Clássica',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'b1c3', 'f8b4', 'd1c2'],
    weight: 6
  },
  {
    eco: 'E40',
    name: 'Nimzo-Indiana - Rubinstein',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'b1c3', 'f8b4', 'e2e3'],
    weight: 6
  },
  {
    eco: 'E41',
    name: 'Nimzo-Indiana - e3 c5',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'b1c3', 'f8b4', 'e2e3', 'c7c5'],
    weight: 5
  },
  {
    eco: 'E60',
    name: 'Índia do Rei',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6'],
    weight: 8
  },
  {
    eco: 'E61',
    name: 'Índia do Rei - 4.Nc3',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3'],
    weight: 6
  },
  {
    eco: 'E62',
    name: 'Índia do Rei - Clássica',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7', 'g1f3', 'd7d6', 'g2g3'],
    weight: 7
  },
  {
    eco: 'E67',
    name: 'Índia do Rei - fianchetto',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7', 'g1f3', 'd7d6', 'g2g3', 'e8g8', 'f1g2', 'b8c6'],
    weight: 6
  },
  {
    eco: 'E70',
    name: 'Índia do Rei - 4.e4',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7', 'e2e4'],
    weight: 7
  },
  {
    eco: 'E80',
    name: 'Índia do Rei - Sämisch',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7', 'e2e4', 'd7d6', 'f2f3'],
    weight: 6
  },
  {
    eco: 'E90',
    name: 'Índia do Rei - 5.Nf3',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7', 'e2e4', 'd7d6', 'g1f3'],
    weight: 7
  },
  {
    eco: 'E97',
    name: 'Índia do Rei - Mar del Plata',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7', 'e2e4', 'd7d6', 'g1f3', 'e8g8', 'f1e2', 'e7e5'],
    weight: 6
  },
  {
    eco: 'A50',
    name: 'Benoni Moderna',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'c7c5'],
    weight: 6
  },
  {
    eco: 'A57',
    name: 'Benko Gambit',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'c7c5', 'd4d5', 'b7b5'],
    weight: 6
  },
  {
    eco: 'A58',
    name: 'Benko Gambit Aceito',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'c7c5', 'd4d5', 'b7b5', 'c4b5', 'a7a6'],
    weight: 5
  },
  {
    eco: 'A80',
    name: 'Holandesa',
    category: 'indian',
    moves: ['d2d4', 'f7f5'],
    weight: 6
  },
  {
    eco: 'A81',
    name: 'Holandesa - 2.g3',
    category: 'indian',
    moves: ['d2d4', 'f7f5', 'g2g3'],
    weight: 5
  },
  {
    eco: 'A84',
    name: 'Holandesa - Rubinstein',
    category: 'indian',
    moves: ['d2d4', 'e7e6', 'c2c4', 'f7f5'],
    weight: 5
  },

  // =====================================================
  // A00-A09: ABERTURAS DE FIANCHETTO e RÉTI
  // =====================================================
  {
    eco: 'A09',
    name: 'Réti',
    category: 'closed',
    moves: ['g1f3', 'd7d5', 'c2c4'],
    weight: 7
  },
  {
    eco: 'A04',
    name: 'Zukertort/Réti (1.Nf3)',
    category: 'closed',
    moves: ['g1f3'],
    weight: 6
  },
  {
    eco: 'A05',
    name: 'Zukertort - 1...Nf6',
    category: 'closed',
    moves: ['g1f3', 'g8f6'],
    weight: 6
  },
  {
    eco: 'A06',
    name: 'Zukertort - 1...d5',
    category: 'closed',
    moves: ['g1f3', 'd7d5'],
    weight: 6
  },
  {
    eco: 'A07',
    name: 'Hungara do Rei (1.Nf3 d5 2.g3)',
    category: 'closed',
    moves: ['g1f3', 'd7d5', 'g2g3'],
    weight: 5
  },
  {
    eco: 'A08',
    name: 'Hungara do Rei (2...c5)',
    category: 'closed',
    moves: ['g1f3', 'd7d5', 'g2g3', 'c7c5', 'f1g2', 'b8c6'],
    weight: 5
  },
  {
    eco: 'A03',
    name: 'Bird (1.f4)',
    category: 'closed',
    moves: ['f2f4'],
    weight: 4
  },

  // =====================================================
  // A45: DEFESAS ÍNDIAS INDIAS
  // =====================================================
  {
    eco: 'A46',
    name: 'Índia do Rei (1.d4 Nf6 2.Nf3)',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'g1f3'],
    weight: 6
  },
  {
    eco: 'A48',
    name: 'Índia do Rei - East Indian',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'g1f3', 'g7g6'],
    weight: 6
  },
  {
    eco: 'A49',
    name: 'Índia do Rei - 3.g3',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'g1f3', 'g7g6', 'g2g3'],
    weight: 5
  },
  {
    eco: 'A52',
    name: 'Índia do Rei - Budapest',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'e7e5'],
    weight: 4
  },
  {
    eco: 'A53',
    name: 'Índia Antiga',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'd7d6'],
    weight: 5
  },
  {
    eco: 'A54',
    name: 'Índia Antiga - 3.Nc3',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'd7d6', 'b1c3', 'e7e5'],
    weight: 5
  },
  {
    eco: 'A55',
    name: 'Índia Antiga - 3.Nf3',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'd7d6', 'g1f3'],
    weight: 5
  },
  {
    eco: 'A56',
    name: 'Benoni Defesa',
    category: 'indian',
    moves: ['d2d4', 'g8f6', 'c2c4', 'c7c5'],
    weight: 6
  }
];

/**
 * Total de aberturas no catálogo
 */
export const TOTAL_OPENINGS = OPENINGS.length;

/**
 * Lookup de aberturas por categoria ECO
 */
export const OPENINGS_BY_ECO: Record<string, OpeningData[]> = OPENINGS.reduce((acc, opening) => {
  const prefix = opening.eco.substring(0, 2);
  if (!acc[prefix]) {
    acc[prefix] = [];
  }
  acc[prefix].push(opening);
  return acc;
}, {} as Record<string, OpeningData[]>);

/**
 * Lookup de aberturas por categoria de estilo
 */
export const OPENINGS_BY_CATEGORY: Record<string, OpeningData[]> = OPENINGS.reduce((acc, opening) => {
  if (!acc[opening.category]) {
    acc[opening.category] = [];
  }
  acc[opening.category].push(opening);
  return acc;
}, {} as Record<string, OpeningData[]>);

/**
 * Lookup de aberturas por estilo de personalidade
 */
export function getOpeningsByPersonality(personality: 'aggressive' | 'solid' | 'positional' | 'tactical'): OpeningData[] {
  const ecoCodes = OPENING_CATEGORIES[personality];
  return OPENINGS.filter(o => ecoCodes.some(code => o.eco.startsWith(code)));
}

export default OPENINGS;
