import React from 'react';
import { PREDEFINED_SCENARIOS } from '../constants';
import { ScenarioOption } from '../types';

interface ScenarioSelectorProps {
  selectedScenario: ScenarioOption | null;
  onSelect: (scenario: ScenarioOption) => void;
  customPrompt: string;
  onCustomPromptChange: (val: string) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenario,
  onSelect,
  customPrompt,
  onCustomPromptChange
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        2. 选择应用场景
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {PREDEFINED_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all
              ${selectedScenario?.id === scenario.id
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-2xl mb-1">{scenario.icon}</span>
            <span className="font-medium">{scenario.label}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          或者自定义描述 (优先级最高):
        </label>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder="例如：挑选其中1只熊放在牛仔裤口袋旁边..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>
    </div>
  );
};