# Multiplayer Cursors Tutorial

Followed this tutorial for websockets and multiplayer cursors in React: https://ably.com/blog/websockets-react-tutorial

I removed `perfect-cursors` and just used a 0.1s css transition since it was too slow for my liking. I also made the current user's cursor track exactly and converted much of the code to typescript.

## Running
Server:
```
cd server
npx tsx index.ts
```

Client:
```
cd client
npm run dev
```