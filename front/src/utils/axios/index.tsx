import axios from "axios";
import {useNavigate} from "react-router-dom";

// Create an axios instance with default configurations
export const instance = axios.create({
    baseURL: "http://45.145.4.240:8080", // Use your backend API URL
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' }
});

// Register user
// ТУТ Я МЕНЯЛ, ДОБАВИЛ В ПАРАМЕТРАХ РОЛЬ
export const registerUser = async (email: string, password: string, role: string) => {
    try {
        console.log("Данные отправляются")
        const response = await instance.post('/api/auth_service/registration', { email, password, role});
        console.log("Отправленные данные:", { email, password });
        console.log("Ответ сервера:", response);
        return response;
    } catch (error) {
        console.error("❌ Ошибка при регистрации пользователя:", error);

        if (error.response) {
            // Если сервер ответил с ошибкой (например, 400 или 500)
            if (error.response.status === 400) {
                throw new Error("Вы уже зарегистрированы");
            } else {
                throw new Error(`Ошибка при регистрации: ${error.response.data?.message || "Неизвестная ошибка"}`);
            }
        } else if (error.request) {
            // Сервер не ответил (например, сервер выключен)
            throw new Error("Сервер не отвечает. Попробуйте позже.");
        } else {
            // Ошибка на стороне клиента (например, неверный код)
            throw new Error(`Ошибка: ${error.message}`);
        }
    }
};

// Login user
export const loginUser = async (email: string, password: string) => {
    try {
        console.log(email, password);
        const response = await instance.post('/api/auth_service/auth', { email, password });
        return response.data;
        console.log(response.data)// Assuming tokens are returned
    } catch (error) {
        throw new Error("Ошибка при авторизации");
    }
};

export const loginAdmin = async (email: string, password: string) => {
    try {
        const response = await instance.post('/api/auth_service/auth/admin', { email, password});
        return response.data; // Assuming tokens are returned
    } catch (error) {
        throw new Error("Ошибка при авторизации");
    }
};

// Register organizer
// ТУТ Я ТОЖЕ ИЗМЕНИЛ ПАРАМЕТРЫ, ДОБАВИВ РОЛЬ, ЕЕ НАДО ОТПАРВЛЯТЬ

export const submitOrganizerCorpInfo = async ( email: string, companyName: string, contactNumber: string) => {
    try {
        console.log("Starting")
        console.log("📨 Корпоративные данные отправлены:", { email, companyName, contactNumber});
        const response = await instance.post('/api/organizer_service/organizator', { email, companyName, contactNumber});
        console.log("vse ok")
        return response;
    } catch (error) {
        console.error("❌ Ошибка при отправке корпоративных данных:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Ошибка при отправке корпоративных данных");
    }
};

// Получение списка заявок организаторов

export const fetchPendingOrganizers = async (page: number, count: number) => {
    try {
        const response = await instance.get("/api/organizer_service/organizator/data/unprroved", { page, count});
        const data = response.data;
        console.log(data)

        if (!Array.isArray(data)) {
            throw new Error("Некорректный формат данных от сервера");
        }

        return data.map((item) => ({
            email: item.user?.email || "Нет данных",
            corpName: item.companyName || "Нет данных",
            phoneNumber: item.contactNumber || "Нет данных",
        }));
    } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
        return [];
    }
};

export const fetchApprovedOrganizers = async (page: number, count: number) => {
    try {
        const response = await instance.get("/api/organizer_service/organizator/data/approved", { page, count});
        const data = response.data;
        console.log(data)

        if (!Array.isArray(data)) {
            throw new Error("Некорректный формат данных от сервера");
        }

        return data.map((item) => ({
            email: item.user?.email || "Нет данных",
            corpName: item.companyName || "Нет данных",
            phoneNumber: item.contactNumber || "Нет данных",
        }));
    } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
        return [];
    }
};

/*export const fetchRejectedOrganizers = async (page: number, count: number) => {
    try {
        const response = await instance.get("/auth/auth_service/organizator/data/unprroved", { page, count});
        const data = response.data;
        console.log(data)

        if (!Array.isArray(data)) {
            throw new Error("Некорректный формат данных от сервера");
        }

        return data.map((item) => ({
            email: item.user?.email || "Нет данных",
            corpName: item.companyName || "Нет данных",
            phoneNumber: item.contactNumber || "Нет данных",
        }));
    } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
        return [];
    }
};*/

// Подтверждение организатора
export const approveOrganizer = async (email: string) => {
    try {
        console.log("Отправка эмаила на одобрение", email);
        const response = await instance.patch('/api/organizer_service/organizator/data/approve', { email });
        console.log("✅ Организатор одобрен:", email);
        return response
    } catch (error) {
        console.log(error.message);
        throw new Error("Ошибка подтверждения организатора");
    }
};

// Отклонение организатора
export const rejectOrganizer = async (email: string) => {
    try {
        console.log("Отправка эмаила на отказ", email);
        const response = await instance.patch('/api/organizer_service/organizator/data/unpprove', {email});
        console.log("❌ Организатор отклонен:", email);
        return response;
    } catch (error) {
        console.log(error.response?.data);
        console.log(error.message);
        throw new Error("Ошибка отклонения организатора");
    }
};

export const checkEmailVerification = async (email: string) => {
    try {
        console.log(`🔍 Отправка запроса на проверку email: ${email}`);
        const response = await instance.get(`/api/auth_service/email?email=${email}`);
        console.log("✅ Ответ сервера:", response.status);
        return response;
    } catch (error) {
        console.error("❌ Ошибка проверки email:", error);
        throw new Error("Ошибка валидации");
    }
};

// отправить данные о созданом матче
export const createMatch = async (matchData) => {
    try {
        const response = await instance.post("/api/match_service/create", matchData);
        return response.data;
    } catch (error) {
        throw new Error("Ошибка при добавлении матча");
    }
};

// запросить данные о матчах
export const fetchOrganizerMatches = async () => {
    try {
        const response = await instance.get("/api/match_service/organizer_matches");
        return response.data;
    } catch (error) {
        throw new Error("Ошибка загрузки матчей");
    }
};

// обновить данные о матче
export const updateMatch = async (matchId: string, updatedData: any) => {
    try {
        const response = await instance.put(`/api/match_service/matches/${matchId}`, updatedData);
        return response.data;
    } catch (error) {
        throw new Error("Ошибка при обновлении матча");
    }
};

// удалить матч
export const deleteMatch = async (matchId: string) => {
    try {
        await instance.delete(`/api/match_service/matches/${matchId}`);
        console.log(`Матч ${matchId} успешно удален`);
    } catch (error) {
        throw new Error("Ошибка при удалении матча");
    }
};


const hardcodedToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJka2ltLnNwYkBnbWFpbC5jb20iLCJyb2xlIjoiT1JHQU5JWkVSIiwiaWF0IjoxNzM5OTE1MTQ4LCJleHAiOjE3Mzk5MTg3NDh9.VJ5ZrOIA63u1x0OkI0leHpA-t2bPmgybxY4yyn12cXg";
export const fetchOrganizerProfile = async () => {
    try {
        // ✅ Add token inside the URL as a query parameter
        const response = await instance.get(`/api/organizer_service/profile?token=${hardcodedToken}`);

        return response.data; // ✅ Return the backend response
    } catch (error) {
        console.error("Ошибка при загрузке профиля организатора:", error);
        throw new Error("Ошибка при загрузке профиля организатора.");
    }
};


export const updateOrganizerProfile = async (updatedData) => {
    try {
        // ✅ Extract only the required fields
        const { companyName, contactPhone, bankAccount } = updatedData;

        const requestData = {
            token: hardcodedToken,
            companyName,
            contactPhone,
            bankAccount,
        };

        //console.log("Отправляемые данные:", requestData); // ✅ Debugging output for request data

        // ✅ Send PUT request with the filtered JSON body
        const response = await instance.put("/api/organizer_service/profile/data", requestData);

        //console.log("Ответ сервера:", response.data); // ✅ Debugging: Log backend response
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении профиля организатора:", error.response || error);
        throw new Error("Ошибка при обновлении данных.");
    }
};