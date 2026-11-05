export type LatLng = { latitude: number; longitude: number };
export type Parcel = {
  id: string; coords: LatLng[]; notes: string[]; grade?: 'A' | 'B' | 'C' | 'D';
};
// Données d'exemple (secteur Pomérols) — à remplacer par l'import du parcellaire.
export const PARCELS: Parcel[] = [
  { id: 'C5850009', grade: undefined,
    notes: ['AOP PP fin', 'Dévitalisé'],
    coords: [
      { latitude: 43.3872, longitude: 3.5195 }, { latitude: 43.3874, longitude: 3.5212 },
      { latitude: 43.3867, longitude: 3.5222 }, { latitude: 43.3861, longitude: 3.5210 },
      { latitude: 43.3862, longitude: 3.5197 } ] },
  { id: 'P100063', grade: undefined,
    notes: ['Palissage ok', 'Pas de manquants', 'Non irriguée'],
    coords: [
      { latitude: 43.3843, longitude: 3.5238 }, { latitude: 43.3846, longitude: 3.5252 },
      { latitude: 43.3835, longitude: 3.5254 }, { latitude: 43.3833, longitude: 3.5240 } ] },
  { id: 'C1480006', grade: 'D',
    notes: ['Palissage ok', 'Pas de manquants', 'Irriguée', 'Erigerons'],
    coords: [
      { latitude: 43.3822, longitude: 3.5190 }, { latitude: 43.3828, longitude: 3.5203 },
      { latitude: 43.3818, longitude: 3.5212 }, { latitude: 43.3811, longitude: 3.5198 } ] },
];
export const centroid = (c: LatLng[]): LatLng => ({
  latitude: c.reduce((s, p) => s + p.latitude, 0) / c.length,
  longitude: c.reduce((s, p) => s + p.longitude, 0) / c.length,
});
