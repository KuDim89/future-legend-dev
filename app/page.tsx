'use client';

import { useEffect } from 'react';

const BASE_PATH = '/future-legend-dev';

export default function RootPage() {
  useEffect(() => {
    const stored = localStorage.getItem('locale');
    const target = stored === 'en' ? 'en' : 'ua';
    window.location.replace(`${BASE_PATH}/${target}/`);
  }, []);

  return null;
}
