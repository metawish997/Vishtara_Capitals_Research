import api from './api';

const employeeService = {
    getEmployees: async (params) => {
        const response = await api.get('/employees', { params });
        return response.data;
    },
    getEmployee: async (id) => {
        const response = await api.get(`/employees/${id}`);
        return response.data;
    },
    createEmployee: async (formData) => {
        const response = await api.post('/employees', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    updateEmployee: async (id, formData) => {
        const response = await api.put(`/employees/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    changeEmployeeStatus: async (id, status) => {
        const response = await api.patch(`/employees/${id}/status`, { status });
        return response.data;
    },
    deleteEmployee: async (id) => {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    }
};

export default employeeService;
