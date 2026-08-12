import api from './api';

const userService = {
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getUser: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    }
};

export default userService;
