# The SmartGlove 2.0
### WORK IN PROGRESS

![Dashboard](https://cdn.discordapp.com/attachments/575028784395452464/661270319616622602/unknown.png)

## What is it?
The SmartGlove is a prototype pressure sensing glove aimed at helping physiotherapists treat hand related injuries. This repo holds the code for web app, providing an interface to interact with the glove. For more details, visit https://thesmartglove.herokuapp.com/ for information, or https://thesmartglove.herokuapp.com/demo to test it out. By joining the same room, multiple clients will be in sync in real-time.


### [Try it out](https://thesmartglove.herokuapp.com/demo) or [see it in action.](https://www.youtube.com/watch?v=WGSrL6JS5Os)

## Running it Locally
1) Clone the repo.
2) Run npm install
3) Run cd client && npm install
4) Start the express server and React server separately.
5) Visit http://localhost:3000/demo

## Glove Simulation
1) Go to https://thesmartglove.herokuapp.com/room/ + {custom room ID}
2) Connect to the sever, with this repl: https://tiny.cc/glovesim, substituting with your custom room ID.