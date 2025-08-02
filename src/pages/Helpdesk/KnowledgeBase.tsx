/**
 * Helpdesk Knowledge Base Page
 * Author: VB Entreprise
 * 
 * Article management with rich text editor, categories, tags,
 * and usage analytics for self-service support
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Eye, ThumbsUp, ThumbsDown, Edit, Tag, Users } from 'lucide-react';
import CreateArticleModal from '../../components/Modals/CreateArticleModal';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  views: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  icon: string;
}

const mockCategories: Category[] = [
  { id: '1', name: 'Getting Started', description: 'Basic setup and onboarding', articleCount: 12, icon: '🚀' },
  { id: '2', name: 'Account Management', description: 'User accounts and permissions', articleCount: 8, icon: '👤' },
  { id: '3', name: 'Billing & Payments', description: 'Invoice and payment help', articleCount: 15, icon: '💳' },
  { id: '4', name: 'Technical Issues', description: 'Troubleshooting and fixes', articleCount: 23, icon: '🔧' },
  { id: '5', name: 'Integrations', description: 'Third-party app connections', articleCount: 9, icon: '🔗' }
];

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'How to Create Your First Project',
    content: 'This guide will walk you through creating your first project in the system...',
    category: 'Getting Started',
    tags: ['projects', 'setup', 'beginner'],
    author: 'Sarah Johnson',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    status: 'published',
    views: 1250,
    helpfulVotes: 45,
    unhelpfulVotes: 3,
    featured: true
  },
  {
    id: '2',
    title: 'Understanding Invoice Status',
    content: 'Learn about different invoice statuses and what they mean...',
    category: 'Billing & Payments',
    tags: ['invoices', 'billing', 'status'],
    author: 'Mike Chen',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    status: 'published',
    views: 890,
    helpfulVotes: 32,
    unhelpfulVotes: 5,
    featured: false
  },
  {
    id: '3',
    title: 'Troubleshooting Login Issues',
    content: 'Common solutions for login problems and account access...',
    category: 'Technical Issues',
    tags: ['login', 'troubleshooting', 'access'],
    author: 'Support Team',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
    status: 'published',
    views: 2100,
    helpfulVotes: 78,
    unhelpfulVotes: 12,
    featured: true
  }
];

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [categories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getHelpfulnessRatio = (helpful: number, unhelpful: number) => {
    const total = helpful + unhelpful;
    return total > 0 ? Math.round((helpful / total) * 100) : 0;
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const publishedArticles = articles.filter(a => a.status === 'published');
  const avgHelpfulness = Math.round(
    articles.reduce((sum, article) => sum + getHelpfulnessRatio(article.helpfulVotes, article.unhelpfulVotes), 0) / articles.length
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-2 text-gray-600">
            Create and manage help articles with rich text editor, categories, and usage analytics.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            New Article
          </button>
        </div>
      </div>

      {/* Knowledge Base Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              <p className="text-sm text-gray-500">{publishedArticles.length} published</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+15% this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <ThumbsUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Helpfulness</p>
              <p className="text-2xl font-bold text-gray-900">{avgHelpfulness}%</p>
              <p className="text-sm text-green-600 mt-1">High satisfaction</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="p-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-sm font-medium">All Articles</div>
                <div className="text-xs text-gray-500">{articles.length} articles</div>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{category.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.articleCount} articles</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>

          {/* Featured Articles */}
          {selectedCategory === 'all' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.filter(article => article.featured).map((article) => (
                  <div key={article.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{article.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{article.content.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.views} views
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {getHelpfulnessRatio(article.helpfulVotes, article.unhelpfulVotes)}% helpful
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helpfulness</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{article.title}</div>
                          <div className="text-sm text-gray-500">by {article.author}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm text-gray-900">{article.helpfulVotes}</span>
                          <ThumbsDown className="h-4 w-4 text-red-500 ml-2 mr-1" />
                          <span className="text-sm text-gray-900">{article.unhelpfulVotes}</span>
                          <span className="ml-2 text-sm text-green-600">
                            ({getHelpfulnessRatio(article.helpfulVotes, article.unhelpfulVotes)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.updatedAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Article Modal */}
      <CreateArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(articleData) => {
          setArticles(prev => [...prev, articleData]);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}