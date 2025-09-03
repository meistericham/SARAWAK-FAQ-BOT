import { SearchMatch, SearchResult } from '../types';

// Enhanced knowledge base for Sarawak tourism with better keyword matching
const knowledgeBase = [
  {
    id: 'cultural-village-location',
    text: 'Sarawak Cultural Village is located at Damai Beach on the Santubong peninsula, about 30-40 minutes drive from Kuching city center. You can take a taxi or join a tour group to get there.',
    keywords: ['cultural village', 'sarawak cultural village', 'damai', 'santubong', 'location', 'where', 'kuching', 'drive', 'how to get']
  },
  {
    id: 'cultural-village-features',
    text: 'The Cultural Village showcases traditional houses of Sarawak\'s ethnic groups including Iban longhouse, Bidayuh baruk, Orang Ulu house, Melanau tall house, Malay house, and Chinese farmhouse. You can watch cultural performances and try traditional crafts.',
    keywords: ['cultural village', 'ethnic groups', 'iban', 'bidayuh', 'orang ulu', 'melanau', 'traditional houses', 'performances', 'crafts', 'what to see']
  },
  {
    id: 'kuching-waterfront',
    text: 'Kuching Waterfront is a scenic 1km esplanade along the Sarawak River. It features historic buildings, street food vendors, and offers beautiful sunset views. Perfect for evening walks and photography.',
    keywords: ['kuching', 'waterfront', 'sarawak river', 'historic', 'food', 'sunset', 'walk', 'photography', 'evening']
  },
  {
    id: 'sarawak-food',
    text: 'Must-try Sarawak foods include laksa Sarawak (with coconut milk and prawns), kolo mee (dry noodles), ayam pansuh (bamboo chicken), midin (jungle fern), and layer cake. Best found at local kopitiams and food courts.',
    keywords: ['food', 'laksa', 'kolo mee', 'ayam pansuh', 'midin', 'layer cake', 'eat', 'try', 'kuching', 'sarawak', 'kopitiam', 'must try']
  },
  {
    id: 'bako-national-park',
    text: 'Bako National Park is famous for proboscis monkeys, diverse wildlife, mangrove forests, and scenic coastal walks. Take a bus to Kampung Bako, then a boat to the park. Great for hiking and wildlife photography.',
    keywords: ['bako', 'national park', 'proboscis monkey', 'wildlife', 'mangrove', 'boat', 'kampung bako', 'hiking', 'photography', 'nature']
  },
  {
    id: 'mulu-caves',
    text: 'Mulu National Park features the world\'s largest cave chamber (Sarawak Chamber), Deer Cave, and Clear Water Cave. It\'s a UNESCO World Heritage site. Fly to Mulu Airport or take a river journey from Miri.',
    keywords: ['mulu', 'caves', 'deer cave', 'clear water cave', 'sarawak chamber', 'unesco', 'world heritage', 'limestone', 'miri', 'airport', 'how to get']
  },
  {
    id: 'longhouse-experience',
    text: 'Traditional longhouse stays offer authentic cultural experiences with Iban and Bidayuh communities. Enjoy traditional meals, cultural performances, and learn about indigenous customs. Book through tour operators in Kuching.',
    keywords: ['longhouse', 'iban', 'bidayuh', 'cultural experience', 'traditional meals', 'performances', 'indigenous', 'stay', 'overnight', 'authentic']
  },
  {
    id: 'sarawak-festivals',
    text: 'Major Sarawak festivals include Gawai Dayak (harvest festival in June), Rainforest World Music Festival (July), and various cultural celebrations. Each ethnic group has unique festivals throughout the year.',
    keywords: ['festivals', 'gawai dayak', 'rainforest music festival', 'cultural celebrations', 'harvest', 'events', 'when', 'celebrate']
  }
];

export async function searchKnowledgeBase(query: string, topK: number = 6): Promise<SearchResult> {
  console.log('🔍 Searching for:', query);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(' ').filter(word => word.length > 2);
  
  console.log('📝 Query words:', queryWords);
  
  // Enhanced scoring algorithm
  const scored = knowledgeBase.map(item => {
    let score = 0;
    
    // Direct text match (highest weight)
    if (item.text.toLowerCase().includes(queryLower)) {
      score += 0.8;
      console.log(`✅ Direct text match for "${item.id}": +0.8`);
    }
    
    // Keyword exact matches (high weight)
    const exactKeywordMatches = item.keywords.filter(keyword => 
      queryLower.includes(keyword) || keyword.includes(queryLower)
    );
    if (exactKeywordMatches.length > 0) {
      score += (exactKeywordMatches.length / item.keywords.length) * 0.7;
      console.log(`🎯 Exact keyword matches for "${item.id}": ${exactKeywordMatches.length} keywords, +${((exactKeywordMatches.length / item.keywords.length) * 0.7).toFixed(2)}`);
    }
    
    // Individual word matches in keywords
    const wordMatches = queryWords.filter(word => 
      item.keywords.some(keyword => keyword.includes(word))
    );
    if (wordMatches.length > 0) {
      score += (wordMatches.length / queryWords.length) * 0.5;
      console.log(`📝 Word matches for "${item.id}": ${wordMatches.length}/${queryWords.length} words, +${((wordMatches.length / queryWords.length) * 0.5).toFixed(2)}`);
    }
    
    // Individual word matches in text
    const textWordMatches = queryWords.filter(word => 
      item.text.toLowerCase().includes(word)
    );
    if (textWordMatches.length > 0) {
      score += (textWordMatches.length / queryWords.length) * 0.3;
      console.log(`📄 Text word matches for "${item.id}": ${textWordMatches.length}/${queryWords.length} words, +${((textWordMatches.length / queryWords.length) * 0.3).toFixed(2)}`);
    }
    
    console.log(`🏆 Final score for "${item.id}": ${score.toFixed(3)}`);
    
    return {
      id: item.id,
      text: item.text,
      score: Math.min(score, 0.95), // Cap at 0.95
      sourceId: item.id
    };
  });
  
  // Sort by score and take top K
  const matches = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(match => match.score > 0.1); // Filter out very low scores
  
  console.log('🎯 Top matches:', matches.map(m => ({ id: m.id, score: m.score.toFixed(3) })));
  
  return { matches };
}