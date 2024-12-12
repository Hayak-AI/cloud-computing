# User Guide

This guide will help you set up the development environment and configuration required to run the Hayak-AI application.

---

## 1. Environment Preparation

### 1.1. Clone Repository
First, clone this repository to your local machine using the following command:

```bash
git clone https://github.com/Hayak-AI/cloud-computing.git
cd cloud-computing
```

### 1.2. Install Dependencies
Make sure you have **Node.js** and **npm** installed. If not, you can download them from the [official Node.js website](https://nodejs.org/).

Then, install all dependencies by running the following command:

```bash
npm install
```

### 1.3. Set Up the `.env` File

In the project, you will find an example file `.env.example`. Copy this file to `.env` and adjust it to match your local settings. The `.env` file contains sensitive configurations used by the application, such as database connections, API keys, and JWT settings.

```bash
cp .env.example .env
```

Open the `.env` file and modify it with the necessary details as described below.

### 1.4. Environment Variables Configuration

Here is the explanation for each configuration in the `.env` file:

#### 1. **JWT_SECRET**
The secret key for **JSON Web Token** (JWT). This is used to sign and verify tokens used in authentication.

```bash
JWT_SECRET=your_jwt_secret_key
```

**Note**: Replace `your_jwt_secret_key` with a strong secret key.

#### 2. **Database Configuration**
Configuration to connect the application to **MySQL** or **MariaDB**.

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=db_hayak
```

- `DB_HOST`: The database host address (usually `localhost` if the database is running on the same machine).
- `DB_USER`: Username to access the database (e.g., `root`).
- `DB_PASSWORD`: Password for your database.
- `DB_NAME`: The name of the database used by the application.

#### 3. **Server Configuration**
Configuration for the application's port and host.

```bash
PORT=3000
HOST=localhost
```

- `PORT`: The port on which the application will run. Default is `3000`.
- `HOST`: The host where the application will run (usually `localhost`).

#### 4. **JWT_EXPIRES_IN**
The expiration duration of the JWT token. You can set this according to your requirements.

```bash
JWT_EXPIRES_IN=30d
```

This token will expire in 30 days.

#### 5. **Google Cloud Configuration**
To connect the application with Google Cloud (e.g., for file storage in **Cloud Storage**), you need a **Google Cloud Project ID** and a **Service Account Key**.

```bash
GCLOUD_PROJECT_ID=your_project_id
GCLOUD_KEY_FILENAME=path/to/your/serviceaccountkey.json
GCLOUD_BUCKET_NAME=your_bucket_name
```

- `GCLOUD_PROJECT_ID`: Your Google Cloud Project ID.
- `GCLOUD_KEY_FILENAME`: The location of the JSON **Service Account Key** file you downloaded from the Google Cloud Console. Ensure this file has the necessary permissions to access the required Google Cloud services.
- `GCLOUD_BUCKET_NAME`: The name of the Google Cloud Storage bucket used by the application.

#### 6. **SMTP Email Configuration**
To send emails using **SMTP** (e.g., for verification or password reset emails), set up an SMTP email account.

```bash
SMTP_EMAIL_USER=email_example@gmail.com
SMTP_EMAIL_PASS=your_email_password
```

- `SMTP_EMAIL_USER`: The email address used to send emails.
- `SMTP_EMAIL_PASS`: The password for the email account (ensure it is secure).

---

#### 7. **Custom Search API Configuration**
If your application requires access to the Google Custom Search API, configure the API key and search engine ID.

```bash
CUSTOM_SEARCH_API_KEY=your_custom_search_api_key
CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id
CUSTOM_SEARCH_QUERY="search_query"
```

---

## 2. Getting a Google Cloud Project ID

To use Google Cloud services, you need a **Google Cloud Project**. Follow these steps to obtain your Project ID:

### 2.1. Create a Project in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click **"Select a Project"** at the top of the screen.
3. Click **"New Project"**.
4. Name your project and select a location or organization if required.
5. Click **"Create"**.

### 2.2. Enable Required APIs

If your application requires specific APIs, ensure you enable the relevant APIs:

1. Go to the [API Library](https://console.cloud.google.com/apis/library).
2. Search for the API you need (e.g., **Google Cloud Storage API**) and enable it.

### 2.3. Create a Service Account and Obtain a Key

To access Google Cloud services with your application, create a **Service Account** and download a **JSON key**:

1. Open [Google Cloud Console - Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Select the appropriate project.
3. Click **Create Service Account**.
4. Name the service account and assign an appropriate role (e.g., **Storage Admin** for full access to Cloud Storage).
5. Once the service account is created, click **Actions** and select **Create Key**.
6. Choose **JSON** for the key format, then click **Create** to download the key file.

Place this JSON file in the specified path, as mentioned in the `.env` file.

---

## 3. Running the Application

Once everything is set up, you can run the application with the following command:

```bash
npm run start
```

The application will run at **`http://localhost:3000`** if you use the default settings.

---

## 4. Testing Endpoints

After the application is running, you can test various endpoints using tools like [Postman Hayak.AI](https://documenter.getpostman.com/view/16134310/2sAY52eKzg) or **curl**. Make sure to include the JWT token in the `Authorization` header when making requests that require authentication.

---

## 5. Troubleshooting

If you encounter any errors or other issues, here are some steps to troubleshoot:

1. Double-check the `.env` file configuration to ensure all information is correct.
2. Ensure the database connection is correct and running.
3. Check the application logs for any errors recorded in the console.

---

ERD: [ERD Hayak.ai](https://dbdiagram.io/d/hayakdb-6729a38ee9daa85aca53543d)

**We hope this guide helps you get started with this application! If you have further questions, don't hesitate to open an issue in this repository or contact the developers.**

---

