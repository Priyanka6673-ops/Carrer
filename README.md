# CareerCraft AI

This is a Next.js application built with Firebase Studio. It uses AI to provide career development tools like resume analysis, skill-gap identification, and mock interviews.

To get started with development, take a look at `src/app/page.tsx`.

## Deployment on a VM

To deploy this application on your own Virtual Machine (VM), follow these steps.

### 1. Prerequisites

Ensure your VM has the following installed:
- **Node.js**: Version 20.x or later.
- **npm** (or yarn/pnpm).
- **Firebase CLI**: `npm install -g firebase-tools`

### 2. Clone the Repository

Clone your project's code onto your VM.
```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 3. Install Dependencies

Install the necessary Node.js packages.
```bash
npm install
```

### 4. Set Up Environment Variables & Database

This project requires your Firebase project configuration to run. The configuration is stored in `src/firebase/config.ts`. Ensure this file contains the correct configuration for your Firebase project. For production, it's recommended to use environment variables, but the current setup will work by using this config file as a fallback.

**Important: Secure Your Database**
Your `firestore.rules` file defines the security for your database. You MUST deploy these rules to your Firebase project to protect your data.

1.  Log in to Firebase: `firebase login`
2.  Select your Firebase project: `firebase use <your-firebase-project-id>`
3.  Deploy the rules: `firebase deploy --only firestore:rules`

### 5. Build the Application

Create a production-ready build of your Next.js application.
```bash
npm run build
```
This command compiles the application into an optimized set of files in the `.next` directory.

### 6. Run the Application

Start the application server. By default, it runs on port 3000.
```bash
npm run start
```
Your application should now be running. You can test it by accessing `http://<your-vm-ip>:3000`.

### 7. (Recommended) Use a Process Manager

In a production environment, you should use a process manager to keep your application running continuously, even if it crashes or the server reboots. `pm2` is a popular choice for Node.js applications.

Install `pm2`:
```bash
npm install pm2 -g
```

Start your app with `pm2`:
```bash
pm2 start npm --name "careercraft-ai" -- run start
```

### 8. (Recommended) Set Up a Reverse Proxy

For a production setup, it's best practice to run your Node.js application behind a reverse proxy like Nginx or Apache. This allows you to handle things like SSL (HTTPS), caching, and load balancing more effectively.

A basic Nginx configuration would look something like this (e.g., in `/etc/nginx/sites-available/yourapp`):
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
This configuration forwards all traffic from port 80 to your Next.js application running on port 3000. Remember to set up your domain and enable HTTPS with a tool like Certbot.

## Deployment with Docker

Containerizing your application is a great way to ensure consistent environments and simplify deployment.

### 1. Prerequisites

- **Docker**: Ensure Docker is installed on your machine.

### 2. Build the Docker Image

A `Dockerfile` is included in the project. It uses a multi-stage build to create a small, optimized production image.

To build the image, run the following command in your project's root directory:
```bash
docker build -t careercraft-ai .
```
This will create a Docker image named `careercraft-ai`.

### 3. Run the Docker Container

Once the image is built, you can run it as a container. The Next.js application inside the container runs on port 3000. You need to map a port on your host machine to the container's port 3000.

To run the container, use this command:
```bash
docker run -p 3000:3000 careercraft-ai
```
- `-p 3000:3000` maps port 3000 on your host to port 3000 in the container.
- `careercraft-ai` is the name of the image you built.

Your application is now running inside a Docker container and is accessible at `http://localhost:3000`. To run it in detached mode (in the background), add the `-d` flag: `docker run -d -p 3000:3000 careercraft-ai`.

**Note on Database:** Even when using Docker, your application connects to the cloud-hosted Firebase Firestore. You still need to deploy your `firestore.rules` to your Firebase project as described in the VM deployment section.
