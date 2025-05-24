# NestJS Homework Application

## Prerequisites

- Node.js (v18 or above)
- npm (v9 or above)
- Docker & Docker Compose (for running Postgres and Redis)

### Required npm Packages
Install all dependencies with:

    npm install

Or, if you need to install manually:

    npm install @nestjs/cache-manager @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/swagger @nestjs/typeorm cache-manager-ioredis json-rules-engine pg reflect-metadata rxjs swagger-ui-express typeorm

## Steps to Run the Application

1. **Clone the repository:**
    ```cmd
    git clone <repo-url>
    cd nestjs-homework
    ```

2. **Install dependencies:**
    ```cmd
    npm install
    ```

3. **Start Postgres and Redis using Docker Compose:**
    ```cmd
    docker-compose up -d
    ```

4. **Start the NestJS application:**
    - For development (auto-reload):
      ```cmd
      npm run start:dev
      ```
    - For production:
      ```cmd
      npm run build
      npm run start:prod
      ```

## Steps to Update Data into the Database

1. **Ensure the database containers are running:**
    ```cmd
    docker-compose up -d
    ```

2. **Drop and recreate tables if you changed entity columns:**
    - Use your database GUI (e.g., pgAdmin, DBeaver) to drop the affected tables (e.g., `company_stock`, `company_financials`).
    - Restart the NestJS app to let TypeORM recreate the tables.

3. **Import sample data:**
    - Copy the sample data file into the Postgres container:
      ```cmd
      docker cp sample-data.sql nestjs-homework-postgres-1:/sample-data.sql
      ```
    - Run the import inside the Postgres container:
      ```cmd
      docker exec -i nestjs-homework-postgres-1 psql -U postgres -d nestdb -f /sample-data.sql
      ```
    - (Replace `nestjs-homework-postgres-1` with your actual Postgres container name if different.)

---

For any issues, ensure your entity files and SQL column names match, and restart the app after schema changes.