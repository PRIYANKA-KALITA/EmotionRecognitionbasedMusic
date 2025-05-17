import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  'All',
  'Relax',
  'Sad',
  'Party',
  'Romance',
  'Energetic',
  'Jazz',
  'Alternative'
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 p-1 min-w-max">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300
                      ${selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;