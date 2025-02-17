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
        if(error.response.status === 400){
            throw new Error("Вы уже зарегистрированы")
        }else {
            throw new Error("Ошибка при регистрации пользователя");
        }
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

export const submitOrganizerCorpInfo = async (corpName: string, phoneNumber: string, email: string) => {
    try {
        const response = await instance.post('/api/organizer_service/register', { corpName, phoneNumber, email });
        console.log("📨 Корпоративные данные отправлены:", { corpName, phoneNumber, email });
        return response.data;
    } catch (error) {
        throw new Error("Ошибка при отправке корпоративных данных");
    }
};

// Получение списка заявок организаторов
export const fetchPendingOrganizers = async () => {
    try {
        const response = await instance.get('/api/admin_service/pending_organizers');
        return response.data;
    } catch (error) {
        throw new Error("Ошибка загрузки заявок");
    }
};

// Подтверждение организатора
export const approveOrganizer = async (organizerId: string) => {
    try {
        await instance.post('/api/admin_service/approve_organizer', { organizerId });
        console.log("✅ Организатор одобрен:", organizerId);
    } catch (error) {
        throw new Error("Ошибка подтверждения организатора");
    }
};

// Отклонение организатора
export const rejectOrganizer = async (organizerId: string) => {
    try {
        await instance.post('/api/admin_service/reject_organizer', { organizerId });
        console.log("❌ Организатор отклонен:", organizerId);
    } catch (error) {
        throw new Error("Ошибка отклонения организатора");
    }
};

export const checkEmailVerification = async (email: string) => {
    try {
        const response = await instance.get(`/api/auth_service/email?email=${email}`);
        return response.data;
    }catch (error){
        throw new Error("Ошибка валидации");
    }
}




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


// получить профиль организатора
export const fetchOrganizerProfile = async () => {
    try {
        const response = await instance.get("/api/organizer_service/profile");
        return response.data;  
    } catch (error) {
        throw new Error("Ошибка при загрузке профиля организатора");
    }
};

// обновить профиль организатора
export const updateOrganizerProfile = async (updatedData) => {
    try {
        const response = await instance.put("/api/organizer_service/profile", updatedData);
        return response.data;
    } catch (error) {
        throw new Error("Ошибка при обновлении данных");
    }
};