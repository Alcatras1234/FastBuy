import axios from "axios";
import Cookies from "js-cookie";

// Create an axios instance with default configurations
export const instance = axios.create({
    baseURL: "http://localhost:8081", // Use your backend API URL
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' }
});

// ✅ Перехватываем запросы и подставляем `accessToken`
instance.interceptors.request.use(config => {
    const token = Cookies.get("acccessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Перехватываем ошибки и обновляем accessToken, если он истек
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если получили 401 Unauthorized и это первый повтор запроса
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get("refreshToken");
            if (!refreshToken) {
                console.log("⛔ Нет refreshToken, пользователь должен войти заново.");
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                return Promise.reject(error);
            }

            try {
                console.log("🔄 Попытка обновления `accessToken`...");
                const response = await axios.post("http://localhost:8081/api/auth_service/refresh", {
                    refreshToken,
                });

                const newAccessToken = response.data.accessToken;
                console.log("✅ Новый accessToken получен:", newAccessToken);
                
                Cookies.set("accessToken", newAccessToken, { expires: 7 });

                // ❗ Повторяем запрос с новым токеном
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                console.error("⛔ Ошибка при обновлении токена:", refreshError);
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);



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
        console.log("📡 Отправка запроса на авторизацию:", email, password);

        const response = await instance.post('/api/auth_service/auth', { email, password });
        //console.log("✅ Ответ сервера (авторизация):", response.data);

        const { accessToken, refreshToken, role, email: serverEmail} = response.data;
        if (!accessToken || !refreshToken) {
            console.error("⛔ Сервер не вернул токены!", response.data);
            throw new Error("Ошибка: сервер не вернул `accessToken` или `refreshToken`");
        }

        console.log("💾 Сохраняем токены в Cookies...");
        Cookies.set("accessToken", accessToken, { expires: 7 }); // 7 дней (гарантируем выход из системы)
        Cookies.set("refreshToken", refreshToken, { expires: 30 }); // 30 дней для обновления

       // ✅ Сохраняем email, если пользователь организатор
        Cookies.set("Email", email, { expires: 7 });
        console.log("✅ Токены успешно сохранены!");

        return response;// Assuming tokens are returned
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
        const token = Cookies.get("accessToken"); 
        if (!token) throw new Error("Токен отсутствует, выполните вход");

        const requestBody = { token, ...matchData };

        console.log("📡 Отправка данных матча:", requestBody);

        const response = await instance.post("/api/organizer_service/match", requestBody);
        
        console.log("✅ Ответ сервера:", response.data);
        
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при добавлении матча:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Ошибка при добавлении матча");
    }
};


// запросить данные о матчах
export const fetchOrganizerMatches = async (page = 0, count = 10) => {
    try {
        const token = Cookies.get("accessToken");
        if (!token) throw new Error("Токен отсутствует, выполните вход.");
        
        console.log("📡 Загружаем матчи организатора...", { page, count });

        const response = await instance.get("/api/organizer_service/match/data", { 
            params: { token, page, count } // Добавили параметры
        });

        console.log("✅ Данные матчей:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка загрузки матчей:", error.response?.data || error.message);
        throw new Error("Ошибка загрузки матчей.");
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


//const hardcodedToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiZW1haWwiOiJka2ltLnNwYkBnbWFpbC5jb20iLCJyb2xlIjoiT1JHQU5JWkVSIiwiaWF0IjoxNzQwNjYzNDgyLCJleHAiOjE3NDA2NjcwODJ9.fI2WQJqDlmyecVCkDjRNV8mM6KJt3KKS7nB-IHXJDK4";
export const fetchOrganizerProfile = async () => {
    try {
        const token = Cookies.get("accessToken"); // ✅ Теперь берем токен из Cookies
        if (!token) throw new Error("Токен отсутствует, выполните вход.");

        // ✅ Add token inside the URL as a query parameter
        const response = await instance.get(`/api/organizer_service/profile?token=${token}`);

        return response.data; // ✅ Return the backend response
    } catch (error) {
        console.error("Ошибка при загрузке профиля организатора:", error);
        throw new Error("Ошибка при загрузке профиля организатора.");
    }
};


export const updateOrganizerProfile = async (updatedData) => {
    try {
        const token = Cookies.get("accessToken"); // ✅ Теперь берем токен из Cookies
        if (!token) throw new Error("Токен отсутствует, выполните вход.");

        // ✅ Extract only the required fields
        const { companyName, contactPhone, bankAccount } = updatedData;

        const requestData = {
            token: token,
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

export const fetchUsersMatches = async (page: number, count: number) => {
    try {
        const token = Cookies.get("token");
        if (!token) throw new Error("Токен отсутствует, выполните вход.");
        const response = await instance.get("/api/organizer_service/match/data", {
            params: { page, count },
            headers: { Authorization: `Bearer ${token}` }});
        const data = response.data;

        if (!Array.isArray(data)) {
            throw new Error("Некорректный формат данных от сервера");
        }

        return data.map((item) => ({
            id: item.id || "Нет данных",
            league: item.league || "Нет данных",
            scheduleDate: item.scheduleDate || "Нет данных",
            scheduleTimeLocal: item.scheduleTimeLocal || "Нет данных",
            stadiumName: item.stadiumName || "Нет данных",
            ticketsCount: item.ticketsCount || "Нет данных",
            ticketsPrice: item.ticketsPrice || "Нет данных",
            info: item.info || "Нет данных",
            teamHomeName: item.teamHomeName || "Нет данных",
            teamAwayName: item.teamAwayName || "Нет данных",
            photoUrl: item.photoUrl || "",
            /*organizer: item.organizer?.name ? `${item.organizer.name} ${item.organizer.surname}` : "Нет данных",*/
            status: item.status || "Нет данных",
            createdDateTime: item.createdDateTime || "Нет данных",
            updatedDateTime: item.updatedDateTime || "Нет данных",
        }));

    } catch (error) {
        throw new Error(error.message);
    }
}