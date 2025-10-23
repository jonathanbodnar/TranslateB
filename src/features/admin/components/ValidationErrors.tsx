import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ValidationError } from '../types';

interface ValidationErrorsProps {
  errors: ValidationError[];
}

/**
 * ValidationErrors Component
 * Displays validation errors in a user-friendly format
 */
export function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div className="glass-card p-4 mb-4 border-l-4 border-red-500">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-400 font-medium mb-2">
            Validation Failed ({errors.length} error{errors.length !== 1 ? 's' : ''})
          </h3>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-300 text-sm">
                <span className="font-mono text-xs bg-red-900/30 px-2 py-0.5 rounded">
                  {error.path}
                </span>
                {': '}
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

