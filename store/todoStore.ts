import { create } from "zustand";
import { deleteApi, getApi, postApi, putApi } from "@/services/api";

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "done";
  createdAt: string;
  updatedAt: string;
};

type CreateTodoBody = {
  title: string;
  description?: string | null;
  status?: "pending" | "done";
};

type UpdateTodoBody = Partial<CreateTodoBody>;

type TodoState = {
  todos: Todo[];
  loading: boolean;
  error: string | null;

  fetchTodos: () => Promise<void>;
  addTodo: (body: CreateTodoBody) => Promise<void>;
  updateTodo: (id: string, body: UpdateTodoBody) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
};

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getApi<Todo[]>("/api/todos");
      set({ todos: data, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Hata", loading: false });
    }
  },

  addTodo: async (body) => {
    set({ loading: true, error: null });
    try {
      const created = await postApi<Todo, CreateTodoBody>("/api/todos", {
        title: body.title,
        description: body.description ?? null,
        status: body.status ?? "pending",
      });

      // state güncelle
      set((state) => ({ todos: [created, ...state.todos], loading: false }));
    } catch (e: any) {
      set({ error: e.message ?? "Hata", loading: false });
    }
  },

  updateTodo: async (id, body) => {
    set({ loading: true, error: null });
    try {
      const updated = await putApi<Todo, UpdateTodoBody>(`/api/todos/${id}`, body);

      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updated : t)),
        loading: false,
      }));
    } catch (e: any) {
      set({ error: e.message ?? "Hata", loading: false });
    }
  },

  deleteTodo: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteApi<{ ok: boolean }>(`/api/todos/${id}`);

      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (e: any) {
      set({ error: e.message ?? "Hata", loading: false });
    }
  },

  toggleStatus: async (id) => {
    const current = get().todos.find((t) => t.id === id);
    if (!current) return;

    const nextStatus = current.status === "pending" ? "done" : "pending";
    await get().updateTodo(id, { status: nextStatus });
  },
}));