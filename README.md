# HIRENA

HIRENA is a full-stack recruitment platform that connects job seekers, companies, and administrators in one application.

## Features

- Candidate registration, authentication, and profile management
- CV upload and AI-powered CV analysis with Google Gemini
- Job creation, search, filtering, and applications
- Company and employer management
- Application status tracking
- In-app notifications with WebSocket/STOMP delivery
- Email notifications through Gmail SMTP
- Event-driven application processing with Apache Kafka
- PostgreSQL persistence
- JWT-based authentication and Spring Security
- Docker Compose setup for the complete local stack

## Technology Stack

### Frontend

- React
- Vite
- Axios
- React Router
- STOMP.js
- Nginx for the production container

### Backend

- Java 21
- Spring Boot 4
- Spring MVC
- Spring Data JPA / Hibernate
- Spring Security
- JWT
- Spring WebSocket
- Spring Kafka
- Spring Mail
- Maven

### Infrastructure

- PostgreSQL 16
- Apache Kafka 3.8
- Docker and Docker Compose

## Repository Structure

```text
HIRENA/
├── hirena-backend/       # Spring Boot API, WebSocket, email, Gemini, and Kafka consumers
├── hirena-frontend/      # React/Vite web application
├── docker-compose.yml    # Full local stack
├── .env.example          # Environment variable template
└── README.md
```

## Quick Start with Docker

### Prerequisites

- Docker Desktop
- Git

### 1. Clone the repository

```powershell
git clone https://github.com/OmarAbdelmonem1/HIRENA.git
cd HIRENA
```

### 2. Create the environment file

```powershell
Copy-Item .env.example .env
```

Open `.env` and set at least a strong `JWT_SECRET`. Gemini and email are optional during local development.

### 3. Start the complete application

```powershell
docker compose up -d --build
```

### 4. Open the application

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |
| Kafka | localhost:9092 |

### 5. Check service status and logs

```powershell
docker compose ps
docker compose logs -f backend
```

To stop the stack without deleting database data:

```powershell
docker compose down
```

To stop the stack and delete Docker volumes, including PostgreSQL data:

```powershell
docker compose down -v
```

> Do not use `down -v` if you need to keep the local database.

## Environment Variables

The application reads configuration from environment variables. See `.env.example` for the complete template.

| Variable | Required | Description |
|---|---:|---|
| `DB_NAME` | No | PostgreSQL database name |
| `DB_USERNAME` | No | PostgreSQL username |
| `DB_PASSWORD` | Yes for Docker | PostgreSQL password |
| `JWT_SECRET` | Yes | Secret used to sign JWTs |
| `JWT_EXPIRATION` | No | JWT expiration in milliseconds |
| `GEMINI_API_KEY` | No | Google Gemini API key for CV analysis |
| `MAIL_ENABLED` | No | Set to `true` to enable email notifications |
| `MAIL_USERNAME` | No | Gmail account used for SMTP |
| `MAIL_PASSWORD` | No | Gmail 16-character App Password |
| `MAIL_FROM` | No | Sender email address |
| `KAFKA_BOOTSTRAP_SERVERS` | No | Kafka connection string |
| `VITE_API_BASE_URL` | No | Backend URL used by the frontend |

Never commit `.env`, API keys, Gmail App Passwords, or production credentials.

## Kafka Application Flow

When a candidate creates an application:

```text
Application API
      |
      v
Save application in PostgreSQL
      |
      v
Publish ApplicationCreatedEvent
      |
      v
Kafka topic: application-created
      |
      +--> Gemini consumer       --> CV analysis
      |
      +--> Notification consumer --> Database + WebSocket
      |
      +--> Email consumer        --> Gmail SMTP
```

Each consumer uses a separate consumer group so every consumer receives the event:

```text
hirena-gemini-group
hirena-notification-group
hirena-email-group
```

Failed messages are retried and then sent to a dead-letter topic after the configured retry attempts.

## Running Without Docker

### Backend

Start PostgreSQL and Kafka, then run:

```powershell
cd hirena-backend
.\mvnw.cmd spring-boot:run
```

The backend uses `localhost:5432` for PostgreSQL and `localhost:9092` for Kafka by default.

### Frontend

```powershell
cd hirena-frontend
npm install
npm run dev
```

The development frontend is available at http://localhost:5173.

## Gmail Email Configuration

To enable email notifications:

1. Enable 2-Step Verification on the Gmail account.
2. Generate an App Password from Google Account → Security → App Passwords.
3. Put the 16-character App Password in `MAIL_PASSWORD`.
4. Set `MAIL_ENABLED=true`.

Do not use the normal Gmail account password.

## Testing

Backend package build:

```powershell
cd hirena-backend
.\mvnw.cmd -DskipTests package
```

Frontend build:

```powershell
cd hirena-frontend
npm run build
```

Frontend lint:

```powershell
npm run lint
```

## Data Persistence

The Docker Compose setup stores PostgreSQL data in the `hirena-postgres-data` volume and uploaded CV files in the `hirena-uploads` volume. Restarting containers does not delete these volumes.

For production deployments, use managed PostgreSQL/Kafka services, HTTPS, strong secrets, restricted CORS origins, and a secret manager.

## Reliability Note

Application events are published after the application transaction commits. This prevents events for rolled-back applications from reaching consumers. For strict guaranteed delivery between PostgreSQL and Kafka, a transactional outbox pattern is recommended as a future enhancement.

## License

This project is currently provided for demonstration and portfolio purposes.
