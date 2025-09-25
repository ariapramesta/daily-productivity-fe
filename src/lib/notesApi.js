import api from "./axios";

// Get All Notes
export const getNotes = async ({ page = 1, limit = 10, search = "", sortOrder = "desc" } = {}) => {
    const res = await api.get("/notes", {
        params: { page, limit, search, sortOrder },
        withCredentials: true,
    });

    return res.data;
};

// Get Single Note
export async function getNote(id) {
    const res = await api.get(`/notes/${id}`, { withCredentials: true });
    return res.data;
}

// Create Note
export async function createNote(title, content) {
    const res = await api.post(
        "/notes",
        { title, content },
        { withCredentials: true }
    );
    return res.data;
}

// Update Note
export async function updateNote(id, { title, content }) {
    const res = await api.put(
        `/notes/${id}`,
        { title, content },
        { withCredentials: true }
    );
    return res.data;
}

// Delete Note
export async function deleteNote(id) {
    const res = await api.delete(`/notes/${id}`, { withCredentials: true });
    return res.data;
}
