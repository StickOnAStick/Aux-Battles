This is a [Next.js 13](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

# Frontend

First, cd into the frontend directory and install all required modules with: 

```bash
yarn
```
Build and run the dev enviornment using:

```bash
yarn build

yarn dev
```
* NOTE: You **MUST** use yarn for this project to prevent 


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Backend

First, navigate to the backend directory, then run:

```bash
./pocketbase serve --http "127.0.0.1:8091"
```
This will start a local instance of the database, accessible on the 8091 port. 
This will log the admin UI url in your terminal, use this to create, update, and modify existing collections and records. 

## Learn more

Checkout PocketBase.io docs and the admin ui's dashboard for more information:
 
  - [Pocketbase Documentation](https://pocketbase.io/docs)


# Working with cookies

Helpful resources: 

 - [NextJS 13 Cookies Docs](https://beta.nextjs.org/docs/api-reference/cookies)
 - [NextJS 13 Cookie setting](https://beta.nextjs.org/docs/api-reference/response#cookies)
 - [Video for NextJS 13 Cookies](https://www.youtube.com/watch?v=vsEKmufzT6M&t=476s)

#

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
