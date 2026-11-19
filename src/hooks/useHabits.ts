import { useCallback, useEffect, useState } from 'react';

import {
  createHabit,
  deleteHabit,
  fetchHabits,
  incrementHabit,
  type Habit,
} from '@/lib/habitsApi';

export type { Habit };

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setHabits(await fetchHabits());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load habits');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  /** Creates the habit on the server. Returns true on success. */
  const addHabit = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    try {
      const habit = await createHabit(trimmed);
      setHabits((prev) => [...prev, habit]);
      setError(null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add habit');
      return false;
    }
  }, []);

  /** Optimistically bumps the streak, then reconciles with the server's value. */
  const incrementStreak = useCallback(async (id: string) => {
    const bump = (delta: number) =>
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, streak: h.streak + delta } : h)));

    bump(1);
    try {
      const saved = await incrementHabit(id);
      // Rapid taps can resolve out of order; never move the count backwards.
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...saved, streak: Math.max(h.streak, saved.streak) } : h)),
      );
      setError(null);
    } catch (e) {
      bump(-1);
      setError(e instanceof Error ? e.message : 'Could not update streak');
    }
  }, []);

  /** Optimistically removes the habit, restoring it in place if the server delete fails. */
  const removeHabit = useCallback(async (habit: Habit) => {
    let index = -1;
    setHabits((prev) => {
      index = prev.findIndex((h) => h.id === habit.id);
      return prev.filter((h) => h.id !== habit.id);
    });
    try {
      await deleteHabit(habit.id);
      setError(null);
    } catch (e) {
      setHabits((prev) => {
        if (prev.some((h) => h.id === habit.id)) return prev;
        const next = [...prev];
        next.splice(index < 0 ? next.length : Math.min(index, next.length), 0, habit);
        return next;
      });
      setError(e instanceof Error ? e.message : 'Could not delete habit');
    }
  }, []);

  return { habits, loaded, refreshing, error, refresh, addHabit, incrementStreak, removeHabit };
}
