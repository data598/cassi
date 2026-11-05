import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme';
import { PARCELS } from '../data/parcels';

const W = Math.min(Dimensions.get('window').width * 0.84, 360);
type Props = { t: Theme; open: boolean; onClose: () => void; top: number; bottom: number;
  dark: boolean; onToggleDark: (v: boolean) => void; onSelectParcel: (id: string) => void };

const ENTRIES: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'options-outline', label: "Paramètres d'équilibre" },
  { icon: 'ribbon-outline', label: 'Modalité de note (A/B/C/D)' },
  { icon: 'share-outline', label: 'Exporter (visites, etc.)' },
  { icon: 'cloud-upload-outline', label: 'Importer parcellaire' },
  { icon: 'search-outline', label: 'Paramètres de recherche' },
  { icon: 'locate-outline', label: 'Position du bouton menu' },
];

export default function MenuDrawer({ t, open, onClose, top, bottom, dark, onToggleDark, onSelectParcel }: Props) {
  const x = useRef(new Animated.Value(-W)).current;
  useEffect(() => {
    Animated.spring(x, { toValue: open ? 0 : -W, useNativeDriver: true, bounciness: 0, speed: 16 }).start();
  }, [open, x]);
  return (
    <>
      <Pressable pointerEvents={open ? 'auto' : 'none'} onPress={onClose} style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000',
          opacity: x.interpolate({ inputRange: [-W, 0], outputRange: [0, 0.35] }) }]} />
      </Pressable>
      <Animated.View style={[s.panel, { width: W, backgroundColor: t.surface, paddingTop: top, paddingBottom: bottom,
        transform: [{ translateX: x }] }]}>
        <Pressable onPress={onClose} style={s.back} accessibilityLabel="Retour">
          <Ionicons name="arrow-back" size={22} color={t.text} />
          <Text style={[s.title, { color: t.text }]}>Cassi</Text>
        </Pressable>
        <ScrollView>
          <Text style={[s.section, { color: t.subtext }]}>PARCELLES VISITÉES</Text>
          {PARCELS.map(p => (
            <Pressable key={p.id} onPress={() => onSelectParcel(p.id)} style={[s.row, { borderColor: t.border }]}>
              <View style={[s.dot, { backgroundColor: t.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={[s.rowTitle, { color: t.text }]}>{p.id}</Text>
                <Text numberOfLines={1} style={{ color: t.subtext, fontSize: 12 }}>{p.notes.join(' · ')}</Text>
              </View>
              {p.grade ? <Text style={[s.grade, { color: t.accent }]}>{p.grade}</Text> : null}
            </Pressable>
          ))}
          <Text style={[s.section, { color: t.subtext }]}>RÉGLAGES</Text>
          {ENTRIES.map(e => (
            <Pressable key={e.label} style={[s.row, { borderColor: t.border }]}>
              <Ionicons name={e.icon} size={20} color={t.primary} />
              <Text style={[s.rowTitle, { color: t.text, flex: 1 }]}>{e.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={t.subtext} />
            </Pressable>
          ))}
          <View style={[s.row, { borderColor: t.border }]}>
            <Ionicons name={dark ? 'moon' : 'sunny'} size={20} color={t.primary} />
            <Text style={[s.rowTitle, { color: t.text, flex: 1 }]}>Clair / Sombre</Text>
            <Switch value={dark} onValueChange={onToggleDark} trackColor={{ true: t.primary }} />
          </View>
          <Pressable style={[s.save, { backgroundColor: t.primary }]}>
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700' }}>Sauvegarder</Text>
          </Pressable>
        </ScrollView>
        <View style={[s.user, { borderColor: t.border }]}>
          <View style={[s.avatar, { backgroundColor: t.border }]}><Ionicons name="person" size={22} color={t.subtext} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.text, fontWeight: '700' }}>Utilisateur</Text>
            <Text style={{ color: t.subtext, fontSize: 12 }}>technicien@cave-pomerols.fr</Text>
          </View>
          <Ionicons name="log-out-outline" size={22} color={t.subtext} />
        </View>
      </Animated.View>
    </>
  );
}
const s = StyleSheet.create({
  panel: { position: 'absolute', top: 0, bottom: 0, left: 0, borderTopRightRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, elevation: 16 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 20, fontWeight: '800' },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  grade: { fontSize: 18, fontWeight: '800' },
  save: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', margin: 20, padding: 14, borderRadius: 14 },
  user: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
