-- MindReset Kathu — realtime publication additions
-- Only community_posts and post_reactions stream via realtime.

alter publication supabase_realtime add table public.community_posts;
alter publication supabase_realtime add table public.post_reactions;
