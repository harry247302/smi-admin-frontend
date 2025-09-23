"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import RichTextEditor from "../components/TextEditor";
import axios from "axios";
import { toast } from "react-toastify";

interface BlogSeoDetails {
  _id: string;
}

interface Blog {
  _id: string;
  blog_title: string;
  blog_title_url: string;
  blog_content: string;
  small_image: string;
  large_image: string;
  blogSeoDetails?: BlogSeoDetails;
  banner: string | null;
  status: string;
  createdAt: string;
}

type FileOrNull = File | null;

interface FormDataState {
  blog_title: string;
  blog_title_url: string;
  blog_content: string;
  small_image: FileOrNull;
  large_image: FileOrNull;
  banner: FileOrNull;
  small_imagePreview: string | null;
  large_imagePreview: string | null;
  bannerPreview: string | null;
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [formData, setFormData] = useState<FormDataState>({
    blog_title: "",
    blog_title_url: "",
    blog_content: "",
    small_image: null,
    large_image: null,
    banner: null,
    small_imagePreview: null,
    large_imagePreview: null,
    bannerPreview: null,
  });

  // Cleanup refs for object URLs to avoid memory leaks
  const filePreviewsRef = useRef<(string | null)[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch blogs list
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_PROD}/blogs`, {
        withCredentials: true,
      });
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    }
  };

  // Clean up object URLs to avoid memory leaks
  const revokePreviews = () => {
    filePreviewsRef.current.forEach((url) => url && URL.revokeObjectURL(url));
    filePreviewsRef.current = [];
  };

  // Handle file input changes for images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormDataState) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Revoke previous preview URL if any for this field
    const prevUrl = formData[`${field}Preview` as keyof FormDataState];
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      [field]: file,
      [`${field}Preview`]: previewUrl,
    }));

    // Track URLs to revoke on unmount
    filePreviewsRef.current.push(previewUrl);
  };

  // Reset form and clear editing state
  const resetForm = () => {
    revokePreviews();
    setFormData({
      blog_title: "",
      blog_title_url: "",
      blog_content: "",
      small_image: null,
      large_image: null,
      banner: null,
      small_imagePreview: null,
      large_imagePreview: null,
      bannerPreview: null,
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  // Populate form for editing a blog
  const handleEdit = (blog: Blog) => {
    revokePreviews();

    setFormData({
      blog_title: blog.blog_title,
      blog_title_url: blog.blog_title_url,
      blog_content: blog.blog_content,
      small_image: null,
      large_image: null,
      banner: null,
      small_imagePreview: blog.small_image || null,
      large_imagePreview: blog.large_image || null,
      bannerPreview: blog.banner || null,
    });

    setEditingBlog(blog);
    setShowForm(true);
  };

  // Submit create or update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();

      formPayload.append("blog_title", formData.blog_title);
      formPayload.append("blog_title_url", formData.blog_title_url);
      formPayload.append("blog_content", formData.blog_content);

      if (formData.small_image) formPayload.append("small_image", formData.small_image);
      if (formData.large_image) formPayload.append("large_image", formData.large_image);
      if (formData.banner) formPayload.append("banner", formData.banner);

      let response;

      if (editingBlog) {
        // Update existing blog
        response = await toast.promise(
          axios.put(`${import.meta.env.VITE_PROD}/blogs/${editingBlog._id}`, formPayload, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }),
          {
            pending: "⏳ Updating blog...",
            success: "✅ Blog updated successfully!",
            error: "❌ Failed to update blog",
          }
        );
      } else {
        // Create new blog
        response = await toast.promise(
          axios.post(`${import.meta.env.VITE_PROD}/blogs`, formPayload, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }),
          {
            pending: "⏳ Creating blog...",
            success: "✅ Blog created successfully!",
            error: "❌ Failed to create blog",
          }
        );
      }

      // Update blogs state
      setBlogs((prev) =>
        editingBlog
          ? prev.map((b) => (b._id === editingBlog._id ? response.data : b))
          : [...prev, response.data]
      );

      resetForm();
    } catch (error: any) {
      console.error("Error submitting blog:", error.response?.data || error.message);
      // toast.promise handles error notification already
    }
  };

  // Delete blog handler
  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this blog?")) return;

      await axios.delete(`${import.meta.env.VITE_PROD}/blogs/deleteBlog/${id}`, {
        withCredentials: true,
      });

      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error: any) {
      console.error("Error deleting blog:", error.response?.data || error.message);
      toast.error("Failed to delete blog");
    }
  };

  // Delete SEO handler
  const handleDeleteSeo = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_PROD}/SeoRouter/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("SEO deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting SEO:", error);
      toast.error("Failed to delete SEO");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Blog</span>
        </button>
      </div>

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{editingBlog ? "Edit Blog" : "Add New Blog"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.blog_title}
                    onChange={(e) => setFormData({ ...formData, blog_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog title"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.blog_title_url}
                    onChange={(e) => setFormData({ ...formData, blog_title_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog title URL"
                  />
                </div> */}
              </div>

              {/* Image inputs */}
              <div className="grid md:grid-cols-3 gap-4">
                {([ "large_image", "banner"] as (keyof FormDataState)[]).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === "large_image"?"Side Image":"Banner"} <br />
                      <span className="text-xs text-red-500">Max size: 6MB</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field)}
                      className="w-full border border-gray-300 rounded-lg p-1"
                    />
                    {/* Preview */}
                    {(formData[`${field}Preview` as keyof FormDataState] || formData[field]) && (
                      <img
                        src={
                          (formData[`${field}Preview` as keyof FormDataState] as string) ||
                          (typeof formData[field] === "string" ? (formData[field] as string) : "")
                        }
                        alt={`${field} preview`}
                        className="mt-2 h-20 w-full object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content *</label>
                <RichTextEditor
                  value={formData.blog_content}
                  onChange={(content) => setFormData({ ...formData, blog_content: content })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingBlog ? "Update Blog" : "Create Blog"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog List Table */}
      <div className="overflow-x-auto shadow rounded-lg overflow-hidden">
        <table className="w-full shadow rounded-lg overflow-hidden text-left border-collapse ">
          <thead className="bg-gray-100 ">
            <tr className="border-b ">
              <th className=" px-4 py-2">Blog Title</th>
              <th className=" px-4 py-2">Side Image</th>
              <th className=" px-4 py-2">Banner</th>
              <th className=" px-4 py-2">SEO</th>
              {/* <th className=" px-4 py-2">Created At</th> */}
              <th className=" px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}

            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{blog.blog_title}</td>
                 <td className="border border-gray-300 px-4 py-2">
                   {blog?.large_image? (
                      <a className=" text-blue-500 underline" href={blog?.large_image}>Click to view</a>
                    ):(
                      <p className="text-gray-500">Null</p>
                    )}
                 </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {blog?.large_image? (
                      <a target="_blank" className=" text-blue-500 underline" href={blog?.large_image}>Click to view</a>
                    ):(
                      <p className="text-gray-500">Null</p>
                    )}
                    </td>
                
                <td className="border border-gray-300 px-4 py-2">
                       {blog.blogSeoDetails ? (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-green-600">Done</span>
                                        <button
                                          onClick={() => handleDeleteSeo(blog.blogSeoDetails!._id)}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-yellow-600">Pending</span>
                                    )}
                </td>
                {/* <td className="border border-gray-300 px-4 py-2">{new Date(blog.createdAt).toLocaleDateString()}</td> */}
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-blue-600 hover:underline"
                    title="Edit Blog"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:underline"
                    title="Delete Blog"
                  >
                    Delete
                  </button>

                  {/* {blog.blogSeoDetails?._id && (
                    <button
                      onClick={() => handleDeleteSeo(blog.blogSeoDetails!._id)}
                      className="text-red-600 hover:underline ml-3"
                      title="Delete SEO"
                    >
                      Delete SEO
                    </button>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogManagement;
