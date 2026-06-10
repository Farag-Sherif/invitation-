import { useWeddingData } from '../context/WeddingDataContext';

export default function useTheme() {
  const { activeInvitation, updateInvitation } = useWeddingData();
  
  const theme = activeInvitation?.theme || {
    primaryColor: '#C9A84C',
    secondaryColor: '#D4707A',
    accentColor: '#F9E8B9',
    backgroundColor: '#0B0E17',
    textColor: '#FFFFFF',
    cardColor: 'rgba(255, 255, 255, 0.03)',
    animationSpeed: '1',
    borderRadius: '16px',
    fontFamily: "'Tajawal', sans-serif"
  };

  const updateField = (field, value) => {
    if (!activeInvitation) return;
    const updatedTheme = {
      ...theme,
      [field]: value
    };
    updateInvitation(activeInvitation.slug, { theme: updatedTheme });
  };

  const resetTheme = () => {
    if (!activeInvitation) return;
    const defaultTheme = {
      primaryColor: '#C9A84C',
      secondaryColor: '#D4707A',
      accentColor: '#F9E8B9',
      backgroundColor: '#0B0E17',
      textColor: '#FFFFFF',
      cardColor: 'rgba(255, 255, 255, 0.03)',
      animationSpeed: '1',
      borderRadius: '16px',
      fontFamily: "'Tajawal', sans-serif"
    };
    updateInvitation(activeInvitation.slug, { theme: defaultTheme });
  };

  return { theme, updateField, resetTheme };
}
