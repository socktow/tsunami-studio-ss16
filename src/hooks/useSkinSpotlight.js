import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSkinSpotlight = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/game-data/Skin-Spotlight');
        setAllPlayers(response.data);
        setIsReady(true);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trận đấu:", err.message);
        setError(err.message);
        setIsReady(false);
      }
    };

    fetchGameData();
  }, []);

  return { allPlayers, isReady, error };
};