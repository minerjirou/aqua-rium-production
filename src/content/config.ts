import { defineCollection, z } from 'astro:content';

const member = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    avatar: z.string().describe('R2 のパスまたは /public からの相対パス'),
    bio: z.string().optional(),
    reading: z.string().optional().describe('ふりがな/読み'),
    color: z.string().optional().describe('担当カラー（#RRGGBB）'),
    catchphrase: z.string().optional(),
    greeting: z.string().optional(),
    origin: z.string().optional(),
    heightCm: z.number().optional(),
    birthday: z.string().optional(),
    zodiac: z.string().optional(),
    likes: z.array(z.string()).default([]),
    dislikes: z.array(z.string()).default([]),
    features: z.string().optional(),
    xHandle: z.string().optional().describe('X/Twitter ハンドル (先頭@なし)'),
    youtubeChannelId: z.string().optional(),
    youtubeEmbed: z.string().optional().describe('YouTube埋め込みURL'),
    socials: z.array(z.object({ name: z.string(), url: z.string().url() })).default([]),
    fanTags: z.array(z.string()).default([]),
    awards: z.array(z.object({ year: z.string(), title: z.string() })).default([]),
    outfits: z.array(z.object({ name: z.string(), image: z.string() })).default([]),
    order: z.number().default(0),
    category: z.string().optional(),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
  }),
});

export const collections = { member, news };

