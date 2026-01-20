export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
    constructor(public message: string, public status: number, public code?: string) {
        super(message);
        this.name = "ApiError";
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = "An error occurred";
        let errorCode = "UNKNOWN_ERROR";
        try {
            const errorData = await response.json();
            if (errorData.error) {
                errorMessage = errorData.error.message || errorMessage;
                errorCode = errorData.error.code || errorCode;
            }
        } catch {
            // If parsing JSON fails, fallback to status text
            errorMessage = response.statusText;
        }
        throw new ApiError(errorMessage, response.status, errorCode);
    }
    const data = await response.json();
    return data.data; // API returns { status: 'success', data: ... }
}

export const api = {
    auth: {
        signup: async (email: string, password: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/platform/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            return handleResponse(res);
        },
        login: async (email: string, password: string): Promise<{ access_token: string; expires_in: number }> => {
            const res = await fetch(`${API_BASE_URL}/platform/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            return handleResponse(res);
        },
    },
    projects: {
        create: async (name: string, token: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });
            return handleResponse(res);
        },
        list: async (token: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/projects`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return handleResponse(res);
        },
        get: async (id: string, token: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return handleResponse(res);
        },
        delete: async (id: string, token: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return handleResponse(res);
        },
        getUsers: async (id: string, token: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/projects/${id}/users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return handleResponse(res);
        }
    },
};
