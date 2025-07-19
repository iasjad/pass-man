# 🔐 PassMan - Save Your Passwords Just Like SuperMan

<div align="center">

![PassMan Logo](./public/logo.png 'PassMan Logo')

</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green.svg?logo=supabase)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue.svg?logo=tailwind-css)](https://tailwindcss.com/)

PassMan is a modern, secure, and user-friendly password manager built with React and Supabase. It prioritizes security by implementing **application-level encryption**, ensuring that your sensitive password data is encrypted _before_ it ever leaves your browser. Even if the database is compromised, your passwords remain secure.

---

## ✨ Features

- ✅ **Secure User Authentication:** Sign up and log in to a personal, secure vault.
- ✅ **End-to-End Security:** Passwords are encrypted on the client-side using **AES** via `crypto-js`. The database never sees your plaintext passwords.
- ✅ **Full CRUD Functionality:** Easily **C**reate, **R**ead, **U**pdate, and **D**elete your password entries.
- ✅ **Copy to Clipboard:** One-click functionality to copy usernames and passwords.
- ✅ **User-Friendly Interface:** A clean and intuitive UI with toast notifications for a smooth user experience.
- ✅ **Row Level Security (RLS):** Database policies ensure that users can only ever access their own data.

---

## 📸 Application Screenshot

![PassMan Screenshot](./screenshot/screenshot.png 'PassMan Application Interface')

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Storage)
- **Key Libraries:** `supabase-js`, `react-toastify`, `crypto-js`, `uuid`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A free Supabase account

### Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/iasjad/pass-man.git
    cd passman
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Set up Supabase**

    - Go to [Supabase](https://supabase.com/) and create a new project.
    - In your project, navigate to the **SQL Editor** and run the following script to create the `passwords` table and link it to the auth system.

      ```sql
      -- 1. Create the passwords table
      CREATE TABLE public.passwords (
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          site TEXT NOT NULL,
          "userName" TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 2. Enable Row Level Security (RLS)
      ALTER TABLE public.passwords ENABLE ROW LEVEL SECURITY;

      -- 3. Create policies to secure the data
      -- Users can view their own passwords.
      CREATE POLICY "Enable select for users based on user_id"
      ON public.passwords FOR SELECT
      USING (auth.uid() = user_id);

      -- Users can insert new passwords for themselves.
      CREATE POLICY "Enable insert for users based on user_id"
      ON public.passwords FOR INSERT
      WITH CHECK (auth.uid() = user_id);

      -- Users can update their own passwords.
      CREATE POLICY "Enable update for users based on user_id"
      ON public.passwords FOR UPDATE
      USING (auth.uid() = user_id);

      -- Users can delete their own passwords.
      CREATE POLICY "Enable delete for users based on user_id"
      ON public.passwords FOR DELETE
      USING (auth.uid() = user_id);
      ```

4.  **Set up Environment Variables**

    - Create a file named `.env` in the root of your project.
    - Get your Project URL and `anon` key from your Supabase project's **Settings > API**.
    - Generate a strong secret key for encryption (you can use an online generator).
    - Add the following to your `.env` file:

      ```
      VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
      VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
      VITE_ENCRYPTION_SECRET_KEY="your-super-long-and-random-secret-key-here"
      ```

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port specified in your console) to view the application.

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
