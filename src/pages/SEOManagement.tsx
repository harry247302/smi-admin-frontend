import React, { useState } from 'react';
import { Save, Search, Globe, Eye, Target } from 'lucide-react';

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: string;
  focusKeyword: string;
  seoScore: number;
  h1Tag: string;
  altTags: string;
  internalLinks: string;
  externalLinks: string;
  robotsMeta: string;
  schemaMarkup: string;
}

const SEOManagement: React.FC = () => {
  const [seoData, setSeoData] = useState<SEOData>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    twitterCard: 'summary_large_image',
    focusKeyword: '',
    seoScore: 0,
    h1Tag: '',
    altTags: '',
    internalLinks: '',
    externalLinks: '',
    robotsMeta: 'index, follow',
    schemaMarkup: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate a basic SEO score based on filled fields
    const filledFields = Object.values(seoData).filter(value => value.toString().trim() !== '').length;
    const seoScore = Math.round((filledFields / 20) * 100);
    setSeoData(prev => ({ ...prev, seoScore }));
    
    alert('SEO settings saved successfully!');
  };

  const handleChange = (field: keyof SEOData, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-gray-600 mt-1">Optimize your content for search engines</p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${getSEOScoreColor(seoData.seoScore)}`}>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span className="font-semibold">SEO Score: {seoData.seoScore}%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg">
        <div className="p-6 space-y-8">
          {/* Basic Meta Tags */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Basic Meta Tags
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title *
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={seoData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meta title (recommended: 50-60 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.metaTitle.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={seoData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meta description (recommended: 150-160 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.metaDescription.length}/160 characters</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={seoData.metaKeywords}
                    onChange={(e) => handleChange('metaKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={seoData.canonicalUrl}
                    onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/page"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Open Graph (Facebook) Tags
            </h2>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => handleChange('ogTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Facebook share title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OG Type
                  </label>
                  <select
                    value={seoData.ogType}
                    onChange={(e) => handleChange('ogType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="product">Product</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Description
                </label>
                <textarea
                  rows={2}
                  value={seoData.ogDescription}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Facebook share description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={seoData.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg (recommended: 1200x630px)"
                />
              </div>
            </div>
          </div>

          {/* Twitter Cards */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Twitter Card Tags
            </h2>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={seoData.twitterTitle}
                    onChange={(e) => handleChange('twitterTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Twitter share title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Card Type
                  </label>
                  <select
                    value={seoData.twitterCard}
                    onChange={(e) => handleChange('twitterCard', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Description
                </label>
                <textarea
                  rows={2}
                  value={seoData.twitterDescription}
                  onChange={(e) => handleChange('twitterDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Twitter share description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Image URL
                </label>
                <input
                  type="url"
                  value={seoData.twitterImage}
                  onChange={(e) => handleChange('twitterImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/twitter-image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Advanced SEO */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Advanced SEO Settings
            </h2>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={seoData.focusKeyword}
                    onChange={(e) => handleChange('focusKeyword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Primary keyword for this page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    H1 Tag
                  </label>
                  <input
                    type="text"
                    value={seoData.h1Tag}
                    onChange={(e) => handleChange('h1Tag', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Main heading of the page"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Tags (Images)
                  </label>
                  <textarea
                    rows={3}
                    value={seoData.altTags}
                    onChange={(e) => handleChange('altTags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List alt tags for images, one per line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Links
                  </label>
                  <textarea
                    rows={3}
                    value={seoData.internalLinks}
                    onChange={(e) => handleChange('internalLinks', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List internal links, one per line"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External Links
                  </label>
                  <textarea
                    rows={3}
                    value={seoData.externalLinks}
                    onChange={(e) => handleChange('externalLinks', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List external links, one per line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Robots Meta
                  </label>
                  <select
                    value={seoData.robotsMeta}
                    onChange={(e) => handleChange('robotsMeta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, follow">No Index, Follow</option>
                    <option value="index, nofollow">Index, No Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schema Markup (JSON-LD)
                </label>
                <textarea
                  rows={6}
                  value={seoData.schemaMarkup}
                  onChange={(e) => handleChange('schemaMarkup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Paste your JSON-LD schema markup here"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SEOManagement;