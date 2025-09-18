"use client";
import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import RichTextEditor from "../components/TextEditor";
import axios from "axios";
import { toast } from "react-toastify";

// interface Blog {
//   _id: string;
//   blog_title: string;
//   blog_title_url: string;
//   blog_content: string;
//   small_image: string;
//   large_image: string;
//   blogSeoDetails?: Object;
//   banner: string | null;
//   status: string;
//   createdAt: string;
// }

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
  blogSeoDetails?: BlogSeoDetails; // ✅ instead of Object
  banner: string | null;
  status: string;
  createdAt: string;
}



const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      _id: "",
      blog_title: "Sample Blog Post",
      blog_title_url: "This is a sample blog_title_url",
      blog_content: "This is the main blog_content of the blog post...",
      small_image: "",
      large_image: "",
      banner: "",
      status: "Published",
      createdAt: "2024-01-15",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    blog_title: "",
    blog_title_url: "",
    blog_content: "",
    small_image: null as string | null,
    large_image: null as string | null,
    banner: null as string | null,
  });

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_PROD}/blogs`, {
        withCredentials: true,
      });

      setBlogs(res.data)
      console.log(res, "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [field]: file,              // store File object
      [`${field}Preview`]: URL.createObjectURL(file), // optional preview
    }));
  };

  // Submit blog
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("blog_title", formData.blog_title);
  //     formDataToSend.append("blog_title_url", formData.blog_title_url);
  //     formDataToSend.append("blog_content", formData.blog_content);

  //     // Append files (real File objects, not blob URLs)
  //     if (formData.small_image) {
  //       formDataToSend.append("small_image", formData.small_image);
  //     }
  //     if (formData.large_image) {
  //       formDataToSend.append("large_image", formData.large_image);
  //     }
  //     if (formData.banner) {
  //       formDataToSend.append("banner", formData.banner);
  //     }

  //     const response = await axios.post("/blogs", formDataToSend, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     console.log("📌 Blog successfully saved:", response);
  //  toast.success("blog created  successfully")


  //     // update state
  //     setBlogs((prev) =>
  //       editingBlog
  //         ? prev.map((b) => (b._id === editingBlog._id ? response.data : b))
  //         : [...prev, response.data]
  //     );

  //     resetForm();
  //   } catch (error: any) {
  //     console.error("❌ Error submitting blog:", error.response?.data || error.message);
  //     toast.error("❌ Error submitting blog:", error.response?.data || error.message);

  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("blog_title", formData.blog_title);
      formDataToSend.append("blog_title_url", formData.blog_title_url);
      formDataToSend.append("blog_content", formData.blog_content);

      if (formData.small_image) formDataToSend.append("small_image", formData.small_image);
      if (formData.large_image) formDataToSend.append("large_image", formData.large_image);
      if (formData.banner) formDataToSend.append("banner", formData.banner);

      // 👉 Wrap axios call in toast.promise
      const response = await toast.promise(
        axios.post(`${import.meta.env.VITE_PROD}/blogs`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ✅ REQUIRED for cookies to be sent
        }),
        {
          pending: "⏳ Creating blog...",
          success: "✅ Blog created successfully!",
          error: "❌ Error submitting blog",
        }
      );

      console.log(response, "654684791651847")

      // update state
      setBlogs((prev) =>
        editingBlog
          ? prev.map((b) => (b._id === editingBlog._id ? response.data : b))
          : [...prev, response.data]
      );

      resetForm();
    } catch (error: any) {
      console.error("❌ Error submitting blog:", error.response?.data || error.message);
      // error already handled by toast.promise
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      blog_title: "",
      blog_title_url: "",
      blog_content: "",
      small_image: null,
      large_image: null,
      banner: null,
    });
    setShowForm(false);
    setEditingBlog(null);
  };

  // Edit blog
  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      blog_title: blog.blog_title,
      blog_title_url: blog.blog_title_url,
      blog_content: blog.blog_content,
      small_image: blog.small_image,
      large_image: blog.large_image,
      banner: blog.banner,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Confirmation popup
      const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
      if (!confirmDelete) return; // stop if user cancels

      // API call
      const response = await axios.delete(`${import.meta.env.VITE_PROD}/blogs/deleteBlog/${id}`, {
        withCredentials: true,
      });

      // Success log
      console.log("✅ Blog deleted:", response.data);
      toast.success("Blog deleted successfully!");
      fetchBlogs()
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("❌ Server Error:", error.response.data);
        toast.error(`Failed to delete blog: ${error.response.data.message || "Server error"}`);
      } else if (error.request) {
        // No response from server
        console.error("❌ Network Error:", error.request);
        toast.error("No response from server. Please try again later.");
      } else {
        // Something else went wrong
        console.error("❌ Error:", error.message);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleDeleteSeo = async (id: string) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_PROD}/SeoRouter/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("SEO deleted successfully!");
    fetchBlogs()
    } catch (error) {
      console.error("Error deleting SEO:", error);
      // handle error (toast, alert, etc.)
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900"></h1>
        <button
          onClick={() => setShowForm(true)}
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
              <h2 className="text-xl font-semibold">
                {editingBlog ? "Edit Blog" : "Add New Blog"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.blog_title}
                    onChange={(e) =>
                      setFormData({ ...formData, blog_title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog blog_title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog blog_title_url *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.blog_title_url}
                    onChange={(e) =>
                      setFormData({ ...formData, blog_title_url: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog blog_title_url"
                  />
                </div>
              </div>
              {/* Images */}
              <div className="grid md:grid-cols-3 gap-4">
                {["small_image", "large_image", "banner"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.toUpperCase()}<p className="text-red-400">Image size should be 6MB</p>

                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {formData[field as keyof typeof formData] && (
                      <img
                        src={formData[field as keyof typeof formData] as string}
                        alt="Preview"
                        className="mt-2 h-20 w-full object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
              

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog blog_content *
                </label>
                <RichTextEditor
                  value={formData.blog_content}
                  onChange={(blog_content: string) =>
                    setFormData({ ...formData, blog_content })
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBlog ? "Update" : "Create"} Blog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Blog Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Blog Title Url                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SEO


                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Large Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Samall Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {blog.blog_title}
                      </div>

                    </div>
                  </td>
                  <td className=" px-6 py-4 whitespace-nowrap">

                    <td
                      className="px-6 py-4 text-sm text-gray-500"
                      dangerouslySetInnerHTML={{ __html: blog.blog_content.slice(0, 30) }}
                    />

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.blog_title_url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.blogSeoDetails ? <div className="flex items-center">
                      {/* <button
                      onClick={() => handleDeleteSeo(blog?.blogSeoDetails?._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button> */}
                      <button
                        onClick={() => handleDeleteSeo(blog.blogSeoDetails?._id!)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p>Yes</p>
                    </div> : "No"}

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a target="_blank" href={blog.banner!}>Click to view</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a target="_blank" href={blog.small_image}>Click to view</a>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      {/* <Edit className="w-4 h-4" /> */}
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
