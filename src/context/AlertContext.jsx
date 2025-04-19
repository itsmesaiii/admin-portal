import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get('/death-records/matches');
        setAlertCount(res.data.length); // 👈 this is the key
      } catch (err) {
        console.error('Failed to fetch alerts count');
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <AlertContext.Provider value={{ alertCount }}>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
