# Makeup Muse Backend (Express + PostgreSQL)

This is the **backend** for the Makeup Muse fullstack application. It provides RESTful APIs for user authentication, content creation, chat messaging, likes, searching, and admin management.

## Tech Stack

- Node.js + Express
- PostgreSQL (via `pg`)
- Middleware: `cors`, `dotenv`, `morgan`
- Auth0 (for authentication & role-based access)

## Getting Started

```bash
# Install dependencies
cd backend
npm install

# Create a PostgreSQL database (makeup_muse)
# Start PostgreSQL and apply schema
psql -d makeup_muse -f schema.sql

# Run the server
node server.js
```

## Project Structure

```
backend/
├── Routes/
│   ├── Auth.js          # Signup & login
│   ├── Users.js         # User management
│   ├── Content.js       # Content creation & saving
│   ├── Likes.js         # Likes system
│   ├── Chat.js          # Real-time messaging
│   ├── Search.js        # Search functionality
├── Middleware/
│   └── AdminAuth.js     # Role-based route protection
├── db.js                # PostgreSQL client config
├── schema.sql           # Database schema
├── server.js            # Entry point
├── .env                 # Environment config
└── .env.sample          # Sample .env file
```

## API Endpoints

Base URL: `http://localhost:5000`

### Auth Routes

**Base:** `/api/auth`

| Method | Endpoint   | Description             |
|--------|------------|-------------------------|
| POST   | `/signup`  | Register new user       |
| POST   | `/signin`  | Login existing user     |

**Example Request:**

```json
POST /api/auth/signup
{
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

---

### User Routes

**Base:** `/api/users`

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | `/all_users`          | Get all users                    |
| PUT    | `/update/:id`         | Update profile info              |
| DELETE | `/:id`                | Delete user (admin only)         |

---

### Content Routes

**Base:** `/api/content`

| Method | Endpoint                      | Description                    |
|--------|-------------------------------|--------------------------------|
| GET    | `/all_content`                | Get all content                |
| GET    | `/user/:id`                   | Get content by user ID         |
| POST   | `/create`                     | Add new content                |
| DELETE | `/:id`                        | Delete content                 |
| POST   | `/save`                       | Save content to user profile   |
| GET    | `/saved/:userId`              | Get saved content              |

---

### Likes Routes

**Base:** `/api/likes`

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/like`          | Like a content item |
| DELETE | `/unlike`        | Unlike a content    |

---

### Chat Routes

**Base:** `/api/chat`

| Method | Endpoint                              | Description                              |
|--------|---------------------------------------|------------------------------------------|
| GET    | `/partners/:id`                       | Get users current user chatted with      |
| GET    | `/:senderId/:receiverId`              | Get chat messages                        |
| POST   | `/send`                               | Send a new message                       |

---

### Search Route

**Base:** `/api/search`

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/all?query=...` | Search users and content  |

---

## Admin Middleware

Some routes are protected via an `x-role: admin` header. You must send:

```json
{
  "x-role": "admin"
}
```

---

## Environment Variables

In your `.env` file, include:

```
PORT=5000
DATABASE_URL=postgres://<user>:<password>@localhost:5432/makeup_muse
```

---

## Database Schema

The `schema.sql` file defines:

- `users` table (with roles)
- `content` table
- `saved_content` table (many-to-many)
- `chat` table
- `likes` table

---

## Notes

- All routes return JSON
- Uses CORS, Morgan for logging
- Secured via Auth0 JWT validation

> GitHub Repository: [Backend](https://github.com/rahafmassad/backend.git)
