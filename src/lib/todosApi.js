import api from "./axios";

// Create Todo
export const createTodo = async (data) => {
    const res = await api.post("/", data);
    return res.data;
};

// Get Todos (search, pagination, sort)
export const getTodos = async ({ search = "", page = 1, limit = 10, sort = "desc" } = {}) => {
    const res = await api.get("/", {
        params: { search, page, limit, sort },
    });
    return res.data;
};

// Get Todo
export const getTodo = async (id) => {
    const res = await api.get(`/${id}`);
    return res.data;
};

// Update Todo
export const updateTodo = async (id, data) => {
    const res = await api.put(`/${id}`, data);
    return res.data;
};

// Delete Todo
export const deleteTodo = async (id) => {
    const res = await api.delete(`/${id}`);
    return res.data;
};

// Add Todo Item
export const addTodoItem = async (todoId, data) => {
    const res = await api.post(`/todos/${todoId}/items`, data);
    return res.data;
};

// Update Todo Item
export const updateTodoItem = async (todoId, itemId, data) => {
    const res = await api.put(`/todos/${todoId}/items/${itemId}`, data);
    return res.data;
};

// Delete Todo Item
export const deleteTodoItem = async (todoId, itemId) => {
    const res = await api.delete(`/todos/${todoId}/items/${itemId}`);
    return res.data;
};