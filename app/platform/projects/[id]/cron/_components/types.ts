export interface CronJob {
    id: string;
    name: string;
    description?: string;
    cron_expression: string;
    url: string;
    method: string;
    max_retry_count?: number;
    timeout_ms?: number;
    is_active: number | boolean;
    created_at?: string;
}

export interface CronExecution {
    id: string;
    cron_id: string;
    status: string;
    http_status_code: number;
    response_body: string;
    error_message: string;
    execution_time: number;
    attempt: number;
    created_at: string;
}
