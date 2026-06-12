import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Timer } from 'lucide-react-native';
import { Button, Card, Input } from '@apex/ui';
import { useTheme } from '@/lib/theme';

export default function ComponentsTestScreen() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [mail, setMail] = useState('peter.klass1990@gmail');
  const [pw, setPw] = useState('geheim123');
  const [search, setSearch] = useState('Phase 09');

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerClassName="gap-4 p-6 pb-16">
        <Text className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">
          Dev — Components (Phase 04)
        </Text>

        <Card header="Button" hint="5 Varianten × 3 Größen">
          <View className="flex-row flex-wrap items-center gap-3">
            <Button variant="primary" onPress={simulateLoad} loading={loading}>
              Fokus starten
            </Button>
            <Button variant="secondary" onPress={() => {}}>
              Sekundär
            </Button>
            <Button variant="ghost" onPress={() => {}}>
              Ghost
            </Button>
            <Button variant="danger-ghost" onPress={() => {}}>
              Löschen
            </Button>
            <Button variant="primary" disabled onPress={() => {}}>
              Inaktiv
            </Button>
          </View>
          <View className="mt-4 flex-row flex-wrap items-center gap-3">
            <Button size="sm" variant="secondary" icon={Plus} onPress={() => {}}>
              Klein
            </Button>
            <Button size="md" variant="secondary" icon={Timer} onPress={() => {}}>
              Mittel
            </Button>
            <Button
              size="lg"
              variant="primary"
              icon={Timer}
              onPress={simulateLoad}
              loading={loading}
            >
              Groß
            </Button>
            <Button
              iconOnly
              icon={Plus}
              variant="secondary"
              accessibilityLabel="Neue Aufgabe"
              onPress={() => {}}
            />
          </View>
        </Card>

        <Card header="Input" hint="5 Typen · Fokus/Fehler/Disabled">
          <View className="gap-4">
            <Input
              label="Aufgabe"
              placeholder="Größe €100 für Müller…"
              value={text}
              onChangeText={setText}
              hint="Umlaut-Test: ä ö ü ß"
            />
            <Input
              type="email"
              label="E-Mail"
              value={mail}
              onChangeText={setMail}
              required
              error={
                mail.includes('@') && mail.includes('.')
                  ? undefined
                  : 'Bitte gültige E-Mail angeben.'
              }
            />
            <Input type="password" label="Passwort" value={pw} onChangeText={setPw} />
            <Input
              type="search"
              label="Suche"
              placeholder="Suchen…"
              value={search}
              onChangeText={setSearch}
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  size="sm"
                  label="Klein (sm)"
                  value=""
                  onChangeText={() => {}}
                  placeholder="34px"
                />
              </View>
              <View className="flex-1">
                <Input
                  size="lg"
                  label="Groß (lg)"
                  value=""
                  onChangeText={() => {}}
                  placeholder="50px"
                />
              </View>
            </View>
            <Input label="Deaktiviert" value="Nicht editierbar" onChangeText={() => {}} disabled />
          </View>
        </Card>

        <Card
          variant="hoverable"
          header="Card — hoverable"
          hint="Web: Lift · Nativ: Press"
          accessibilityLabel="Beispielkarte öffnen"
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          footer={
            <Text className="text-fg-3 text-xs">
              Footer-Slot · Tipp: Klick togglet das Theme ({theme})
            </Text>
          }
        >
          <Text className="text-fg-2 text-sm">
            Die ganze Karte ist klickbar — der einzige erlaubte Hover-Lift (card.md).
          </Text>
        </Card>

        <Card header="Card — subtle in default">
          <Card variant="subtle">
            <Text className="text-fg-2 text-sm">
              Eingebetteter Block als variant=&quot;subtle&quot; — niemals Card-in-Card
              (Layer-Regel).
            </Text>
          </Card>
        </Card>

        <Pressable
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="items-center py-2"
        >
          <Text className="text-accent-text text-sm">Theme wechseln ({theme})</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
