'use client';

import React from 'react';
import { ConfirmDeleteData } from '@/types';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: ConfirmDeleteData;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 text-sm">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">
          Tem certeza que deseja deletar o template <strong>"{data.templateName}"</strong>?
        </p>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 border border-red-600 hover:border-red-700"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

