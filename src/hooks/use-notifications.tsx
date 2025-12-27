
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/firebase/auth/provider';
import { useHabits } from '@/firebase/firestore/data-hooks';
import { format } from 'date-fns';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationsContextType {
  permission: NotificationPermission;
  requestPermission: () => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const habitsKey = format(new Date(), 'yyyy-MM');
  const { data: habits } = useHabits(user?.uid, habitsKey);

  useEffect(() => {
    // Check for permission on mount, if Notification API is available
    if ('Notification' in window) {
      setPermission(Notification.permission as NotificationPermission);
      const storedPreference = localStorage.getItem('notificationsEnabled') === 'true';
      if(Notification.permission === 'granted'){
        setNotificationsEnabledState(storedPreference);
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const status = await Notification.requestPermission();
      setPermission(status as NotificationPermission);
      if (status === 'granted') {
        setNotificationsEnabledState(true);
        localStorage.setItem('notificationsEnabled', 'true');
      }
    }
  }, []);

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('notificationsEnabled', String(enabled));
  };
  
  useEffect(() => {
    if (!notificationsEnabled || !habits || habits.length === 0) {
      return;
    }

    const checkAndNotify = () => {
        const now = new Date();
        // Check at 9:00 AM
        if (now.getHours() === 9 && now.getMinutes() === 0) {
            const dayOfMonth = now.getDate();
            const uncompletedHabits = habits.filter(h => !h.completedDays.includes(dayOfMonth));

            if (uncompletedHabits.length > 0) {
                const notification = new Notification('Zenith Hábitos - Lembrete!', {
                    body: `Você tem ${uncompletedHabits.length} hábito(s) para completar hoje. Não desista!`,
                    icon: '/favicon.ico', // Make sure you have a favicon
                });
            }
        }
    };

    // Check every minute
    const intervalId = setInterval(checkAndNotify, 60000); 

    return () => clearInterval(intervalId);
  }, [notificationsEnabled, habits]);


  const value = {
    permission,
    requestPermission,
    notificationsEnabled,
    setNotificationsEnabled,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
