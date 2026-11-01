export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type GameMode = 'pvp' | 'ai';

export interface MathProblem {
  id: string;
  expression: string;
  displayExpression: string;
  answer: number;
  operation: OperationType;
  explanation: string;
  num1: number;
  num2: number;
}

export interface TeamState {
  id: 'team1' | 'team2';
  name: string;
  score: number;
  currentProblem: MathProblem;
  input: string;
  feedback: 'correct' | 'wrong' | null;
  feedbackMessage: string;
  streak: number;
  totalCorrect: number;
  totalAttempts: number;
}

export interface GameSettings {
  pointsToWin: number;
  operations: {
    addition: boolean;
    subtraction: boolean;
    multiplication: boolean;
    division: boolean;
  };
  difficulty: DifficultyLevel;
  minNumber: number;
  maxNumber: number;
  gameMode: GameMode;
  aiSpeed: 'slow' | 'medium' | 'fast';
  team1Name: string;
  team2Name: string;
  soundEnabled: boolean;
  showHints: boolean;
}

export interface RoundStat {
  team: 'team1' | 'team2';
  expression: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timestamp: number;
}
