# Casify - Phone Accessories E-Commerce Application

## Description

Casify is a modern e-commerce application specializing in high-quality phone accessories. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, React Query, and MongoDB, Casify provides a smooth and engaging shopping experience with a focus on performance, responsiveness, and a luxurious design.

## Technologies

*   **[Next.js](https://nextjs.org/)**: React framework for building performant and SEO-friendly web applications with server-side rendering, static site generation, and more.
*   **[TypeScript](https://www.typescriptlang.org/)**: Adds static typing to JavaScript for improved code quality and maintainability.
*   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development with a consistent design system.
*   **[Framer Motion](https://www.framer.com/motion/)**: A production-ready motion library for React to create smooth animations and transitions.
*   **[@tanstack/react-query](https://tanstack.com/query/latest)**: Powerful asynchronous state management library for fetching, caching, and updating data in your React applications.
*   **[MongoDB](https://www.mongodb.com/)**: NoSQL database for storing product data, user information, and cart details.
*   **[Mongoose](https://mongoosejs.com/)**: MongoDB object modeling tool designed to work in an asynchronous environment.
*   **[Lucide React](https://lucide.dev/)**: Beautifully simple SVG icons for React.
*   **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation library.
*   **[React Hook Form](https://www.react-hook-form.com/)**: Library for simplified form creation and validation in React.
*   **[Sonner](https://sonner.emilkowal.ski/)**: A sleek and configurable toast notification library.
*   **[next-auth](https://next-auth.js.org/)**: Complete open source authentication solution for Next.js applications.
*   **[slugify](https://www.npmjs.com/package/slugify)**: String manipulation to convert an input name and make a URL for it.

## Features

*   **Product Catalog:** Browse a wide range of phone accessories, including cases, chargers, headphones, and more.
*   **Dynamic Product Pages:**  Detailed product pages with image carousels, descriptions, features, and color/model selection.
*   **Responsive Design:** Seamless experience across desktop, tablet, and mobile devices.
*   **Smooth Animations:**  Subtle animations and transitions powered by Framer Motion for a luxurious feel.
*   **Efficient Data Fetching:** Leverages React Query for optimized data fetching, caching, and background updates.
*   **User Authentication:** Secure user accounts with authentication and session management.
*   **Cart Functionality:** Add products to the cart, manage quantities, and apply discount codes.
*   **Checkout Process:** Streamlined checkout flow with shipping information form and order summary.
*   **Admin Panel:** Easy CRUD actions for the product to quickly create and manage products.

## Styling and Design System

*   **Color Palette:**
    *   Primary: `<span style="color:#e2780c">#e2780c</span>` (Amber - for key actions and highlights)
    *   Secondary: `<span style="color:#374151">#374151</span>` (Neutral Gray - for text and backgrounds)
    *   Accent: `<span style="color:#6b7280">#6b7280</span>` (Slate Gray - for secondary text and borders)
*   **Typography:** A mix of fonts and font weight to promote a good font and easy readability.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Configure environment variables:**

    Create a `.env.local` file in the root directory and provide the necessary environment variables (e.g., database connection string, API keys):

    ```
    MONGODB_URI=your_mongodb_connection_string
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

*   [Next.js Documentation](https://nextjs.org/docs)
*   [TypeScript Documentation](https://www.typescriptlang.org/docs/)
*   [Tailwind CSS Documentation](https://tailwindcss.com/docs)
*   [Framer Motion Documentation](https://www.framer.com/motion/)
*   [React Query Documentation](https://tanstack.com/query/latest)
*   [MongoDB Documentation](https://www.mongodb.com/docs/)
*   [Mongoose Documentation](https://mongoosejs.com/docs/)

## Contribute

Feedbacks are welcome

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.