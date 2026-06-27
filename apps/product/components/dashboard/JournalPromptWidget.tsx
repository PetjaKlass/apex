import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Button, Card } from '@apex/ui';
import { SquarePen } from 'lucide-react-native';
import { useT } from '@/lib/i18n';

export function JournalPromptWidget({ done }: { done: boolean }) {
  const t = useT();
  return (
    <Card header={t('nav.journal')} hint={done ? t('status.synced') : undefined}>
      <Text className="text-fg-2 mb-4 text-sm">{t('dashboard.journalPrompt')}</Text>
      <Link href="/journal" asChild>
        <Button variant="secondary" size="sm" icon={SquarePen} onPress={() => {}}>
          {done ? t('common.edit') : t('dashboard.journalCta')}
        </Button>
      </Link>
    </Card>
  );
}
