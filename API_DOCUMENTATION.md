# API Documentation

## Overview

This API Gateway provides a Backend-as-a-Service (BaaS) platform. It supports two levels of operations:
1.  **Platform Level**: For developers/admins to manage projects (Create projects, get API keys).
2.  **Project Level**: For end-users and applications within a specific project (Auth, DB, Storage).

## Base URL

All routes are prefixed with `/v1`.

### Authentication

There are two types of authentication:

1.  **Platform Authorization (`Authorization: Bearer <token>`)**
    *   Used for managing projects and platform-level resources.
    *   Obtained via `/v1/platform/auth/token`.

2.  **Project Authorization (`x-api-key: <key>` or `Authorization: Bearer <user_token>`)**
    *   **`x-api-key`**: Used to identify the **Project Context**. Required for initializing interaction with a project (e.g., signing up a user, public data access).
    *   **`Authorization: Bearer <token>`**: Used for **End-User Authentication** within a project. obtained via `/v1/auth/project/login`.

---

## 1. Platform Authentication
*Manage your developer account.*

### Register Developer
Create a new platform account.

*   **Endpoint**: `POST /v1/platform/auth/signup`
*   **Auth**: Public

**Request Body:**
```json
{
  "email": "dev@example.com",
  "password": "secureValues123"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_...",
      "email": "dev@example.com"
    }
  }
}
```

### Platform Login
Login to get a Platform Access Token.

*   **Endpoint**: `POST /v1/platform/auth/token`
*   **Auth**: Public

**Request Body:**
```json
{
  "email": "dev@example.com",
  "password": "secureValues123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOi...",
    "expires_in": 3600
  }
}
```

---

## 2. Project Management
*Create and manage your projects. Requires Platform Token.*

### Create Project
Provisions a new project, database, and API Key.

*   **Endpoint**: `POST /v1/projects`
*   **Auth**: `Authorization: Bearer <platform_token>`

**Request Body:**
```json
{
  "name": "My Cool App"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "proj_...",
    "name": "My Cool App",
    "api_key": "pk_...",
    "message": "Project created and database created"
  }
}
```
*Save the `api_key`! It is needed for all Project Level interactions.*

### List All Projects
Get a list of all projects owned by the authenticated developer.

*   **Endpoint**: `GET /v1/projects`
*   **Auth**: `Authorization: Bearer <platform_token>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "proj_...",
      "ownerId": "user_...",
      "name": "My Cool App",
      "createdAt": "..."
    }
  ]
}
```

### Get Project Details
*   **Endpoint**: `GET /v1/projects/:id`
*   **Auth**: `Authorization: Bearer <platform_token>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "proj_...",
    "status": "active",
    "meta": {
      "name": "My Cool App",
      "owner_id": "...",
      "created_at": "..."
    },
    "tables": [
      {
        "name": "My Table"
      }
    ]
  }
}
```

### Update Project
Update a project's details (e.g., name).

*   **Endpoint**: `PUT /v1/projects/:id`
*   **Auth**: `Authorization: Bearer <platform_token>`

**Request Body:**
```json
{
  "name": "Updated App Name"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "proj_...",
    "name": "Updated App Name",
    "ownerId": "..."
  }
}
```

### Delete Project
Permanently delete a project and its resources.

*   **Endpoint**: `DELETE /v1/projects/:id`
*   **Auth**: `Authorization: Bearer <platform_token>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Project deleted successfully",
    "deletedProject": {
      "id": "proj_...",
      "name": "My Cool App"
    }
  }
}
```

### List Project Users
Get a list of all end-users registered to a specific project.

*   **Endpoint**: `GET /v1/projects/:id/users`
*   **Auth**: `Authorization: Bearer <platform_token>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "user_...",
        "email": "enduser@app.com",
        "name": "John Doe",
        "role": "user",
        "created_at": "..."
      }
    ]
  }
}
```

---

## 3. Project End-User Auth
*Authentication for users WITHIN a project.*
*Requires `x-api-key` header to identify the project.*

### Project User Signup
Register a user for your app.

*   **Endpoint**: `POST /v1/auth/project/signup`
*   **Headers**: `x-api-key: <project_api_key>`

**Request Body:**
```json
{
  "email": "user@app.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "user_...",
    "email": "user@app.com",
    "name": "John Doe",
    "role": "user",
    "message": "User registered successfully"
  }
}
```

### Project User Login
Login a user to get a User Session Token.

*   **Endpoint**: `POST /v1/auth/project/login`
*   **Headers**: `x-api-key: <project_api_key>`

**Request Body:**
```json
{
  "email": "user@app.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJ...",
    "expires_in": 604800,
    "user": {
      "id": "user_...",
      "email": "user@app.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "..."
    }
  }
}
```

### Get Current User
*   **Endpoint**: `GET /v1/auth/project/me`
*   **Headers**:
    *   `x-api-key`: `<project_api_key>`
    *   `Authorization`: `Bearer <user_session_token>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_...",
      "email": "user@app.com",
      "role": "user",
      "created_at": "..."
    }
  }
}
```


### Configure OAuth Providers
Set up Google and GitHub credentials for the project.
*   **Endpoint**: `POST /v1/auth/project/auth/config?projectId=<projectId>`
*   **Query Param**: `projectId` (Required)
*   **Auth**: `Authorization: Bearer <platform_token>` (Recommended)

**Request Body:**
```json
{
  "google_client_id": "...",
  "google_client_secret": "...",
  "github_client_id": "...",
  "github_client_secret": "..."
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Configuration updated successfully"
  }
}
```

### Get OAuth Configuration
Get the current OAuth credentials (masked).
*   **Endpoint**: `GET /v1/auth/project/auth/config?projectId=<projectId>`
*   **Query Param**: `projectId` (Required)
*   **Auth**: `Authorization: Bearer <platform_token>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "google_client_id": "...",
    "google_client_secret": "masked",
    "github_client_id": "...",
    "github_client_secret": "masked"
  }
}
```

### OAuth Login (Redirect)
Initiate OAuth login flow. Redirect the user to this URL.
*   **Endpoint**: `GET /v1/auth/project/auth/:provider?projectId=<projectId>`
*   **Providers**: `google`, `github`
*   **Query Param**: `projectId` (Required)

**Response:**
*   **302 Redirect**: Redirects to the provider's consent page.
*   **Cookies**: Sets `oauth_state`, `oauth_code_verifier` (PKCE) cookies.

### OAuth Callback
Handle the callback from the provider.
*   **Endpoint**: `GET /v1/auth/project/auth/:provider/callback`
*   **Query Params**: `code`, `state` (from provider)

**Response:**
*   **302 Redirect**: Redirects to the frontend application with tokens in URL fragment/query.
    *   Example: `/?access_token=...&refresh_token=...&user_id=...`

---

## 4. Database Schema Management
*Manage your project's database structure.*

### List All Tables
Get a list of all tables in the project database.

*   **Endpoint**: `GET /v1/db/tables`
*   **Headers**: `x-api-key: <project_api_key>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "tables": [
      {
        "name": "posts",
        "created_at": null
      },
      {
        "name": "users",
        "created_at": null
      }
    ]
  }
}
```

### Create Table
Create a new table with detailed schema definition.

*   **Endpoint**: `POST /v1/db/tables`
*   **Headers**: `x-api-key: <project_api_key>`

**Request Body:**
```json
{
  "table": "posts",
  "columns": [
    {
      "name": "id",
      "type": "integer",
      "primary": true,
      "autoIncrement": true
    },
    {
      "name": "title",
      "type": "text",
      "notNull": true
    },
    {
      "name": "user_id",
      "type": "text",
      "notNull": true,
      "references": {
        "table": "users",
        "column": "id",
        "onDelete": "cascade"
      }
    },
    {
      "name": "created_at",
      "type": "datetime",
      "default": "now"
    }
  ],
  "indexes": [
    { "columns": ["user_id"] }
  ],
  "rls": {
    "select": "user_id = auth.uid",
    "insert": "auth.role = 'authenticated'",
    "update": "user_id = auth.uid",
    "delete": "user_id = auth.uid"
  }
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "message": "Table 'posts' created successfully",
    "table": "posts",
    "columns": [...],
    "indexes": [...],
    "rls": {...}
  }
}
```

### Get Table Details
Get the full schema of a specific table.

*   **Endpoint**: `GET /v1/db/tables/:table`
*   **Headers**: `x-api-key: <project_api_key>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "table": "posts",
    "columns": [
      {
        "name": "id",
        "type": "integer",
        "primary": true,
        "notNull": false
      },
      {
        "name": "title",
        "type": "text",
        "notNull": true
      }
    ],
    "indexes": [
      { "columns": ["user_id"] }
    ],
    "rls": {
      "select": "true",
      "insert": "true",
      "update": "true",
      "delete": "true"
    }
  }
}
```

### Add Column
Add a new column to an existing table.

*   **Endpoint**: `POST /v1/db/tables/:table/columns`
*   **Headers**: `x-api-key: <project_api_key>`

**Request Body:**
```json
{
  "name": "status",
  "type": "text",
  "default": "draft"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Column 'status' added to table 'posts' successfully",
    "table": "posts",
    "column": {
      "name": "status",
      "type": "text",
      "default": "draft"
    }
  }
}
```

### Update Column (Rename)
Rename an existing column.

*   **Endpoint**: `PUT /v1/db/tables/:table/columns/:column`
*   **Headers**: `x-api-key: <project_api_key>`

**Request Body:**
```json
{
  "name": "new_column_name"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Column 'old_name' renamed to 'new_column_name' in table 'posts' successfully",
    "table": "posts",
    "column": { "name": "new_column_name" }
  }
}
```

### Delete Column
Remove a column from a table.

*   **Endpoint**: `DELETE /v1/db/tables/:table/columns/:column`
*   **Headers**: `x-api-key: <project_api_key>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Column 'status' deleted from table 'posts' successfully",
    "table": "posts",
    "column": "status"
  }
}
```

### Add Foreign Key
Add a foreign key constraint to an existing column.

*   **Endpoint**: `POST /v1/db/tables/:table/foreign-keys`
*   **Headers**: `x-api-key: <project_api_key>`

**Request Body:**
```json
{
  "column": "author_id",
  "references": {
    "table": "users",
    "column": "id",
    "onDelete": "cascade"
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Foreign key added to table 'posts' successfully",
    "table": "posts",
    "foreignKey": { ... }
  }
}
```

### Delete Table
Permanently delete a table.

*   **Endpoint**: `DELETE /v1/db/tables/:table`
*   **Headers**: `x-api-key: <project_api_key>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Table 'posts' deleted successfully",
    "table": "posts"
  }
}
```

---
## 5. Storage (Buckets & Files)
*Manage file uploads and logical buckets.*

### 1. Bucket Operations

#### Create Bucket
Create a new logical bucket to organize files.

*   **Endpoint**: `POST /v1/storage/buckets`
*   **Headers**: `x-api-key: <project_api_key>`

**Request Body:**
```json
{
  "name": "avatars",
  "public": true,
  "allowedMimeTypes": ["image/png", "image/jpeg"],
  "fileSizeLimit": 5242880
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "message": "Bucket created",
    "bucket": {
      "name": "avatars",
      "public": true
    }
  }
}
```

#### List Buckets
List all buckets in the project.

*   **Endpoint**: `GET /v1/storage/buckets`
*   **Headers**: `x-api-key: <project_api_key>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "buckets": [
      {
        "id": "avatars",
        "name": "avatars",
        "public": true,
        "created_at": "..."
      }
    ]
  }
}
```

#### Get Bucket Details
Get details of a specific bucket and its files.

*   **Endpoint**: `GET /v1/storage/buckets/:name`
*   **Headers**: `x-api-key: <project_api_key>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "bucket": { ... },
    "files": [ ... ]
  }
}
```

#### Delete Bucket
Delete a bucket. **Bucket must be empty.**

*   **Endpoint**: `DELETE /v1/storage/buckets/:name`
*   **Headers**: `x-api-key: <project_api_key>`

#### Empty Bucket
Remove all files from a bucket (Metadata only for now).

*   **Endpoint**: `POST /v1/storage/buckets/:name/empty`
*   **Headers**: `x-api-key: <project_api_key>`

---

### 2. File Operations (Upload Flow)

To upload a file into a bucket, follow this 2-step process.

#### Step 1: Get Signed URL
*   **Endpoint**: `POST /v1/storage/upload/sign`
*   **Headers**:
    *   `x-api-key`: `<project_api_key>`
    *   `Authorization`: `Bearer <user_token>`

**Request Body:**
```json
{
  "bucketName": "avatars", 
  "filename": "user_pic.png",
  "contentType": "image/png",
  "size": 10240
}
```
*Note: `bucketName` is now required.*

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "uploadUrl": "https://storage.example.com/...",
    "publicUrl": "https://pub-<id>.r2.dev/...",
    "key": "proj_.../avatars/...",
    "fileId": "file_...",
    "bucket": "avatars"
  }
}
```

#### Step 2: Upload File (PUT)
Use the `uploadUrl` from Step 1.

*   **Method**: `PUT`
*   **URL**: `<uploadUrl>`
*   **Headers**: 
    *   `Content-Type`: `<contentType>` (Must match Step 1)
*   **Body**: Binary File Content

#### List Files
List all files, optionally filtered by bucket.

*   **Endpoint**: `GET /v1/storage/files?bucket=avatars`
*   **Headers**: `x-api-key: <project_api_key>`

#### Delete File
Delete a specific file.

*   **Endpoint**: `DELETE /v1/storage/files/:id`
*   **Headers**: `x-api-key: <project_api_key>`


---

## 6. Data Operations
*Perform CRUD operations on table data.*
*Requires `x-api-key` header.*

### Insert Data
Insert one or more rows into a table.

*   **Endpoint**: `POST /v1/table_operation/insert/:table_name`
*   **Headers**: 
    *   `x-api-key`: `<project_api_key>`
    *   `Authorization`: `Bearer <user_token>` (If RLS requires auth)

**Request Body:**
*Can be a single object, an array of objects, or enclosed in a `values` key.*

```json
[
  {
    "title": "My First Post",
    "name":"Disha",
    "user_id": "user_123"
  },
  {
    "title": "Another Post",
    "name":"Disha",
    "user_id": "user_123"
  }
]
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "message": "Rows inserted successfully",
    "count": 2
  }
}
```

### Update Data
Update rows based on a condition.

*   **Endpoint**: `PUT /v1/table_operation/update/:table_name`
*   **Headers**: 
    *   `x-api-key`: `<project_api_key>`
    *   `Authorization`: `Bearer <user_token>`

**Request Body:**
```json
{
  "updates": {
    "title": "Updated Title",
    "name":"Updated Name"
  },
  "where": {
    "id": 1
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Rows updated successfully",
    "changes": 1
  }
}
```

### Delete Data
Delete rows based on a condition.

*   **Endpoint**: `DELETE /v1/table_operation/delete/:table_name`
*   **Headers**: 
    *   `x-api-key`: `<project_api_key>`
    *   `Authorization`: `Bearer <user_token>`

**Request Body:**
```json
{
  "where": {
    "id": 1
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Rows deleted successfully",
    "changes": 1
  }
}
```

### Select Data (Query)
Query data with filtering, sorting, and pagination.

*   **Endpoint**: `POST /v1/table_operation/select/:table_name`
*   **Headers**: 
    *   `x-api-key`: `<project_api_key>`
    *   `Authorization`: `Bearer <user_token>`

**Request Body (Optional):**
```json
{
  "columns": ["id", "title", "created_at"],
  "where": {
    "user_id": "user_123"
  },
  "sort": "created_at",
  "order": "DESC",
  "limit": 10,
  "page": 1
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "title": "My First Post",
        "created_at": "2024-03-20 10:00:00"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

## Error Response Format
All errors follow this format:

```json
{
  "status": "error",
  "error": {
    "message": "Description of the error",
    "code": "ERROR_CODE",
    "details": "..."
  }
}
```

---

## 7. Realtime (WebSocket)
*Subscribe to real-time database updates.*
*Requires `x-api-key` header to identify the project and initial Auth.*

### Connection

*   **Endpoint**: `/v1/realtime`
*   **Protocol**: WebSocket (WS/WSS)

#### Authentication
The WebSocket endpoint is protected by the application's global authentication and project middleware.
*   **Handshake**: The initial HTTP Upgrade request must pass the `authMiddleware`.
    *   **Headers**: `x-api-key: <project_api_key>`
    *   **Cookie** or **Authorization**: Valid session/token.

### Message Protocol

The communication uses JSON-encoded messages for both commands and data events.

#### Client Messages

**1. Subscribe**

Subscribe to a live query. You will immediately receive the current result set. Future updates are sent automatically whenever the target data changes.

```json
{
  "type": "subscribe",
  "id": "my-sub-001",
  "query": {
    "from": "products",
    "select": ["id", "name", "price", "category_id"],
    "where": {
      "price": { "lt": 100 }
    },
    "limit": 50,
    "join": [
      {
        "table": "categories",
        "on": { "products.category_id": "categories.id" },
        "select": ["name"]
      }
    ]
  }
}
```

*   **`id`**: A unique string identifier for this subscription (controlled by the client).
*   **`query`**: The query definition object (see below).

**2. Unsubscribe**

Stop receiving updates for a specific subscription.

```json
{
  "type": "unsubscribe",
  "id": "my-sub-001"
}
```

#### Server Messages

**Data Update**

Sent when a subscription is initialized or when a relevant database change is detected.

```json
{
  "type": "data",
  "id": "my-sub-001",
  "data": [
    {
      "id": 1,
      "name": "Widget A",
      "price": 99.99,
      "category_id": 10,
      "categories": {
        "name": "Widgets"
      }
    }
  ]
}
```

*   **`id`**: Matches the subscription ID provided by the client.
*   **`data`**: An array of result rows.

### Query Structure

The `query` object defines the shape of the data subscription.

| Field | Type | Description |
|-------|------|-------------|
| `from` | `string` | **Required**. The name of the primary table to query. |
| `select` | `string[]` \| `"*"` | Array of column names to retrieve. defaults to `*`. |
| `where` | `object` | Filter conditions (see below) implicitly ANDed. |
| `limit` | `number` | Maximum number of rows to return. |
| `orderBy`| `string` | Column name to sort by. |
| `order` | `"ASC"` \| `"DESC"` | Sort direction. |
| `join` | `array` | List of join definitions for related data. |

#### Filters (`where`)
The `where` clause supports exact matches and operator-based conditions.

*   **Equality**: `{ "status": "active" }`
*   **Operators**:
    *   `eq`: Equal `{ "id": { "eq": 5 } }`
    *   `gt`: Greater than `{ "score": { "gt": 80 } }`
    *   `lt`: Less than `{ "price": { "lt": 20 } }`
    *   `in`: In list `{ "status": { "in": ["pending", "processing"] } }`

#### Joins
Supports purely defined left joins to safe identifiers. Recursive joins are supported up to a max depth (default 3).

```typescript
interface QueryJoin {
    table: string;
    on: Record<string, string>; // e.g., { "table1.col": "table2.col" }
    select?: string[];
    join?: QueryJoin[];
}
```
