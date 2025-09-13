'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper para lazy loading de componentes
 * Melhora a performance carregando componentes apenas quando necessário
 */
const LazyWrapper: React.FC<LazyWrapperProps> = React.memo(({ 
  children, 
  fallback = <LoadingSpinner size="lg" className="my-8" />
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
});

LazyWrapper.displayName = 'LazyWrapper';

/**
 * Função helper para criar componentes lazy
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return React.memo((props: React.ComponentProps<T>) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyWrapper>
  ));
}

export default LazyWrapper;
