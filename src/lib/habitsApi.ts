export type Habit = {
  id: string;
  name: string;
  streak: number;
  created_at: string;
  updated_at: string;
};

const BASE_URL = process.env.EXPO_PUBLIC_HABITS_API_URL?.replace(/\/+$/, '');
const API_KEY = process.env.EXPO_PUBLIC_HABITS_API_KEY;

export const isApiConfigured = Boolean(BASE_URL && API_KEY);

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!BASE_URL || !API_KEY) {
    throw new Error('Habits API is not configured. Set EXPO_PUBLIC_HABITS_API_URL and EXPO_PUBLIC_HABITS_API_KEY.');
  }

  const res = await fetch(`${BASE_URL}/api/habits${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...init.headers,
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export async function fetchHabits(): Promise<Habit[]> {
  const { habits } = await request<{ habits: Habit[] }>('');
  return habits;
}

export async function createHabit(name: string): Promise<Habit> {
  const { habit } = await request<{ habit: Habit }>('', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return habit;
}

export async function incrementHabit(id: string): Promise<Habit> {
  const { habit } = await request<{ habit: Habit }>(`/${id}/increment`, { method: 'POST' });
  return habit;
}
