import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
});

axiosInstance.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem("auth");
        console.log("Raw localStorage auth:", auth); // Debugging
        if (auth) {
            try {
                const parsedAuth = JSON.parse(auth);
                if (parsedAuth.accessToken) {
                    console.log('Authorization Header:', `Bearer ${parsedAuth.accessToken}`);
                    config.headers["Authorization"] = `Bearer ${parsedAuth.accessToken}`;
                } else {
                    console.log("No accessToken in auth object");
                }
            } catch (error) {
                console.log("Error parsing auth from localStorage:", error);
            }
        } else {
            console.log("No token available in localStorage");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;