import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddHabitModal } from '@/components/AddHabitModal';
import { HabitCard } from '@/components/HabitCard';
import { useHabits } from '@/hooks/useHabits';
import { useTheme } from '@/theme';

export default function HomeScreen() {
  const theme = useTheme();
  const { habits, loaded, refreshing, error, refresh, addHabit, incrementStreak } = useHabits();
  const [adding, setAdding] = useState(false);

  const handleTap = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    incrementStreak(id);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Habits</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          {habits.length === 0
            ? 'Small steps, every day.'
            : `${habits.length} habit${habits.length === 1 ? '' : 's'} tracked`}
        </Text>
      </View>

      {error ? (
        <Pressable
          onPress={refresh}
          accessibilityRole="button"
          style={[styles.error, { backgroundColor: theme.errorSoft }]}
        >
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          <Text style={[styles.errorRetry, { color: theme.error }]}>Tap to retry</Text>
        </Pressable>
      ) : null}

      <FlatList
        data={habits}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.muted} />
        }
        keyExtractor={(h) => h.id}
        renderItem={({ item }) => <HabitCard habit={item} onPress={() => handleTap(item.id)} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          loaded ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🌱</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No habits yet</Text>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                Add your first habit to start building a streak.
              </Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <ActivityIndicator color={theme.muted} />
            </View>
          )
        }
      />

      <Pressable
        onPress={() => setAdding(true)}
        accessibilityRole="button"
        accessibilityLabel="Add a new habit"
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.fabText, { color: theme.onAccent }]}>＋  New habit</Text>
      </Pressable>

      <AddHabitModal visible={adding} onClose={() => setAdding(false)} onAdd={addHabit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 4 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 15 },
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 60 },
  emptyIcon: { fontSize: 44 },
  error: { marginHorizontal: 20, marginBottom: 8, padding: 12, borderRadius: 12, gap: 2 },
  errorText: { fontSize: 14, fontWeight: '600' },
  errorRetry: { fontSize: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyText: { fontSize: 15, textAlign: 'center', maxWidth: 260 },
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabText: { fontSize: 16, fontWeight: '700' },
});
