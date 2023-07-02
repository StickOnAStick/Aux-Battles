'use client';
import { io } from "socket.io-client";

export const socket = io('https://aux-battles.app:8080');