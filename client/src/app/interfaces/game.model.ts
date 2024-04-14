// game.model.ts
export interface Choice {
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    // QCM ou QRL
    type: string;
    text: string;
    // each question has a value between [10,100] and is also a multiple of 10
    points: number;
    choices: Choice[];
}

export interface Game {
    id: string;
    title: string;
    isVisible: boolean;
    lastModification: Date;
    // 10 to 60 seconds, the set time is the same for all the questions
    duration: number;
    description: string;
    questions: Question[];
}
