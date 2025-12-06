import React, { useState, useEffect } from 'react';
import { Search, Newspaper, ExternalLink, Calendar, Globe } from 'lucide-react';

export default function NewsAggregator() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('technology');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [sortBy, setSortBy] = useState('publishedAt');

  const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

  const fetchNews = async (query = searchTerm, category = selectedCategory) => {
    setLoading(true);
    try {
      // Using NewsAPI.org free API (no key required for demo)
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      const endpoint = query
  ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&language=en&pageSize=20&apiKey=${apiKey}`
  : `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${apiKey}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.articles) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(searchTerm, selectedCategory);
  }, [selectedCategory, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">NewsFlow</h1>
              <p className="text-sm text-slate-400">Stay informed across all sources</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </form>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category && !searchTerm
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/30'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Sort Options */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {searchTerm ? `Results for "${searchTerm}"` : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News`}
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/50"
          >
            <option value="publishedAt">Latest</option>
            <option value="relevancy">Most Relevant</option>
            <option value="popularity">Trending</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="space-y-4 text-center">
              <div className="inline-block">
                <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
              </div>
              <p className="text-slate-400">Loading news...</p>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <article
                key={index}
                className="group rounded-xl overflow-hidden bg-slate-800/30 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Image */}
                {article.urlToImage && (
                  <div className="overflow-hidden h-48 bg-slate-900">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Source Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700/40 text-slate-300 text-xs font-medium">
                      <Globe className="w-3 h-3" />
                      {article.source?.name || 'News'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white mb-3 line-clamp-3 group-hover:text-blue-300 transition-colors">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 mb-4 flex-1 line-clamp-2">
                    {truncateText(article.description, 120)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.publishedAt)}
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
                    >
                      Read
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No articles found. Try a different search or category.</p>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}