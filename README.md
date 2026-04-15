# Chat Exemple

## Pre-requisites

- Node.js 18 or higher

## How to run

```bash
npm install
npm run start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

# Understanding the code

First browse the code repository and try to understand how the application is structured.

Then for each of the communication strategies (polling, long-polling, server-sent events, WebSockets), try to understand 
how it is implemented both on the server and client sides and how that implementation reflects the underlying 
communication strategy.

After running the application, open the browser's developer tools and inspect the network traffic. Look for the requests that are being made to the server to fetch new messages.

For server-sent events you can use `curl` to subscribe to an SSE feed, e.g. : `curl -N http://localhost:3000/sse/alice/messages`

You should see something like :

```
event: message
data: {"user":"alice","content":"Hello !"}

event: message
data: {"user":"bob","content":"Hi !"}
```

Make sure you understand how the `EventEmitter` works and how it allows implementing the logic on the server side.