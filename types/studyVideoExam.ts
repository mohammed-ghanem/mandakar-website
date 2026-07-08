export type VideoExamOption = {
  id: number;
  text: string;
};

export type VideoExamQuestionType =
  | "multiple_choice"
  | "true_false"
  | "article"
  | (string & {});

export type VideoExamQuestion = {
  id: number;
  text: string;
  type: VideoExamQuestionType;
  options: VideoExamOption[];
};

export type VideoExam = {
  id?: number | string;
  title?: string;
  questions: VideoExamQuestion[];
};

export type VideoExamAnswerPayload =
  | {
      examQuestionId: number;
      type: VideoExamQuestionType;
      articleAnswer: string;
    }
  | {
      examQuestionId: number;
      type: VideoExamQuestionType;
      trueFalseAnswer: number;
    }
  | {
      examQuestionId: number;
      type: VideoExamQuestionType;
      selectedOptionId: number;
    };

export function isArticleExamQuestion(type: VideoExamQuestionType): boolean {
  return type === "article";
}
