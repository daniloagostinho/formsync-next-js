'use client';

import React from 'react';
import { TemplateManager } from '@/components/TemplateManager';
import DashboardLayout from '@/components/DashboardLayout';

export default function TemplateManagerPage() {
  return (
    <DashboardLayout>
      <TemplateManager />
    </DashboardLayout>
  );
}

