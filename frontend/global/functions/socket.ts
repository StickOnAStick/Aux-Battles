'use client';
import { io } from "socket.io-client";

export const socket = io('http://aux-battles.app:8080');