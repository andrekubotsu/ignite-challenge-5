import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDate(date: string): string {
  const formatedDate = format(parseISO(date), 'dd MMM YYY', {
    locale: ptBR,
  });

  return formatedDate;
}
