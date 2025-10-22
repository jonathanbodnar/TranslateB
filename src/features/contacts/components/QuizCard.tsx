import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface QuizCardProps {
  cardNumber: number;
  cardType: string;
  question: string;
  inputType: 'text' | 'multi_select' | 'single_select' | 'slider';
  options?: string[];
  placeholder?: string;
  sliderLabels?: { min: string; max: string };
  onAnswer: (answer: any) => void;
  initialValue?: any;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  cardNumber,
  cardType,
  question,
  inputType,
  options = [],
  placeholder,
  sliderLabels,
  onAnswer,
  initialValue,
}) => {
  const [textValue, setTextValue] = useState<string>(
    initialValue && typeof initialValue === 'string' ? initialValue : ''
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialValue && Array.isArray(initialValue) ? initialValue : []
  );
  const [singleOption, setSingleOption] = useState<string>(
    initialValue && typeof initialValue === 'string' ? initialValue : ''
  );
  const [sliderValue, setSliderValue] = useState<number>(
    initialValue && typeof initialValue === 'number' ? initialValue : 50
  );

  const handleMultiSelect = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    setSelectedOptions(newSelection);
    onAnswer(newSelection);
  };

  const handleSingleSelect = (option: string) => {
    setSingleOption(option);
    onAnswer(option);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    onAnswer(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
    onAnswer(e.target.value);
  };

  // Get card type emoji
  const getCardEmoji = () => {
    switch (cardType) {
      case 'reflexes':
        return '⚡';
      case 'frustrations':
        return '😤';
      case 'fears':
        return '😰';
      case 'hopes':
        return '🌟';
      case 'derails':
        return '🚧';
      case 'conditional':
        return '🔀';
      default:
        return '💬';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-8 max-w-2xl w-full mx-auto"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400">
          Card {cardNumber} {cardNumber === 6 ? '(Bonus)' : ''}
        </span>
        <span className="text-3xl">{getCardEmoji()}</span>
      </div>

      {/* Question */}
      <h3 className="text-2xl font-semibold mb-8 text-white">{question}</h3>

      {/* Input based on type */}
      {inputType === 'text' && (
        <textarea
          value={textValue}
          onChange={handleTextChange}
          placeholder={placeholder || 'Type your response...'}
          className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      )}

      {inputType === 'multi_select' && (
        <div className="space-y-3">
          {options.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMultiSelect(option)}
              className={`w-full px-6 py-4 rounded-lg text-left transition-all ${
                selectedOptions.includes(option)
                  ? 'bg-purple-600 text-white border-2 border-purple-400'
                  : 'bg-gray-800/50 text-gray-200 border-2 border-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedOptions.includes(option) && (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </motion.button>
          ))}
          <p className="text-sm text-gray-400 mt-4">Select all that apply</p>
        </div>
      )}

      {inputType === 'single_select' && (
        <div className="space-y-3">
          {options.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSingleSelect(option)}
              className={`w-full px-6 py-4 rounded-lg text-left transition-all ${
                singleOption === option
                  ? 'bg-purple-600 text-white border-2 border-purple-400'
                  : 'bg-gray-800/50 text-gray-200 border-2 border-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {singleOption === option && (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="4" />
                  </svg>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {inputType === 'slider' && (
        <div className="space-y-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{sliderLabels?.min || 'Low'}</span>
            <span className="text-white text-lg font-semibold">{sliderValue}</span>
            <span>{sliderLabels?.max || 'High'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #9333ea 0%, #9333ea ${sliderValue}%, #374151 ${sliderValue}%, #374151 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};


