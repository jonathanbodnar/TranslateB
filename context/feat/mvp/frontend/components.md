## Component Contracts (Props)

WIMTSCarousel
```ts
type Props = {
  options: { option_id: string; title: string; body: string }[];
  onSelect(option_id: string): void;
};
```

TranslationTabs
```ts
type Props = {
  mode: '4'|'8';
  translations: Record<string, string>; // Thinker|Feeler|... or Te|Ti|...
  onTabChange?(key: string): void;
};
```

Constellation
```ts
type Props = {
  relationships: Relationship[];
  onSelect?(rel: Relationship): void;
};
```

InsightsFeed
```ts
type Props = {
  items: { insight_id: string; type: string; title: string; snippet: string; ts: string; tags: string[] }[];
  onLike?(id: string): void;
};
```

JsonEditor (Admin)
```ts
type Props = {
  value: any;
  schema?: any; // Zod schema
  onChange(value: any): void;
  onValidate?(errors: { path: string; message: string }[]): void;
};
```


