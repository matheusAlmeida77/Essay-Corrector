export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Student {
  _id?: string;
  id?: string;
  name: string;
  class: string;
  number: number;
  userId: string;
}

export interface Essay {
  _id?: string;
  id?: string;
  title?: string;
  theme: string;
  content: string;
  feedback?: string;
  correctedAt?: Date;
  studentId: string;
}

export interface Grade {
  overallScore: number;
  criteria: object;
  essayId: string;
}
