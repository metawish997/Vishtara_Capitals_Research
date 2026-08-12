import api from './api';

const mediaService = {
    upload: async (file, category = null) => {
        const formData = new FormData();
        formData.append('files', file);
        if (category) formData.append('category', category);

        const response = await api.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

export default mediaService;
