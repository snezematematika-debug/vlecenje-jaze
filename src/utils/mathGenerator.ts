import { DifficultyLevel, GameSettings, MathProblem, OperationType } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNonZero(min: number, max: number): number {
  let val = 0;
  while (val === 0) {
    val = getRandomInt(min, max);
  }
  return val;
}

function formatNumber(n: number): string {
  if (n < 0) return `(${n})`;
  return `${n}`;
}

export function generateProblem(settings: GameSettings, excludeId?: string): MathProblem {
  const activeOps: OperationType[] = [];
  if (settings.operations.addition) activeOps.push('addition');
  if (settings.operations.subtraction) activeOps.push('subtraction');
  if (settings.operations.multiplication) activeOps.push('multiplication');
  if (settings.operations.division) activeOps.push('division');

  // Fallback to addition if none selected
  const operation = activeOps.length > 0 
    ? activeOps[Math.floor(Math.random() * activeOps.length)] 
    : 'addition';

  let num1 = 0;
  let num2 = 0;
  let answer = 0;
  let expression = '';
  let displayExpression = '';
  let explanation = '';

  const diff = settings.difficulty;

  if (operation === 'addition') {
    let limit = 10;
    if (diff === 'medium') limit = 15;
    if (diff === 'hard') limit = 25;
    if (diff === 'expert') limit = 40;

    num1 = getRandomInt(-limit, limit);
    num2 = getRandomInt(-limit, limit);
    answer = num1 + num2;

    expression = `${num1} + ${num2}`;
    displayExpression = `${formatNumber(num1)} + ${formatNumber(num2)}`;

    if ((num1 >= 0 && num2 >= 0) || (num1 <= 0 && num2 <= 0)) {
      explanation = `Бидејќи двата броја имаат ист знак, ги собираме нивните апсолутни вредности (${Math.abs(num1)} + ${Math.abs(num2)} = ${Math.abs(answer)}) и го задржуваме знакот: ${answer}`;
    } else {
      const bigger = Math.abs(num1) >= Math.abs(num2) ? num1 : num2;
      const signWord = bigger > 0 ? 'плус (+)' : 'минус (-)';
      explanation = `Броевите имаат различни знаци: од поголемиот по апсолутна вредност го одземаме помалиот (${Math.max(Math.abs(num1), Math.abs(num2))} - ${Math.min(Math.abs(num1), Math.abs(num2))} = ${Math.abs(answer)}) и го земаме знакот на ${bigger} (${signWord}): ${answer}`;
    }
  } else if (operation === 'subtraction') {
    let limit = 10;
    if (diff === 'medium') limit = 15;
    if (diff === 'hard') limit = 25;
    if (diff === 'expert') limit = 40;

    num1 = getRandomInt(-limit, limit);
    num2 = getRandomInt(-limit, limit);
    answer = num1 - num2;

    expression = `${num1} - ${num2}`;
    displayExpression = `${formatNumber(num1)} - ${formatNumber(num2)}`;

    if (num2 < 0) {
      explanation = `Одземање на негативен број станува собирање: ${formatNumber(num1)} - (${num2}) = ${num1} + ${Math.abs(num2)} = ${answer}`;
    } else {
      explanation = `Одземањето го претвораме во собирање со спротивниот број: ${formatNumber(num1)} + (-${num2}) = ${answer}`;
    }
  } else if (operation === 'multiplication') {
    let limit = 7;
    if (diff === 'medium') limit = 10;
    if (diff === 'hard') limit = 12;
    if (diff === 'expert') limit = 15;

    num1 = getRandomInt(-limit, limit);
    num2 = getRandomInt(-limit, limit);
    answer = num1 * num2;

    expression = `${num1} · ${num2}`;
    displayExpression = `${formatNumber(num1)} · ${formatNumber(num2)}`;

    if (num1 === 0 || num2 === 0) {
      explanation = `Секој број помножен со 0 е еднаков на 0!`;
    } else if ((num1 > 0 && num2 > 0) || (num1 < 0 && num2 < 0)) {
      explanation = `Правило за знаци: (-) · (-) = (+) и (+) · (+) = (+). Исти знаци даваат позитивен резултат: ${Math.abs(num1)} · ${Math.abs(num2)} = ${answer}`;
    } else {
      explanation = `Правило за знаци: (-) · (+) = (-) и (+) · (-) = (-). Различни знаци даваат негативен резултат: -(${Math.abs(num1)} · ${Math.abs(num2)}) = ${answer}`;
    }
  } else {
    // Division
    let factorLimit = 6;
    if (diff === 'medium') factorLimit = 9;
    if (diff === 'hard') factorLimit = 12;
    if (diff === 'expert') factorLimit = 15;

    const divisor = getRandomNonZero(-factorLimit, factorLimit);
    const quotient = getRandomNonZero(-factorLimit, factorLimit);
    const dividend = divisor * quotient;

    num1 = dividend;
    num2 = divisor;
    answer = quotient;

    expression = `${num1} : ${num2}`;
    displayExpression = `${formatNumber(num1)} : ${formatNumber(num2)}`;

    if ((num1 > 0 && num2 > 0) || (num1 < 0 && num2 < 0)) {
      explanation = `Правило за делење: исти знаци даваат позитивен резултат: ${Math.abs(num1)} : ${Math.abs(num2)} = ${answer}`;
    } else {
      explanation = `Правило за делење: различни знаци даваат негативен резултат: -(${Math.abs(num1)} : ${Math.abs(num2)}) = ${answer}`;
    }
  }

  const id = `${num1}_${operation}_${num2}_${Date.now()}`;
  if (excludeId && id === excludeId) {
    return generateProblem(settings);
  }

  return {
    id,
    expression,
    displayExpression,
    answer,
    operation,
    explanation,
    num1,
    num2,
  };
}
