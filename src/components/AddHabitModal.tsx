import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Resolves true when the habit was saved; the modal stays open on failure. */
  onAdd: (name: string) => Promise<boolean>;
};

export function AddHabitModal({ visible, onClose, onAdd }: Props) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const canSave = name.trim().length > 0 && !saving;

  const close = () => {
    if (saving) return;
    setName('');
    onClose();
  };

  // `text` comes from the native submit event so a Return pressed right after
  // the last keystroke can't save a stale (truncated) name from React state.
  const save = async (text: string = name) => {
    if (!text.trim() || saving) return;
    setSaving(true);
    const ok = await onAdd(text);
    setSaving(false);
    if (ok) {
      setName('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.backdrop, { backgroundColor: theme.backdrop }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close" />

        <View style={[styles.sheet, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>New habit</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Drink 8 glasses of water"
            placeholderTextColor={theme.muted}
            autoFocus
            editable={!saving}
            maxLength={60}
            returnKeyType="done"
            onSubmitEditing={(e) => save(e.nativeEvent.text)}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
            ]}
          />

          <View style={styles.actions}>
            <Pressable onPress={close} style={styles.button} accessibilityRole="button">
              <Text style={[styles.buttonText, { color: theme.muted }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => save()}
              disabled={!canSave}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
              style={[styles.button, { backgroundColor: theme.accent, opacity: canSave ? 1 : 0.4 }]}
            >
              {saving ? (
                <ActivityIndicator color={theme.onAccent} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.onAccent }]}>Add habit</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: 20 },
  sheet: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    borderRadius: 22,
    padding: 20,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: '700' },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  button: {
    minWidth: 96,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { fontSize: 15, fontWeight: '600' },
});
