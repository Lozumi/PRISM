'use client';

import { useEffect } from 'react';

export default function Analytics51LA() {
  useEffect(() => {
    // 加载 51.LA 统计脚本
    const script = document.createElement('script');
    script.src = '/js/analytics-51la.js';
    script.async = true;
    script.charset = 'UTF-8';
    // 处理脚本加载错误
    script.onerror = () => {
      console.warn('Failed to load analytics script');
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
