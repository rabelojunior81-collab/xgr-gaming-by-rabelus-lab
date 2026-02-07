import { Quiz, QuizAnswers, QuizType } from '../../types/index.js';
export declare class QuizEngine {
    private quizzes;
    constructor();
    private initializeQuizzes;
    getQuiz(type: QuizType): Quiz | undefined;
    validateAnswers(quizId: string, answers: Record<string, unknown>): boolean;
    createAnswers(quizId: string, answers: Record<string, unknown>): QuizAnswers;
}
//# sourceMappingURL=QuizEngine.d.ts.map