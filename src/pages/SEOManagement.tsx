import React, { useState } from 'react';
import { Save, Search, Globe, Eye, Target } from 'lucide-react';

interface SEOData {
  page_title: string;
  metaDes: string;
  metaKeywords: string;
  cannicalUrl: string;
  ogTitle: string;
  ogDes: string;
  OgImageUrl: string;
  OgType: string;
  hreflang: string;
  mobileFriendly: string;
  xmlSitemap: string;
  ampUrl: string;
  copyright: string;
  contentAuthor: number;
  googleSiteVerification: string;
  schemaMaprkup: string;
  cspHeader: string;
  enableHTTP3: boolean;
  enableBrotli: boolean;
  securityTxt: string;
}

const SEOManagement: React.FC = () => {
  const [seoData, setSeoData] = useState<SEOData>({
    page_title: '',
    metaDes: '',
    metaKeywords: '',
    cannicalUrl: '',
    ogTitle: '',
    ogDes: '',
    OgImageUrl: '',
    OgType: 'website',
    hreflang: '',
    mobileFriendly: '',
    xmlSitemap: '',
    ampUrl: 'summary_large_image',
    copyright: '',
    contentAuthor: 0,
    googleSiteVerification: '',
    schemaMaprkup: '',
    cspHeader: '',
    enableHTTP3: true,
    enableBrotli: true,
    securityTxt: ''
    
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();


  console.log(seoData);
  
  try {
    const response = await fetch("https://web.smilessence.co.in/SeoRouter/CreateSeoFormBlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...seoData,blog_id:"68c12bb2b5e569d36bf3e06f"}),
    });

    if (!response.ok) {
      throw new Error("Failed to submit SEO form");
    }

    const data = await response.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error("Error submitting SEO form:", error);
  }
};


  const handleChange = (field: keyof SEOData, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const getcontentAuthorColor = (score: number) => {
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
        <div className={`px-4 py-2 rounded-lg ${getcontentAuthorColor(seoData.contentAuthor)}`}>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span className="font-semibold">SEO Score: {seoData.contentAuthor}%</span>
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
                  value={seoData.page_title}
                  onChange={(e) => handleChange('page_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meta title (recommended: 50-60 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.page_title.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={seoData.metaDes}
                  onChange={(e) => handleChange('metaDes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meta description (recommended: 150-160 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.metaDes.length}/160 characters</p>
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
                    value={seoData.cannicalUrl}
                    onChange={(e) => handleChange('cannicalUrl', e.target.value)}
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
                    value={seoData.OgType}
                    onChange={(e) => handleChange('OgType', e.target.value)}
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
                  value={seoData.ogDes}
                  onChange={(e) => handleChange('ogDes', e.target.value)}
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
                  value={seoData.OgImageUrl}
                  onChange={(e) => handleChange('OgImageUrl', e.target.value)}
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
                    value={seoData.hreflang}
                    onChange={(e) => handleChange('hreflang', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Twitter share title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Card Type
                  </label>
                  <select
                    value={seoData.ampUrl}
                    onChange={(e) => handleChange('ampUrl', e.target.value)}
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
                  value={seoData.mobileFriendly}
                  onChange={(e) => handleChange('mobileFriendly', e.target.value)}
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
                  value={seoData.xmlSitemap}
                  onChange={(e) => handleChange('xmlSitemap', e.target.value)}
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
                    value={seoData.copyright}
                    onChange={(e) => handleChange('copyright', e.target.value)}
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
                    value={seoData.googleSiteVerification}
                    onChange={(e) => handleChange('googleSiteVerification', e.target.value)}
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
                    value={seoData.schemaMaprkup}
                    onChange={(e) => handleChange('schemaMaprkup', e.target.value)}
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
                    value={seoData.cspHeader}
                    onChange={(e) => handleChange('cspHeader', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List internal l0.inks, one per line"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                   Enable HTTP3
                  </label>
                  <textarea
                    rows={3}
                    // value={seoData.enableHTTP3}
                    // onChange={(e) => handleChange('enableHTTP3', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List external links, one per line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Robots Meta
                  </label>
                  <select
                    // value={seoData.enableBrotli}
                    // onChange={(e) => handleChange('enableBrotli', e.target.value)}
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
                  value={seoData.securityTxt}
                  onChange={(e) => handleChange('securityTxt', e.target.value)}
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