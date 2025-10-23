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
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="w-full"
    >
      <div className="max-w-2xl w-full mx-auto">
        {/* Compact Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl flex-shrink-0">
            {getCardEmoji()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 uppercase tracking-wide font-medium">
                {cardType}
              </span>
              {cardNumber === 6 && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                  Bonus
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-white leading-tight">
          {question}
        </h3>

        {/* Input based on type */}
        <div className="relative">
          {inputType === 'text' && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <textarea
                value={textValue}
                onChange={handleTextChange}
                placeholder={placeholder || 'Share your thoughts...'}
                className="w-full h-40 px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 resize-none transition-all duration-300 text-lg"
                autoFocus
              />
              <div className="absolute bottom-3 right-3 text-xs text-white/30">
                {textValue.length}/500
              </div>
            </motion.div>
          )}

          {inputType === 'multi_select' && (
            <motion.div
              className="space-y-3"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMultiSelect(option)}
                  className={`w-full px-6 py-5 rounded-2xl text-left transition-all duration-300 ${
                    selectedOptions.includes(option)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-white border-2 border-white/10 hover:border-purple-500/50 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedOptions.includes(option)
                        ? 'border-white bg-white'
                        : 'border-white/30'
                    }`}>
                      {selectedOptions.includes(option) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
              <p className="text-sm text-white/40 mt-6 text-center">✨ Select all that apply</p>
            </motion.div>
          )}

          {inputType === 'single_select' && (
            <motion.div
              className="space-y-3"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSingleSelect(option)}
                  className={`w-full px-6 py-5 rounded-2xl text-left transition-all duration-300 ${
                    singleOption === option
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-white border-2 border-white/10 hover:border-purple-500/50 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      singleOption === option
                        ? 'border-white bg-white'
                        : 'border-white/30'
                    }`}>
                      {singleOption === option && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-purple-600"
                        />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {inputType === 'slider' && (
            <motion.div
              className="space-y-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Value Display */}
              <div className="flex items-center justify-center mb-8">
                <motion.div
                  key={sliderValue}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  {sliderValue}
                </motion.div>
              </div>

              {/* Labels */}
              <div className="flex justify-between text-sm text-white/60 mb-4 px-2">
                <span className="font-medium">{sliderLabels?.min || 'Low'}</span>
                <span className="font-medium">{sliderLabels?.max || 'High'}</span>
              </div>

              {/* Custom Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #9333ea 0%, #ec4899 ${sliderValue}%, rgba(255,255,255,0.1) ${sliderValue}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                {/* Slider thumb glow effect */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none blur-md"
                  style={{
                    left: `calc(${sliderValue}% - 12px)`,
                  }}
                />
              </div>

              {/* Tick Marks */}
              <div className="flex justify-between text-xs text-white/30 px-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


