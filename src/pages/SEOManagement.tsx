import React, { useEffect, useState } from 'react';
import { Save, Search, Globe, Eye, Target } from 'lucide-react';
import axios from "axios";
import { toast } from "react-toastify";

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
  copyright: boolean;
  contentAuthor: number;
  googleSiteVerification: boolean;
  schemaMaprkup: string;
  cspHeader: string;
  enableHTTP3: boolean;
  enableBrotli: boolean;
  securityTxt: string;
  robotsMeta: string;
}


interface Blog {
  _id: string;
  blog_title: string;
}


const SEOManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [id, setId] = useState<string>("");
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
    copyright: false,
    contentAuthor: 0,
    googleSiteVerification: false,
    schemaMaprkup: '',
    cspHeader: '',
    enableHTTP3: true,
    enableBrotli: true,
    securityTxt: '',
    robotsMeta: 'index, follow',
  });

  const handleChange = <K extends keyof SEOData>(field: K, value: SEOData[K]) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!id) {
    toast.error("Please select a blog before submitting!");
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_PROD}/SeoRouter/CreateSeoFormBlog`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...seoData, blog_id: id }),
          credentials: "include", 
      }
    );

    // Check if response status is not 2xx
    if (!response.ok) {
      const errorData = await response.json();
      // If backend sends error message
      toast.error(errorData?.message || "Failed to submit SEO form");
      console.error("Backend Error:", errorData);
      return;
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Check if API response has a message
    if (data?.message) {
      toast.success(data.message); // Show success toast from API message
      window.location.reload()
    } else {
      toast.success("SEO linked successfully!");
    }
  } catch (error: any) {
    // Network errors or unexpected exceptions
    console.error("Unexpected Error:", error);
    toast.error(error?.message || "Something went wrong while submitting SEO!");
  }
};

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_PROD}/blogs`,{
         withCredentials: true,
      });
      setBlogs(res.data)

    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-gray-600 mt-1">Optimize your content for search engines</p>
        </div>
        <div className={`px-4 py-2 rounded-lg `}>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <select
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="px-2 py-1 rounded"
            >
              <option value="" disabled>Select</option>
              {blogs?.map((ele: any) => (
                <option key={ele._id} value={ele._id}>
                  {ele.blog_title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg">
        <div className="p-6 space-y-8">
          {/* Basic Meta Tags */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2" /> Basic Meta Tags
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title *</label>
                <input
                  type="text"
                  maxLength={60}
                  value={seoData.page_title}
                  onChange={(e) => handleChange('page_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meta title (50-60 chars)"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.page_title.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description *</label>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={seoData.metaDes}
                  onChange={(e) => handleChange('metaDes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meta description (150-160 chars)"
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.metaDes.length}/160 characters</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={seoData.metaKeywords}
                    onChange={(e) => handleChange('metaKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="keyword1, keyword2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
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
              <Globe className="w-5 h-5 mr-2" /> Open Graph (Facebook) Tags
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
                <input
                  type="text"
                  value={seoData.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Facebook share title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
              <textarea
                rows={2}
                value={seoData.ogDes}
                onChange={(e) => handleChange('ogDes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Facebook share description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
              <input
                type="url"
                value={seoData.OgImageUrl}
                onChange={(e) => handleChange('OgImageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Advanced SEO */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enable HTTP3</label>
              <input
                type="checkbox"
                checked={seoData.enableHTTP3}
                onChange={(e) => handleChange('enableHTTP3', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enable Brotli</label>
              <input
                type="checkbox"
                checked={seoData.enableBrotli}
                onChange={(e) => handleChange('enableBrotli', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Site Verification</label>
              <input
                type="checkbox"
                checked={seoData.googleSiteVerification}
                onChange={(e) => handleChange('googleSiteVerification', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
              <input
                type="checkbox"
                checked={seoData.copyright}
                onChange={(e) => handleChange('copyright', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Textareas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schema Markup</label>
              <textarea
                rows={3}
                value={seoData.schemaMaprkup}
                onChange={(e) => handleChange('schemaMaprkup', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste schema markup"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CSP Header / Internal Links</label>
              <textarea
                rows={3}
                value={seoData.cspHeader}
                onChange={(e) => handleChange('cspHeader', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List internal links or CSP rules"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Security Text / JSON-LD</label>
            <textarea
              rows={6}
              value={seoData.securityTxt}
              onChange={(e) => handleChange('securityTxt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Paste your JSON-LD schema markup here"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Robots Meta</label>
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
