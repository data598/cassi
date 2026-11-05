export type Theme = {
  dark: boolean; bg: string; surface: string; text: string; subtext: string;
  primary: string; accent: string; border: string; parcelFill: string; parcelStroke: string;
  ok: string; ko: string;
};
export const light: Theme = {
  dark: false, bg: '#F6F4EE', surface: '#FFFFFF', text: '#1F2A1F', subtext: '#6B7568',
  primary: '#4F7A28', accent: '#8E2C48', border: '#E3E0D5',
  parcelFill: 'rgba(79,122,40,0.28)', parcelStroke: '#4F7A28', ok: '#3BB54A', ko: '#D64545',
};
export const dark: Theme = {
  dark: true, bg: '#121712', surface: '#1D241C', text: '#EEF2EA', subtext: '#9AA595',
  primary: '#8DC04F', accent: '#D1607F', border: '#2C352A',
  parcelFill: 'rgba(141,192,79,0.30)', parcelStroke: '#8DC04F', ok: '#4CD964', ko: '#FF6B6B',
};
