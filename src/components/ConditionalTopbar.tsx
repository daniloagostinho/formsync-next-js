'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Topbar from './Topbar';

const ConditionalTopbar: React.FC = React.memo(() => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Rotas que NÃO devem mostrar o Topbar (páginas públicas) - memoized
  const publicRoutes = useMemo(() => [
    '/',
    '/login',
    '/registrar',
    '/verificar-codigo',
  ], []);

  // Verificar se deve mostrar o Topbar - memoized
  const shouldShowTopbar = useMemo(() => {
    if (isLoading) return false;
    if (publicRoutes.includes(pathname)) return false;
    return isAuthenticated;
  }, [isLoading, pathname, publicRoutes, isAuthenticated]);

  if (!shouldShowTopbar) {
    return null;
  }

  return <Topbar />;
});

ConditionalTopbar.displayName = 'ConditionalTopbar';

export default ConditionalTopbar;
