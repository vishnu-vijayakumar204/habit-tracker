import { useColorScheme } from 'react-native';

const light = {
  background: '#F6F7FB',
  card: '#FFFFFF',
  text: '#14161F',
  muted: '#6B7080',
  border: '#E6E8EF',
  accent: '#5B5BD6',
  accentSoft: '#EEEEFC',
  onAccent: '#FFFFFF',
  backdrop: 'rgba(10, 12, 20, 0.45)',
  error: '#C2261D',
  errorSoft: '#FDECEA',
};

const dark: typeof light = {
  background: '#0E0F14',
  card: '#1A1C24',
  text: '#F2F3F7',
  muted: '#9A9FB0',
  border: '#2A2D38',
  accent: '#8B8BF5',
  accentSoft: '#26264A',
  onAccent: '#0E0F14',
  backdrop: 'rgba(0, 0, 0, 0.6)',
  error: '#FF8A80',
  errorSoft: '#3A1A1A',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
