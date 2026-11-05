import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme';

export type Tab = 'home' | 'note' | 'search' | 'saisie';
type Props = { t: Theme; active: Tab; onPress: (k: Tab) => void; bottom: number };

export default function BottomBar({ t, active, onPress, bottom }: Props) {
  const item = (k: Tab, icon: keyof typeof Ionicons.glyphMap, label?: string) => {
    const on = active === k;
    const main = k === 'saisie';
    return (
      <Pressable key={k} onPress={() => onPress(k)} accessibilityLabel={label ?? k}
        style={[s.item, main && { backgroundColor: t.primary, borderRadius: 22, paddingHorizontal: 16 }]}>
        <Ionicons name={icon} size={22} color={main ? '#fff' : on ? t.primary : t.subtext} />
        {label ? <Text style={[s.label, { color: main ? '#fff' : on ? t.primary : t.subtext }]}>{label}</Text> : null}
      </Pressable>
    );
  };
  return (
    <View style={[s.bar, { backgroundColor: t.surface, bottom: bottom + 12, borderColor: t.border }]}>
      {item('home', active === 'home' ? 'map' : 'map-outline')}
      {item('note', 'star-outline', 'Note')}
      {item('search', 'search')}
      {item('saisie', 'add-circle', 'Saisie')}
    </View>
  );
}
const s = StyleSheet.create({
  bar: { position: 'absolute', left: 16, right: 16, height: 60, borderRadius: 30, borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 12 },
  label: { fontSize: 14, fontWeight: '600' },
});
