import { PersonalityBuckets, PersonalityProfile } from '../types';

export const calculatePersonalityScore = (buckets: PersonalityBuckets): PersonalityBuckets => {
  const total = Object.values(buckets).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return { feeling: 25, sensing: 25, intuition: 25, thinking: 25 };
  }
  
  return {
    feeling: Math.round((buckets.feeling / total) * 100),
    sensing: Math.round((buckets.sensing / total) * 100),
    intuition: Math.round((buckets.intuition / total) * 100),
    thinking: Math.round((buckets.thinking / total) * 100),
  };
};

export const getTopBuckets = (buckets: PersonalityBuckets, count: number = 2): [string, number][] => {
  const entries = Object.entries(buckets) as [string, number][];
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);
};

export const getPersonalityDescription = (profile: PersonalityProfile): string => {
  const topTwo = getTopBuckets(profile.buckets, 2);
  const primary = topTwo[0][0];
  const secondary = topTwo[1][0];
  
  const descriptions = {
    feeling: 'emotionally aware and empathetic',
    thinking: 'logical and analytical', 
    sensing: 'practical and detail-oriented',
    intuition: 'creative and pattern-focused'
  };
  
  return `You primarily process through ${descriptions[primary as keyof typeof descriptions]} and ${descriptions[secondary as keyof typeof descriptions]} approaches.`;
};

export const getBucketColor = (bucket: string): string => {
  const colors = {
    feeling: 'from-pink-400 to-red-400',
    sensing: 'from-green-400 to-emerald-400',
    intuition: 'from-purple-400 to-indigo-400',
    thinking: 'from-blue-400 to-cyan-400',
  };
  
  return colors[bucket as keyof typeof colors] || 'from-gray-400 to-gray-500';
};

export const generatePersonalityInsights = (profile: PersonalityProfile): string[] => {
  const topBuckets = getTopBuckets(profile.buckets, 2);
  const insights: string[] = [];
  
  // Generate insights based on top buckets
  if (topBuckets[0][0] === 'feeling') {
    insights.push('You tend to lead with empathy in difficult conversations');
    insights.push('Your communication style is naturally warm and inclusive');
  }
  
  if (topBuckets[0][0] === 'thinking') {
    insights.push('You approach problems with logical analysis first');
    insights.push('You prefer clear, structured communication');
  }
  
  if (topBuckets[0][0] === 'sensing') {
    insights.push('You focus on practical, concrete details');
    insights.push('You communicate best with specific examples');
  }
  
  if (topBuckets[0][0] === 'intuition') {
    insights.push('You see patterns and possibilities others might miss');
    insights.push('You prefer big-picture conversations over details');
  }
  
  // Add secondary insights
  if (topBuckets.length > 1) {
    const secondary = topBuckets[1][0];
    if (secondary === 'feeling') {
      insights.push('You process conflict through emotional understanding');
    }
  }
  
  return insights;
};
