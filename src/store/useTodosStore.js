"use client";
import { create } from "zustand";
import {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo,
    addTodoItem,
    updateTodoItem,
    deleteTodoItem,
} from "@/services/todosApi";

export const useTodoStore = create((set, get) => ({
    todos: [],
    selectedTodo: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },

    // Fetch all todos
    fetchTodos: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const res = await getTodos(params);
            set({
                todos: res.data,
                pagination: res.pagination,
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Fetch single todo
    fetchTodo: async (id) => {
        set({ loading: true, error: null });
        try {
            const todo = await getTodo(id);
            set({ selectedTodo: todo, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Create todo
    addTodo: async (data) => {
        try {
            const res = await createTodo(data);
            set({ todos: [res.todo, ...get().todos] });
            return res.todo;
        } catch (err) {
            set({ error: err.message });
        }
    },

    // Update todo
    editTodo: async (id, data) => {
        try {
            const res = await updateTodo(id, data);
            set({
                todos: get().todos.map((t) => (t.id === id ? res.todo : t)),
                selectedTodo:
                    get().selectedTodo && get().selectedTodo.id === id
                        ? res.todo
                        : get().selectedTodo,
            });
            return res.todo;
        } catch (err) {
            set({ error: err.message });
        }
    },

    // Delete todo
    removeTodo: async (id) => {
        try {
            await deleteTodo(id);
            set({ todos: get().todos.filter((t) => t.id !== id) });
            if (get().selectedTodo?.id === id) set({ selectedTodo: null });
        } catch (err) {
            set({ error: err.message });
        }
    },

    // ==============================
    //   Todo Items (nested in Todo)
    // ==============================

    // Add item to todo
    addItem: async (todoId, data) => {
        try {
            const res = await addTodoItem(todoId, data);
            set({
                todos: get().todos.map((t) =>
                    t.id === todoId ? { ...t, items: [...t.items, res.item] } : t
                ),
                selectedTodo:
                    get().selectedTodo?.id === todoId
                        ? { ...get().selectedTodo, items: [...get().selectedTodo.items, res.item] }
                        : get().selectedTodo,
            });
            return res.item;
        } catch (err) {
            set({ error: err.message });
        }
    },

    // Update item
    editItem: async (todoId, itemId, data) => {
        try {
            const res = await updateTodoItem(todoId, itemId, data);
            set({
                todos: get().todos.map((t) =>
                    t.id === todoId
                        ? { ...t, items: t.items.map((i) => (i.id === itemId ? res.item : i)) }
                        : t
                ),
                selectedTodo:
                    get().selectedTodo?.id === todoId
                        ? {
                            ...get().selectedTodo,
                            items: get().selectedTodo.items.map((i) =>
                                i.id === itemId ? res.item : i
                            ),
                        }
                        : get().selectedTodo,
            });
            return res.item;
        } catch (err) {
            set({ error: err.message });
        }
    },

    // Delete item
    removeItem: async (todoId, itemId) => {
        try {
            await deleteTodoItem(todoId, itemId);
            set({
                todos: get().todos.map((t) =>
                    t.id === todoId
                        ? { ...t, items: t.items.filter((i) => i.id !== itemId) }
                        : t
                ),
                selectedTodo:
                    get().selectedTodo?.id === todoId
                        ? {
                            ...get().selectedTodo,
                            items: get().selectedTodo.items.filter((i) => i.id !== itemId),
                        }
                        : get().selectedTodo,
            });
        } catch (err) {
            set({ error: err.message });
        }
    },
}));
