import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateTaskInput,
  GetTasksParams,
  Task,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "../../entities/task/model/task";
import type { Tag } from "../../entities/tag/model/tag";

type GetTasksResponse = {
  data: Task[];
  total: number;
};

/** Ответ json-server v1: массив или объект пагинации с полем `items` (всего записей). */
function extractTasksFromJsonServerResponse(response: unknown): {
  rows: Task[];
  total: number;
} {
  if (Array.isArray(response)) {
    return { rows: response, total: response.length };
  }
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray((response as { data: unknown }).data)
  ) {
    const r = response as { data: Task[]; items?: number };
    return {
      rows: r.data,
      total: typeof r.items === "number" ? r.items : r.data.length,
    };
  }
  return { rows: [], total: 0 };
}

const buildTasksParams = (params?: GetTasksParams) => {
  if (!params) return undefined;
  // При фильтре по тегу пагинацию на сервер не шлём — тег режем на клиенте, страницы — в UI
  const useServerPagination =
    !params.tag && params.page != null && params.limit != null;
  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.priority ? { priority: params.priority } : {}),
    ...(params.search ? { "title:contains": params.search } : {}),
    ...(params.sortBy
      ? {
          _sort: params.order === "desc" ? `-${params.sortBy}` : params.sortBy,
        }
      : {}),
    ...(useServerPagination
      ? { _page: params.page, _per_page: params.limit }
      : {}),
  };
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:${import.meta.env.VITE_API_PORT || "3001"}`,
  }),
  tagTypes: ["Task", "Tag"],
  endpoints: (builder) => ({
    // tasks
    getTasks: builder.query<GetTasksResponse, GetTasksParams | undefined>({
      query: (params) => ({
        url: "/tasks",
        params: buildTasksParams(params),
      }),
      transformResponse: (
        response: unknown,
        _meta,
        arg: GetTasksParams | undefined,
      ) => {
        const { rows: initialRows, total: serverTotal } =
          extractTasksFromJsonServerResponse(response);
        const tag = arg?.tag;
        if (tag) {
          const filtered = initialRows.filter((t) => t.tags.includes(tag));
          return {
            data: filtered,
            total: filtered.length,
          };
        }
        return {
          data: initialRows,
          total: serverTotal,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((task) => ({
                type: "Task" as const,
                id: task.id,
              })),
              { type: "Task" as const, id: "LIST" },
            ]
          : [{ type: "Task" as const, id: "LIST" }],
    }),

    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    createTask: builder.mutation<Task, CreateTaskInput>({
      query: (task) => {
        const now = new Date().toISOString();
        return {
          url: "/tasks",
          method: "POST",
          body: {
            ...task,
            createdAt: now,
            updatedAt: now,
          },
        };
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskInput }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    updateTaskStatus: builder.mutation<
      Task,
      { id: string; data: UpdateTaskStatusInput }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // tags
    getTags: builder.query<Tag[], void>({
      query: () => "/tags",
      providesTags: [{ type: "Tag", id: "LIST" }],
    }),

    createTag: builder.mutation<Tag, string>({
      query: (name) => ({
        url: "/tags",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }],
    }),
  }),
});
export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetTagsQuery,
  useCreateTagMutation,
} = baseApi;
