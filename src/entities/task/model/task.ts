export const TASK_STATUSES = ["todo", "inProgress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type ISODateString = string;

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: ISODateString;
  tags: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface GetTasksParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  search?: string;
  sortBy?: "createdAt" | "deadline";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskInput = Partial<
  Omit<Task, "id" | "createdAt" | "updatedAt">
>;
export type UpdateTaskStatusInput = {
  status: TaskStatus;
};
