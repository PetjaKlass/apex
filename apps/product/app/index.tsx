import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.thread} />
        <Text style={styles.title}>Apex</Text>
        <Text style={styles.subtitle}>Product app — Phase 01</Text>
      </View>
    </SafeAreaView>
  );
}

// Bewusst StyleSheet statt Tokens: Design-Tokens kommen in Phase 02 (siehe Phasen-Spec).
// Farben entsprechen design-system v4.1 (Graphit-Canvas, Goldener Faden als Gruß).
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080A' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  thread: { width: 2, height: 48, backgroundColor: '#C9993A', borderRadius: 1, marginBottom: 24 },
  title: { fontSize: 56, fontWeight: '700', color: '#F8F7F4', letterSpacing: -1.5 },
  subtitle: { marginTop: 12, fontSize: 15, color: 'rgba(248,247,244,0.55)' },
});
