export interface ProjectDetails {
    id: string;
    status: string;
    api_key?: string; // Added for DB access
    apiKey?: string; // Possible camelCase variant
    meta: {
        name: string;
        owner_id: string;
        created_at: string;
        api_key?: string; // Possible location
        apiKey?: string; // Possible location
        [key: string]: any;
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

export interface TableColumn {
    name: string;
    type: string;
    primary?: boolean;
    autoIncrement?: boolean;
    notNull?: boolean;
    default?: any;
    references?: {
        table: string;
        column: string;
        onDelete?: string;
    };
}

export interface TableIndex {
    columns: string[];
}

export interface TableRLS {
    select?: string;
    insert?: string;
    update?: string;
    delete?: string;
}

export interface TableSchema {
    table: string;
    columns: TableColumn[];
    indexes?: TableIndex[];
    rls?: TableRLS;
}
