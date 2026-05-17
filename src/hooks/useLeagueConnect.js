"use client";
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export const useLeagueConnect = () => {
  const [isLCUConnected, setIsLCUConnected] = useState(false);
  const [lcuData, setLcuData] = useState(null);

  useEffect(() => {
    // Lắng nghe trạng thái LCU
    socket.on('lcu-status', (data) => {
      setIsLCUConnected(data.connected);
      setLcuData(data);
    });

    return () => {
      socket.off('lcu-status');
    };
  }, []);

  return { isLCUConnected, lcuData };
};