import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3500'
});

axiosInstance.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        if (auth && auth.accessToken) {
            console.log('Authorization Header:', `Bearer ${auth.accessToken}`); // Debugging
            config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        } else {
            console.log("No token available"); // debugging
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;