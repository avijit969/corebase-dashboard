export interface ProjectDetails {
    id: string;
    status: string;
    meta: {
        name: string;
        owner_id: string;
        created_at: string;
    };
    tables: Array<{ name: string }>;
}

export interface ProjectUser {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at: string;
}
