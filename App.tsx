import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polygon, Region, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { dark, light } from './src/theme';
import { PARCELS, Parcel, centroid } from './src/data/parcels';
import BottomBar, { Tab } from './src/components/BottomBar';
import MenuDrawer from './src/components/MenuDrawer';

const START: Region = { latitude: 43.3842, longitude: 3.5212, latitudeDelta: 0.012, longitudeDelta: 0.012 };

function Home() {
  const insets = useSafeAreaInsets();
  const [isDark, setDark] = useState(false);
  const t = isDark ? dark : light;
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState<Tab>('home');
  const [online, setOnline] = useState(true);
  const [selected, setSelected] = useState<Parcel | null>(null);
  const map = useRef<MapView>(null);
  const region = useRef<Region>(START);

  useEffect(() => NetInfo.addEventListener(s => setOnline(!!s.isConnected && s.isInternetReachable !== false)), []);

  const focus = useCallback((p: Parcel) => {
    const c = centroid(p.coords);
    map.current?.animateToRegion({ ...c, latitudeDelta: 0.004, longitudeDelta: 0.004 }, 400);
    setSelected(p);
  }, []);

  const recenter = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Localisation', "Autorisez la localisation pour recentrer sur votre position.");
    const pos = await Location.getCurrentPositionAsync({});
    map.current?.animateToRegion({ latitude: pos.coords.latitude, longitude: pos.coords.longitude,
      latitudeDelta: 0.003, longitudeDelta: 0.003 }, 500);
  };
  const zoom = (f: number) => {
    const r = region.current;
    map.current?.animateToRegion({ ...r, latitudeDelta: r.latitudeDelta * f, longitudeDelta: r.longitudeDelta * f }, 250);
  };
  const onTab = (k: Tab) => {
    setTab(k);
    if (k === 'home') { setSelected(null); map.current?.animateToRegion(START, 400); }
    else Alert.alert({ note: 'Note', search: 'Recherche', saisie: 'Saisie de visite' }[k], 'Écran à venir.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <MapView ref={map} style={StyleSheet.absoluteFill} provider={PROVIDER_DEFAULT} initialRegion={START}
        mapType={process.env.EXPO_OS === 'android' ? 'none' : 'standard'}
        showsUserLocation showsCompass={false} toolbarEnabled={false} rotateEnabled={false}
        onRegionChangeComplete={r => { region.current = r; }} onPress={() => setSelected(null)}>
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />
        {PARCELS.map(p => (
          <React.Fragment key={p.id}>
            <Polygon coordinates={p.coords} tappable onPress={() => focus(p)}
              fillColor={selected?.id === p.id ? t.accent + '66' : t.parcelFill}
              strokeColor={selected?.id === p.id ? t.accent : t.parcelStroke} strokeWidth={2} />
            <Marker coordinate={centroid(p.coords)} tracksViewChanges={false} onPress={() => focus(p)} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={[s.tag, { backgroundColor: t.surface, borderColor: t.parcelStroke }]}>
                <Text style={{ color: t.text, fontSize: 11, fontWeight: '700' }}>{p.id}</Text>
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      <Pressable onPress={() => setMenu(true)} accessibilityLabel="Menu"
        style={[s.fab, { top: insets.top + 8, left: 16, backgroundColor: t.surface }]}>
        <Ionicons name="menu" size={24} color={t.text} />
      </Pressable>
      <View style={[s.status, { top: insets.top + 8, right: 16, backgroundColor: t.surface }]}>
        <View style={[s.led, { backgroundColor: online ? t.ok : t.ko }]} />
        <Text style={{ color: t.subtext, fontSize: 12, fontWeight: '600' }}>{online ? 'En ligne' : 'Hors ligne'}</Text>
      </View>

      <View style={[s.controls, { bottom: insets.bottom + 92 }]}>
        <Pressable onPress={recenter} style={[s.round, { backgroundColor: t.surface }]} accessibilityLabel="Recentrer GPS">
          <Ionicons name="navigate" size={20} color={t.primary} />
        </Pressable>
        <View style={[s.zoom, { backgroundColor: t.surface }]}>
          <Pressable onPress={() => zoom(0.5)} style={s.zbtn} accessibilityLabel="Zoom avant">
            <Ionicons name="add" size={22} color={t.text} /></Pressable>
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.border }} />
          <Pressable onPress={() => zoom(2)} style={s.zbtn} accessibilityLabel="Zoom arrière">
            <Ionicons name="remove" size={22} color={t.text} /></Pressable>
        </View>
      </View>

      {selected && (
        <View style={[s.card, { backgroundColor: t.surface, bottom: insets.bottom + 84 }]}>
          <Text style={{ color: t.text, fontSize: 16, fontWeight: '800' }}>{selected.id}</Text>
          <Text style={{ color: t.subtext, marginTop: 4 }}>{selected.notes.join(' · ')}</Text>
        </View>
      )}

      <BottomBar t={t} active={tab} onPress={onTab} bottom={insets.bottom} />
      <MenuDrawer t={t} open={menu} onClose={() => setMenu(false)} top={insets.top} bottom={insets.bottom}
        dark={isDark} onToggleDark={setDark}
        onSelectParcel={id => { setMenu(false); const p = PARCELS.find(x => x.id === id); if (p) focus(p); }} />
    </View>
  );
}

export default function App() {
  return <SafeAreaProvider><Home /></SafeAreaProvider>;
}

const shadow = { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 };
const s = StyleSheet.create({
  fab: { position: 'absolute', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', ...shadow },
  status: { position: 'absolute', height: 32, paddingHorizontal: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 6, ...shadow },
  led: { width: 10, height: 10, borderRadius: 5 },
  controls: { position: 'absolute', right: 16, alignItems: 'center', gap: 12 },
  round: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', ...shadow },
  zoom: { width: 44, borderRadius: 22, overflow: 'hidden', ...shadow },
  zbtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  card: { position: 'absolute', left: 16, right: 16, padding: 16, borderRadius: 18, ...shadow },
});
