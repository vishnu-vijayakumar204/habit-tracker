import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type Habit = {
  id: string;
  name: string;
  streak: number;
  createdAt: number;
};

const STORAGE_KEY = 'habits:v1';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setHabits(JSON.parse(raw) as Habit[]);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Persist after the initial load so we never overwrite saved data with [].
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits)).catch(() => {});
  }, [habits, loaded]);

  const addHabit = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmed,
        streak: 0,
        createdAt: Date.now(),
      },
    ]);
  }, []);

  const incrementStreak = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, streak: h.streak + 1 } : h)),
    );
  }, []);

  return { habits, loaded, addHabit, incrementStreak };
}
