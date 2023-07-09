import { io } from "socket.io-client";

const socket = io('ws://172.16.3.75:3000/', {
  reconnectionDelay: 10000,
  autoConnect: false,
  auth: {
    token: "123"
  },
})

export default socket