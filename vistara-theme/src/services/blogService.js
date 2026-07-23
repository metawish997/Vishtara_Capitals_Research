import api from './api';

const blogService = {
    // --- Blog Categories ---
    getCategories: async () => {
        const response = await api.get('/blogs/categories');
        return response.data;
    },
    createCategory: async (data) => {
        const response = await api.post('/blogs/categories', data);
        return response.data;
    },
    updateCategory: async (id, data) => {
        const response = await api.put(`/blogs/categories/${id}`, data);
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await api.delete(`/blogs/categories/${id}`);
        return response.data;
    },
    updateCategoryStatus: async (id, status) => {
        const response = await api.put(`/blogs/categories/${id}/status`, { status });
        return response.data;
    },

    // --- Blogs ---
    getBlogs: async () => {
        const response = await api.get('/blogs');
        return response.data;
    },
    getBlogBySlug: async (slug) => {
        const response = await api.get(`/blogs/slug/${slug}`);
        return response.data;
    },
    createBlog: async (data) => {
        const response = await api.post('/blogs', data);
        return response.data;
    },
    updateBlog: async (id, data) => {
        const response = await api.put(`/blogs/${id}`, data);
        return response.data;
    },
    deleteBlog: async (id) => {
        const response = await api.delete(`/blogs/${id}`);
        return response.data;
    },
    updateBlogStatus: async (id, status) => {
        const response = await api.put(`/blogs/${id}/status`, { status });
        return response.data;
    }
};

export default blogService;
