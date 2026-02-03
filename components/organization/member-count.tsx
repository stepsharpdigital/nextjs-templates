// components/organization/member-count.tsx
'use client';

import { useState, useEffect } from 'react';
import { getMemberCountByOrganizationSlug } from '@/server/organizations';

export function MemberCount({ slug }: { slug: string }) {
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        setLoading(true);
        const count = await getMemberCountByOrganizationSlug(slug);
        setMemberCount(count);
      } catch (error) {
        console.error('Failed to fetch member count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberCount();
  }, [slug]);

  if (loading) {
    return <div>Loading member count...</div>;
  }

  return (
    <div className="member-count">
      <span className="font-semibold">{memberCount}</span> member(s)
    </div>
  );
}