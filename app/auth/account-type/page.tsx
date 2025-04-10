'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AccountType {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const accountTypes: AccountType[] = [
  {
    id: 'retirement',
    title: 'Retirement Account',
    description: 'Click to select',
    icon: '👴'
  },
  {
    id: 'health',
    title: 'Health Saving',
    description: 'Click to select',
    icon: '🏥'
  },
  {
    id: 'inheritance',
    title: 'Inheritance Account',
    description: 'Click to select',
    icon: '💰'
  },
  {
    id: 'brokerage',
    title: 'Brokerage Account',
    description: 'Click to select',
    icon: '📈'
  },
  {
    id: 'college',
    title: 'College Savings Plans',
    description: 'Click to select',
    icon: '🎓'
  }
];

export default function AccountTypePage() {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleAccountType = (typeId: string) => {
    const newSelected = new Set(selectedTypes);
    if (newSelected.has(typeId)) {
      newSelected.delete(typeId);
    } else {
      newSelected.add(typeId);
    }
    setSelectedTypes(newSelected);
  };

  const handleContinue = () => {
    if (selectedTypes.size > 0) {
      const selectedTypesArray = Array.from(selectedTypes).map(type => {
        const accountType = accountTypes.find(at => at.id === type);
        return {
          id: type,
          title: accountType?.title || type
        };
      });
      const queryParam = encodeURIComponent(JSON.stringify(selectedTypesArray));
      router.push(`/auth/register?accountTypes=${queryParam}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1629] pt-24">
      {/* Main content */}
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Choose Your Account Types
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Select one or more account types to get started
        </p>

        <div className="space-y-3">
          {accountTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleAccountType(type.id)}
              className={`w-full p-4 rounded-lg flex items-center justify-between
                ${
                  selectedTypes.has(type.id)
                    ? 'bg-blue-600 border-2 border-blue-400'
                    : 'bg-[#1a2744] hover:bg-[#243255]'
                }
                transition-all duration-200 ease-in-out`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div className="text-left">
                  <h3 className="text-white font-medium">{type.title}</h3>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center
                ${
                  selectedTypes.has(type.id)
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-gray-400'
                }`}
              >
                {selectedTypes.has(type.id) && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedTypes.size === 0}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium mt-6
            ${
              selectedTypes.size > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-600 cursor-not-allowed'
            }
            transition-colors duration-200`}
        >
          Continue to Registration ({selectedTypes.size} selected) →
        </button>

        <p className="text-center text-gray-400 mt-4 mb-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
} 