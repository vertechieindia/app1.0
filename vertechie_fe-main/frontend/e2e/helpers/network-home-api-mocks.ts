import type { Page, Route } from '@playwright/test';

import { e2eVerifiedTechieUser, E2E_VERIFIED_TECHIE_ID } from './techie-session';

const JSON_CT = { 'Content-Type': 'application/json' };

export type TechieHomeMockTier = 'smoke' | 'interactions';

function apiPathFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const marker = '/api/v1';
  const i = pathname.indexOf(marker);
  if (i === -1) return pathname;
  let rest = pathname.slice(i + marker.length) || '/';
  if (rest.length > 1 && rest.endsWith('/')) rest = rest.slice(0, -1);
  return rest;
}

const mockFeedItem = {
  id: 'e2e-post-1',
  author_id: '2',
  author_name: 'E2E Colleague',
  author_title: 'Engineer',
  author_verified: false,
  content: 'Hello from E2E mock feed.',
  likes_count: 0,
  comments_count: 0,
  shares_count: 0,
  is_liked: false,
  is_saved: false,
  created_at: new Date().toISOString(),
  post_type: 'text',
};

const mockStatsSmoke = {
  connections_count: 0,
  followers_count: 0,
  following_count: 0,
  pending_requests_count: 0,
  group_memberships: 0,
  profile_views: 0,
};

const mockSuggestion = {
  id: '99',
  name: 'Suggested Person',
  title: 'Developer',
  company: 'ACME',
  mutual_connections: 0,
  is_verified: false,
  skills: [] as string[],
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    headers: JSON_CT,
    body: JSON.stringify(body),
  });
}

function buildMockGroup() {
  const longDesc =
    'A community group for E2E testing. We discuss quality, automation, and shipping reliable software together every week.';
  return {
    id: 'e2g-1',
    name: 'E2E Builders Club',
    slug: 'e2e-builders-club',
    description: longDesc,
    avatar_url: null,
    cover_url: null,
    member_count: 12,
    post_count: 4,
    category: 'technology',
    group_type: 'public',
    created_by_id: '99999',
    is_joined: false,
    can_edit: false,
    can_delete: false,
  };
}

function buildMockEvent() {
  const start = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  return {
    id: 'evt-e2e-1',
    title: 'E2E Future Webinar',
    description: 'A meaningful description for the event that is long enough for validation.',
    host_id: '5',
    host_name: 'Event Host',
    start_date: start,
    end_date: null,
    timezone: 'UTC',
    event_type: 'webinar' as const,
    is_virtual: true,
    meeting_link: 'https://example.com/meet',
    attendees_count: 4,
    is_registered: false,
    is_host: false,
    can_edit: false,
    can_delete: false,
    can_join_now: false,
    created_at: new Date().toISOString(),
  };
}

function buildMockCombinatorIdea() {
  return {
    id: 'idea-e2e-1',
    founder_id: '500',
    founder_name: 'Alex Founder',
    title: 'EcoTrack for cities',
    description:
      'This is a long enough description for the startup idea so the combinator page can render the card body.',
    problem: 'Carbon tracking is opaque for cities and needs transparency.',
    target_market: 'Smart cities',
    stage: 'idea',
    commitment: 'full-time',
    funding_status: 'Pre-seed',
    roles_needed: ['CTO'],
    skills_needed: ['Python', 'Kubernetes'],
    team_size: 2,
    founder_roles: ['CEO'],
    founder_skills: ['GTM', 'Sales'],
    views_count: 10,
    connections_count: 0,
    is_active: true,
    created_at: new Date().toISOString(),
  };
}

/**
 * Stubs network/feed/home APIs so techie home E2E does not require FastAPI.
 * - `smoke`: minimal payloads for navigation / feed visibility (default).
 * - `interactions`: richer data + targeted POST responses for feature checks.
 * Pair with page.unroute in afterEach (same glob pattern as in techie-home specs).
 */
export async function installTechieHomePanelApiMocks(
  page: Page,
  tier: TechieHomeMockTier = 'smoke',
): Promise<void> {
  const feedState = { items: [{ ...mockFeedItem }] };
  const eventsState = { list: tier === 'interactions' ? [buildMockEvent()] : [], registered: false };
  const groupsState = { list: tier === 'interactions' ? [buildMockGroup()] : [] };

  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const method = req.method();
    const path = apiPathFromUrl(req.url());

    if (method === 'GET' && path === '/users/me/profile') {
      await fulfillJson(route, {});
      return;
    }

    if (method === 'GET' && path === '/users/me') {
      await fulfillJson(route, e2eVerifiedTechieUser);
      return;
    }

    if (method === 'GET' && /^\/users\/\d+$/.test(path)) {
      await fulfillJson(route, {
        id: Number(path.split('/').pop()),
        first_name: 'Peer',
        last_name: 'User',
        email: 'peer@example.com',
        headline: 'Engineer',
        current_company: 'ACME Labs',
        is_verified: false,
      });
      return;
    }

    if (method === 'GET' && path === '/unified-network/stats') {
      if (tier === 'interactions') {
        await fulfillJson(route, {
          connections_count: 1,
          followers_count: 2,
          following_count: 3,
          pending_requests_count: 0,
          group_memberships: 1,
          profile_views: 5,
        });
        return;
      }
      await fulfillJson(route, mockStatsSmoke);
      return;
    }

    if (method === 'GET' && path === '/unified-network/feed') {
      await fulfillJson(route, feedState.items);
      return;
    }

    if (method === 'GET' && path === '/unified-network/trending') {
      await fulfillJson(route, [{ tag: 'E2E' }, { tag: 'Playwright' }]);
      return;
    }

    if (method === 'GET' && path.startsWith('/unified-network/suggestions/people')) {
      await fulfillJson(route, [mockSuggestion]);
      return;
    }

    if (method === 'GET' && path === '/community/events') {
      if (tier === 'interactions' && eventsState.registered) {
        await fulfillJson(
          route,
          eventsState.list.map((e) => ({ ...e, is_registered: true })),
        );
        return;
      }
      await fulfillJson(route, eventsState.list);
      return;
    }

    if (method === 'GET' && path === '/community/groups') {
      await fulfillJson(route, groupsState.list);
      return;
    }

    if (method === 'GET' && path === '/community/combinator/ideas') {
      await fulfillJson(route, tier === 'interactions' ? [buildMockCombinatorIdea()] : []);
      return;
    }

    if (method === 'GET' && path === '/network/following') {
      await fulfillJson(route, []);
      return;
    }

    if (method === 'GET' && path === '/network/connections') {
      if (tier === 'interactions') {
        await fulfillJson(route, [
          {
            user_id: E2E_VERIFIED_TECHIE_ID,
            connected_user_id: 77,
            connected_at: new Date().toISOString(),
          },
        ]);
        return;
      }
      await fulfillJson(route, []);
      return;
    }

    if (method === 'GET' && path === '/network/requests/sent') {
      await fulfillJson(route, []);
      return;
    }

    if (method === 'GET' && path === '/network/requests/received') {
      await fulfillJson(route, []);
      return;
    }

    if (method === 'GET' && path === '/hiring/notifications/unread-count') {
      await fulfillJson(route, { unread_count: 0 });
      return;
    }

    if (method === 'GET' && path === '/chat/conversations/unread-count') {
      await fulfillJson(route, { unread_count: 0 });
      return;
    }

    if (tier === 'interactions') {
      const likeMatch = path.match(/^\/community\/posts\/([^/]+)\/like$/);
      if (method === 'POST' && likeMatch) {
        await fulfillJson(route, { likes_count: 1, is_liked: true });
        return;
      }

      const commentsMatch = path.match(/^\/community\/posts\/([^/]+)\/comments$/);
      if (method === 'GET' && commentsMatch) {
        await fulfillJson(route, []);
        return;
      }
      if (method === 'POST' && commentsMatch) {
        await fulfillJson(route, {
          id: 'comment-e2e-1',
          author: { id: '1', name: 'E2E Techie' },
          content: 'Great post!',
          likes_count: 0,
          replies_count: 0,
          created_at: new Date().toISOString(),
        });
        return;
      }

      if (method === 'POST' && path === '/community/posts') {
        let body: Record<string, unknown> = {};
        try {
          body = req.postDataJSON() as Record<string, unknown>;
        } catch {
          body = {};
        }
        const content = String(body.content || 'New post');
        const newId = `e2e-new-${Date.now()}`;
        const row = {
          id: newId,
          author_id: String(E2E_VERIFIED_TECHIE_ID),
          author_name: 'E2E Techie',
          author_title: 'Member',
          author_verified: true,
          content,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          is_liked: false,
          is_saved: false,
          created_at: new Date().toISOString(),
          post_type: String(body.post_type || 'text'),
        };
        feedState.items = [row, ...feedState.items];
        await fulfillJson(route, { id: newId, ...row });
        return;
      }

      const repostMatch = path.match(/^\/community\/posts\/([^/]+)\/repost$/);
      if (method === 'POST' && repostMatch) {
        await fulfillJson(route, { id: `repost-${repostMatch[1]}` });
        return;
      }

      const joinGroupMatch = path.match(/^\/community\/groups\/([^/]+)\/join$/);
      if (method === 'POST' && joinGroupMatch) {
        await fulfillJson(route, { message: 'joined' });
        return;
      }

      const registerMatch = path.match(/^\/community\/events\/([^/]+)\/register$/);
      if (method === 'POST' && registerMatch) {
        eventsState.registered = true;
        await fulfillJson(route, { message: 'registered' });
        return;
      }

      const connectIdeaMatch = path.match(/^\/community\/combinator\/ideas\/([^/]+)\/connect$/);
      if (method === 'POST' && connectIdeaMatch) {
        await fulfillJson(route, { message: 'Connection request sent!' });
        return;
      }
    }

    if (method === 'GET') {
      await fulfillJson(route, []);
      return;
    }

    if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
      await fulfillJson(route, {});
      return;
    }

    await route.continue();
  });
}
