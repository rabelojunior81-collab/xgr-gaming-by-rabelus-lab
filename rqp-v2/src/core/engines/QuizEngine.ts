import { Quiz, QuizAnswers, QuizType } from '../../types/index.js';

export class QuizEngine {
  private quizzes: Map<string, Quiz> = new Map();

  constructor() {
    this.initializeQuizzes();
  }

  private initializeQuizzes(): void {
    const stakeholderQuiz: Quiz = {
      id: 'stakeholder-v1',
      type: 'stakeholder',
      questions: [
        {
          id: 'name',
          question: 'Qual é o seu nome?',
          type: 'text',
          validation: { required: true, minLength: 2 },
        },
        {
          id: 'cognitive_style',
          question: 'Qual seu estilo cognitivo?',
          type: 'select',
          options: ['systems-holistic', 'detail-oriented', 'balanced'],
        },
        {
          id: 'communication',
          question: 'Prefere comunicação direta ou detalhada?',
          type: 'select',
          options: ['direct', 'detailed', 'summary'],
        },
      ],
    };

    this.quizzes.set('stakeholder', stakeholderQuiz);
  }

  getQuiz(type: QuizType): Quiz | undefined {
    return this.quizzes.get(type);
  }

  validateAnswers(quizId: string, answers: Record<string, unknown>): boolean {
    const quiz = Array.from(this.quizzes.values()).find(q => q.id === quizId);
    if (!quiz) return false;

    for (const question of quiz.questions) {
      if (question.validation?.required && !answers[question.id]) {
        return false;
      }
    }

    return true;
  }

  createAnswers(quizId: string, answers: Record<string, unknown>): QuizAnswers {
    return {
      quizId,
      answers,
      timestamp: new Date(),
    };
  }
}
