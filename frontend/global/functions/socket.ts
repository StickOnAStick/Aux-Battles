'use client';
import { io } from "socket.io-client";
//Test

export const socket = io(process.env.SOCKET_IO_URL as string);