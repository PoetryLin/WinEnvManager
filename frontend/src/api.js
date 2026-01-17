import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/api/variables';

export const getVariables = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const saveVariable = async (name, value, target) => {
    const response = await axios.post(API_URL, { name, value, target });
    return response.data;
};

export const deleteVariable = async (name, target) => {
    const response = await axios.delete(API_URL, { data: { name, target } });
    return response.data;
};
