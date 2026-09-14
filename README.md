# HIRENA

HIRENA is a full-stack recruitment platform that connects **job seekers, companies, and administrators** in one application.

## Features

- Candidate registration, authentication, and profile management
- CV upload and AI-powered CV analysis using **Google Gemini**
- Job creation, search, filtering, and applications
- Company and employer management
- Application status tracking
- Real-time in-app notifications using **WebSocket/STOMP**
- Email notifications using **Gmail SMTP**
- Event-driven application processing using **Apache Kafka**
- JWT authentication and role-based security
- PostgreSQL database
- Docker Compose setup

## Key Contributions

- Developed REST APIs using **Spring Boot, Spring MVC, and JPA**
- Implemented authentication and authorization using **JWT and Spring Security**
- Integrated **Google Gemini** for automated CV analysis
- Implemented asynchronous application processing with **Apache Kafka**
- Built real-time notifications using **WebSocket/STOMP**
- Integrated email notifications using **Spring Mail and Gmail SMTP**
- Developed the frontend using **React and Vite**
- Containerized the application using **Docker Compose**

## Architecture

```text
                    React Frontend
                          |
                   REST API and STOMP
                          |
                          v
                  Spring Boot Backend
                   /       |        \
                  /        |         \
                 v         v          v
          PostgreSQL     Kafka      WebSocket
                           |            |
                           |            v
                    +------+-----+     React
                    |      |     |
                 Gemini  Email  Notifications
```

## Application Screenshots

### Public and Authentication

| Home Page | Login |
|---|---|
| ![Home Page](docs/screenshots/home-page.png) | ![Login](docs/screenshots/login.png) |

| Home Page Alternate View | Job Search |
|---|---|
| ![Home Page Alternate View](docs/screenshots/home-page-alt.png) | ![Job Search](docs/screenshots/job-search.png) |

### Job Seeker

| Job Details | My Applications |
|---|---|
| ![Job Details](docs/screenshots/job-details.png) | ![My Applications](docs/screenshots/my-applications.png) |

| Notifications | Company Details |
|---|---|
| ![Notifications](docs/screenshots/notifications.png) | ![Company Details](docs/screenshots/company-details.png) |

### Company

| Company Dashboard | Job Details Dashboard |
|---|---|
| ![Company Dashboard](docs/screenshots/company-dashboard.png) | ![Job Details Dashboard](docs/screenshots/job-details-dashboard.png) |

| Applications by Job | Gemini CV Analysis |
|---|---|
| ![Applications by Job](docs/screenshots/company-applications-by-job.png) | ![Gemini CV Analysis](docs/screenshots/company-application-gemini-analysis.png) |

### Admin

| Admin Dashboard | Users |
|---|---|
| ![Admin Dashboard](docs/screenshots/admin-dashboard.png) | ![Admin Users](docs/screenshots/admin-users.png) |

| Admin Management |
|---|
| ![Admin Management](docs/screenshots/admin-management.png) |

## Technology Stack

### Frontend

- React
- Vite
- Axios
- React Router
- STOMP.js
- Nginx

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
- Docker
- Docker Compose

## Roles

- **Candidate** - search and apply for jobs, manage profile and CV
- **Company** - create jobs and manage applications
- **Admin** - manage users and platform data

## Repository Structure

```text
HIRENA/
├── hirena-backend/       # Spring Boot backend
├── hirena-frontend/      # React frontend
├── docs/screenshots/     # Application screenshots
├── docker-compose.yml    # Application infrastructure
├── .env.example          # Environment variable template
└── README.md
```

## Quick Start

### Prerequisites

- Docker Desktop
- Git

### Run with Docker

```powershell
git clone https://github.com/OmarAbdelmonem1/HIRENA.git
cd HIRENA
Copy-Item .env.example .env
docker compose up -d --build
```

Open the application:

```text
http://localhost:5173
```

To view the backend logs:

```powershell
docker compose logs -f backend
```

To stop the application without deleting database volumes:

```powershell
docker compose down
```

## License

This project is developed for **demonstration and portfolio purposes**.
