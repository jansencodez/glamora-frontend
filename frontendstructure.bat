@echo off
rem Create main frontend directory
mkdir frontend
cd frontend

rem Create the app directory and the necessary page files
mkdir app
cd app
echo // Main layout for the app (shared UI components) > layout.tsx
echo // Default page (Home) >> page.tsx
mkdir about
cd about
echo // About page component > page.tsx
cd ..
mkdir products
cd products
echo // Products listing page > page.tsx
mkdir [id]
cd [id]
echo // Dynamic product page > page.tsx
cd ..
mkdir checkout
cd checkout
echo // Checkout page component > page.tsx
cd ..
mkdir auth
cd auth
mkdir login
cd login
echo // Login page component > page.tsx
cd ..
mkdir register
cd register
echo // Register page component > page.tsx
cd ..
mkdir cart
cd cart
echo // Cart page component > page.tsx
cd ..

rem Go back to the frontend folder
cd ..

rem Create the components folder and the reusable UI components
mkdir components
cd components
echo // Navbar component > Navbar.tsx
echo // Footer component > Footer.tsx
echo // Product card component > ProductCard.tsx
echo // Reusable button component > Button.tsx
cd ..

rem Create the styles folder and necessary style files
mkdir styles
cd styles
echo /* Global CSS styles */ > globals.css
echo // Tailwind CSS config > tailwind.config.js
cd ..

rem Create the public folder and add static assets
mkdir public
cd public
echo // Logo image > logo.png
echo // Favicon image > favicon.ico
cd ..

rem Create the utils folder for utility functions
mkdir utils
cd utils
echo // Data fetching utility > fetchData.ts
echo // Currency formatting utility > formatCurrency.ts
cd ..

rem Create .env.local file for environment variables
echo // Environment variables for frontend > .env.local

rem End of script
echo Frontend folder structure created successfully!
pause
