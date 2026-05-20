import type enDict from '../dictionaries/en.json';

export type Dictionary = typeof enDict;

const dictionaries = {
  ua: () => import('../dictionaries/ua.json').then((m) => m.default as Dictionary),
  en: () => import('../dictionaries/en.json').then((m) => m.default as Dictionary),
};

export async function getDictionary(lang: string): Promise<Dictionary> {
  const loader = dictionaries[lang as keyof typeof dictionaries] ?? dictionaries.en;
  return loader();
}
