import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Habit } from '@/hooks/useHabits';
import { useTheme } from '@/theme';

type Props = {
  habit: Habit;
  onPress: () => void;
  onLongPress: () => void;
};

export function HabitCard({ habit, onPress, onLongPress }: Props) {
  const theme = useTheme();
  const days = habit.streak === 1 ? 'day' : 'days';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={450}
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}, ${habit.streak} ${days} streak`}
      accessibilityHint="Tap to add one to the streak. Long press to delete."
      accessibilityActions={[{ name: 'longpress', label: 'Delete habit' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'longpress') onLongPress();
      }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {habit.name}
        </Text>
        <Text style={[styles.hint, { color: theme.muted }]}>Tap to log · hold to delete</Text>
      </View>

      <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={[styles.count, { color: theme.accent }]}>{habit.streak}</Text>
        <Text style={[styles.days, { color: theme.muted }]}>{days}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 17, fontWeight: '600' },
  hint: { fontSize: 13 },
  badge: {
    minWidth: 72,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  flame: { fontSize: 16 },
  count: { fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
  days: { fontSize: 11, fontWeight: '500' },
});
