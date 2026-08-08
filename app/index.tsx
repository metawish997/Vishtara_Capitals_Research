import React from 'react';
import { View } from 'react-native';

export default function Index() {
  // This empty screen serves as the initial route.
  // The layout's useEffect will automatically redirect the user
  // to either /(tabs) or /pages/auth/welcome based on authentication state.
  return <View style={{ flex: 1, backgroundColor: '#020210' }} />;
}
