'use client';
import { io } from "socket.io-client";

export const socket = io('https://api.aux-battles.app:8080');