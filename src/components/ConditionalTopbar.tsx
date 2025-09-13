'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Topbar from './Topbar';

const ConditionalTopbar: React.FC = React.memo(() => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Rotas que NÃO devem mostrar o Topbar (páginas públicas e área logada) - memoized
  const publicRoutes = useMemo(() => [
    '/',
    '/login',
    '/registrar',
    '/verificar-codigo',
  ], []);

  // Rotas da área logada que usam DashboardLayout (não devem mostrar este Topbar)
  const dashboardRoutes = useMemo(() => [
    '/dashboard',
    '/formularios',
    '/perfil',
    '/analytics',
    '/upload-csv',
  ], []);

  // Verificar se deve mostrar o Topbar - memoized
  const shouldShowTopbar = useMemo(() => {
    if (isLoading) return false;
    if (publicRoutes.includes(pathname)) return false;
    if (dashboardRoutes.some(route => pathname.startsWith(route))) return false;
    return isAuthenticated;
  }, [isLoading, pathname, publicRoutes, dashboardRoutes, isAuthenticated]);

  if (!shouldShowTopbar) {
    return null;
  }

  return <Topbar />;
});

ConditionalTopbar.displayName = 'ConditionalTopbar';

export default ConditionalTopbar;
