# Sistem de programare sesiuni de meditatii

Aplicație web pentru gestionarea sesiunilor de meditatii. Profesorul poate crea intervale orare disponibile, iar elevii se pot înscrie la sesiuni de 2 ore în grupuri de 2–4 persoane.

## Cerințe preliminare

- **Node.js v20** — [nodejs.org](https://nodejs.org)
- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

## Pași pentru pornirea proiectului

### 1. Pornește infrastructura (PostgreSQL + RabbitMQ)

```bash
docker compose up -d
```

### 2. Pornește backend-ul

```bash
cd backend
npm install
npm run start:dev
```

### 3. Pornește frontend-ul

```bash
cd frontend
npm install
npm run dev
```

## URL-uri

| Serviciu   | Adresă                                        |
|------------|-----------------------------------------------|
| Frontend   | [http://localhost:5173](http://localhost:5173) |
| Backend    | [http://localhost:3000](http://localhost:3000) |
| RabbitMQ   | [http://localhost:15672](http://localhost:15672) |

> Credențiale RabbitMQ: utilizator `tutoring`, parolă `tutoring`

## Oprirea proiectului
```bash
# Oprește backend-ul și frontend-ul
Ctrl+C în terminalele respective

# Oprește infrastructura Docker
docker compose down
```
