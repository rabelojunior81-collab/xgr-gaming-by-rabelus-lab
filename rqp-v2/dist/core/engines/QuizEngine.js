export class QuizEngine {
    quizzes = new Map();
    constructor() {
        this.initializeQuizzes();
    }
    initializeQuizzes() {
        const stakeholderQuiz = {
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
    getQuiz(type) {
        return this.quizzes.get(type);
    }
    validateAnswers(quizId, answers) {
        const quiz = Array.from(this.quizzes.values()).find(q => q.id === quizId);
        if (!quiz)
            return false;
        for (const question of quiz.questions) {
            if (question.validation?.required && !answers[question.id]) {
                return false;
            }
        }
        return true;
    }
    createAnswers(quizId, answers) {
        return {
            quizId,
            answers,
            timestamp: new Date(),
        };
    }
}
//# sourceMappingURL=QuizEngine.js.map