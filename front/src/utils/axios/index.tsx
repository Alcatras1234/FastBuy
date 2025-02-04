import axios from "axios";

// Create an axios instance with default configurations
export const instance = axios.create({
    baseURL: "http://45.145.4.240:8080", // Use your backend API URL
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

// Register user
// ТУТ Я МЕНЯЛ, ДОБАВИЛ В ПАРАМЕТРАХ РОЛЬ
export const registerUser = async (email: string, password: string, role: string) => {
    try {
        const response = await instance.post('/api/auth_service/registration', { email, password, role});
        console.log("Отправленные данные:", { email, password });
        console.log("Ответ сервера:", response.data);
        return response.data;
    } catch (error) {
        throw new Error("Ошибка при регистрации пользователя");
    }
};

// Verify email
export const verifyEmailCode = async (verificationCode: string) => {
    try {
        const response = await instance.post('/api/auth_service/registration', { code: verificationCode });
        return response.data;
    } catch (error) {
        throw new Error("Ошибка верификации");
    }
};

// Login user
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await instance.post('/api/auth_service/auth', { email, password });
        return response.data; // Assuming tokens are returned
    } catch (error) {
        throw new Error("Ошибка при авторизации");
    }
};

// Register organizer
// ТУТ Я ТОЖЕ ИЗМЕНИЛ ПАРАМЕТРЫ, ДОБАВИВ РОЛЬ, ЕЕ НАДО ОТПАРВЛЯТЬ
export const registerOrganizer = async (email: string, password: string, role: string) => {
    try {
        const response = await instance.post('/api/auth_service/registration', { email, password, role });
        return response.data;
    } catch (error) {
        throw new Error("Ошибка при регистрации организатора");
    }
};