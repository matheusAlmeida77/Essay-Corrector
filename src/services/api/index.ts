import { api } from "../apiClient";
import { UserRole } from "@/contexts/AuthContext";

export const aiService = {
  getStatus: () => api.getAi(),
  analyzeText: (text: string, theme: string, title?: string) =>
    api.postAi(text, theme, title),
};

export const studentService = {
  getAll: () => api.getAll("student"),
  getById: (id: string) => api.getById("student", id),
  create: (student: any) => api.create("student", student),
  update: (id: string, updates: any) => api.update("student", id, updates),
  delete: (id: string) => api.delete("student", id),
};

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  avatarUrl?: string;
}

export const userService = {
  getAll: () => api.getAll("user"),
  getById: (id: string) => api.getById("user", id),
  create: (user: CreateUserData) => api.create("user", user),
  update: (id: string, updates: UpdateUserData) =>
    api.update("user", id, updates),
  delete: (id: string) => api.delete("user", id),
  login: (email: string, password: string) =>
    api.auth.login({ email, password }),
  register: (name: string, email: string, password: string, role: string) =>
    api.auth.register({ name, email, password, role }),
};

export const essayService = {
  getAll: () => api.getEssays(),
  getById: (id: string) => api.getEssayById(id),
  getByTargetId: async (targetId: string) => {
    const response = await api.getEssayByTargetId(targetId);
    return response.entries;
  },
  create: (entry: {
    title?: string;
    theme: string;
    content: string;
    feedback?: string;
    studentId: string;
  }) => api.createEssay(entry),
  update: (
    id: string,
    updates: {
      title?: string;
      theme: string;
      content: string;
      feedback?: string;
      studentId: string;
    }
  ) => api.updateEssay(id, updates),
  delete: (id: string) => api.deleteEssay(id),
};

export const gradeService = {
  getAll: () => api.getGrades(),
  getById: (id: string) => api.getGradeById(id),
  getByTargetId: async (targetId: string) => {
    const response = await api.getGradeByTargetId(targetId);
    return response.entries;
  },
  create: (entry: {
    overallScore: number;
    criteria: object;
    teacherId: string;
    essayId: string;
  }) => api.createGrade(entry),
  update: (
    id: string,
    updates: {
      overallScore: number;
      criteria: object;
      teacherId: string;
      essayId: string;
    }
  ) => api.updateGrade(id, updates),
  delete: (id: string) => api.deleteGrade(id),
};

// export const historyService = {
//   getAll: () => api.getHistorical(),
//   getById: (id: string) => api.getHistoryById(id),
//   getByTargetId: async (targetId: string) => {
//     const response = await api.getHistoryByTargetId(targetId);
//     return response.entries;
//   },
//   create: (entry: { description: string; targetId: string }) =>
//     api.createHistory(entry),
//   update: (id: string, updates: { description: string }) =>
//     api.updateHistory(id, updates),
//   delete: (id: string) => api.deleteHistory(id),
// };
