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
        me: async (token: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/platform/auth/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
            console.log(JSON.stringify(res, null, 2));
            return handleResponse(res);
        },
        get: async (id: string, token: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await handleResponse(res);
            console.log(`[API] GET /projects/${id} response:`, data);
            return data;
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
    db: {
        listTables: async (apiKey: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/db/tables`, {
                method: "GET",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        createTable: async (apiKey: string, schema: any): Promise<any> => {
            console.log(`[API] POST /db/tables request:`, schema, apiKey);
            const res = await fetch(`${API_BASE_URL}/db/tables`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(schema),
            });
            return handleResponse(res);
        },
        getTable: async (apiKey: string, tableName: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/db/tables/${tableName}`, {
                method: "GET",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        deleteTable: async (apiKey: string, tableName: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/db/tables/${tableName}`, {
                method: "DELETE",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        addColumn: async (apiKey: string, tableName: string, columnDef: any): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/db/tables/${tableName}/columns`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(columnDef),
            });
            return handleResponse(res);
        },
        updateColumn: async (apiKey: string, tableName: string, columnName: string, columnDef: any): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/db/tables/${tableName}/columns/${columnName}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(columnDef),
            });
            return handleResponse(res);
        },
        deleteColumn: async (apiKey: string, tableName: string, columnName: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/db/tables/${tableName}/columns/${columnName}`, {
                method: "DELETE",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        addForeignKey: async (apiKey: string, tableName: string, fkDef: any): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/db/tables/${tableName}/foreign-keys`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(fkDef),
            });
            return handleResponse(res);
        }
    },
    storage: {
        listBuckets: async (apiKey: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/storage/buckets`, {
                method: "GET",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        createBucket: async (apiKey: string, bucketDef: { name: string; public: boolean; allowedMimeTypes?: string[]; fileSizeLimit?: number }): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/storage/buckets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(bucketDef),
            });
            return handleResponse(res);
        },
        getBucket: async (apiKey: string, name: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/storage/buckets/${name}`, {
                method: "GET",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        deleteBucket: async (apiKey: string, name: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/storage/buckets/${name}`, {
                method: "DELETE",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        emptyBucket: async (apiKey: string, name: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/storage/buckets/${name}/empty`, {
                method: "POST",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        listFiles: async (apiKey: string, bucketName?: string): Promise<any> => {
            const url = bucketName
                ? `${API_BASE_URL}/storage/files?bucket=${bucketName}`
                : `${API_BASE_URL}/storage/files`;
            const res = await fetch(url, {
                method: "GET",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        },
        getUploadUrl: async (apiKey: string, fileData: { bucketName: string; filename: string; contentType: string; size: number }): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/storage/upload/sign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(fileData),
            });
            return handleResponse(res);
        },
        deleteFile: async (apiKey: string, fileId: string): Promise<any> => {
            const res = await fetch(`${API_BASE_URL}/storage/files/${fileId}`, {
                method: "DELETE",
                headers: { "x-api-key": apiKey },
            });
            return handleResponse(res);
        }
    }
};
