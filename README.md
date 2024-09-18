<p align="center">
  <img src="read_me_images/Photo_Contest_banner.png" alt="MBanner">
</p>
<p align="center">
A platform for organizing and joining online photo contests with user roles, rankings.
</p>

Getting Started Guide
---
## *Prerequisites*

Before you begin, ensure you have the following installed:

- **Node.js** and **npm** (for the React frontend)
- **Java JDK** (for the Spring backend)
- **PostgreSQL** (for the database)

---

## **Setup Instructions**

### **1. Clone the Repository**

Open your terminal and run:
```bash
git clone https://github.com/DNS-CodeForge/PhotoContestWebApp
cd PhotoContestWebApp
```
## Set Up the Database

1. Create a PostgreSQL database using the provided SQL scripts:

   - `create_db.sql`: Sets up the database schema.
   - `populate_db.sql`: Seeds the database with initial data.

## Backend Setup (Spring Boot)

1. Update `application.properties` to configure your PostgreSQL connection.

2. Start the Spring application (default port: 8080):

    ```bash
    ./mvnw spring-boot:run
    ```

## Frontend Setup (React)

1. Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the React development server (default port: 5173):

    ```bash
    npm run dev
    ```
## Access the Application

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Swagger Documentation: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
  
## Key Features

### Public Access (No Authentication Required)
- **Landing Page**: Displays the latest winning photos to attract new users.
- **Login**: Authenticated access for existing users.
- **Register**: Allows users to sign up as Photo Junkies.

### Private Access (Authenticated Users Only)
- **Dashboard**:
  - **Organizers**: Can create and manage contests, track contest phases, and manage participants.
  - **Photo Junkies**: Can view open contests, track their participation, and see their points and ranking.

- **Contest Page**:
  - **Phase I**: Participants can upload one photo, with a title and story. Jury can view but not rate photos.
  - **Phase II**: Jury can score and comment on photos. Participants can no longer upload.
  - **Finished**: Participants can view scores, comments, and other participants' submissions.

### Contest Creation (Organizers Only)
- Title, category, and contest type (open or invitational).
- Set time limits for phases and select jurors.
- Optional cover photo (upload, URL, or choose from existing).

### Scoring and Ranking System
- **Points**: Awarded for participation and placement (1st, 2nd, 3rd).
- **Ranking Levels**: Junkie, Enthusiast, Master, and Wise Photo Dictator.

### REST API
- Full support for managing users, contests, and photos.
- CRUD operations, filtering, and photo submissions/rating.
- Documented using Swagger.
