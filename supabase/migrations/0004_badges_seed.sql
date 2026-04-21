-- MindReset Kathu — badges catalogue seed
-- Keep this file in sync with src/content/badges.ts

insert into public.badges (id, name, description, emoji, xp_reward, sort_order) values
  ('first-reset',   'First Reset',      'You completed your first daily quest. The algorithm starts shifting.', '🚀',  10, 1),
  ('flame-spark',   'Flame Spark',      'Two days in a row. The habit is waking up.',                            '🔥',   5, 10),
  ('flame-steady',  'Flame Steady',     'Three-day streak. This is becoming who you are.',                       '🔥',  10, 11),
  ('flame-blaze',   'Blaze',            'Seven days straight. Your brain is re-wiring itself.',                  '🔥',  25, 12),
  ('flame-inferno', 'Inferno',          'Fourteen days. You''ve built a rhythm most adults wish they had.',       '🔥',  50, 13),
  ('week-1-done',   'Rebooted',         'You finished Week 1 — Reboot Your Brain.',                              '🧠',  50, 21),
  ('week-2-done',   'Feels Fluent',     'You finished Week 2 — Why Your Emotions Aren''t the Enemy.',             '💙',  50, 22),
  ('week-3-done',   'Word Warrior',     'You finished Week 3 — The Words You Speak Over Yourself.',              '🗣️',  50, 23),
  ('week-4-done',   'Rooted',           'You finished Week 4 — Pressure, Stress, and How to Stay Grounded.',     '🌳',  50, 24),
  ('week-5-done',   'Unseen Faithful',  'You finished Week 5 — Who Are You When No-One Is Watching?',            '🕯️',  50, 25),
  ('week-6-done',   'Iron Sharpener',   'You finished Week 6 — Relationships That Build You or Break You.',      '⚔️',  50, 26),
  ('week-7-done',   'Purposeful',       'You finished Week 7 — Purpose: Why You''re Here and Where You''re Going.', '🎯', 50, 27),
  ('reset-complete','Reset Complete',   'All 7 weeks. You showed up. Something genuinely shifted.',              '👑', 300, 30),
  ('scribe',        'Scribe',           'Ten journal entries. Your honest words are doing something.',            '📓',  30, 40)
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  emoji       = excluded.emoji,
  xp_reward   = excluded.xp_reward,
  sort_order  = excluded.sort_order;

-- Default cohort so sign-ups attach to something
insert into public.cohorts (name, slug)
values ('CRC Kathu Youth 2026', 'crc-kathu-youth-2026')
on conflict (slug) do nothing;
