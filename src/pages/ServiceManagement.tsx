import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import RichTextEditor from '../components/TextEditor';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Service {
  _id?: string;
  slug?: string;
  service_title: string;
  service_title_url?: string;
  small_image: File | string;
  large_image: File | string;
  side_image: File | string;
  service_content: string;
  serviceSeoDetails?: { _id: string; /* other SEO fields if needed */ };
  status?: string;
  createdAt?: string;
}

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Service>({
    service_title: '',
    service_title_url: '',
    small_image: '',
    large_image: '',
    side_image: '',
    service_content: ''
  });

  const API_BASE = `${import.meta.env.VITE_PROD}`;  // adjust as needed

  // Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_BASE}`);
      const data = res.data;
      setServices(data.data || data);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error('Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      service_title: '',
      service_title_url: '',
      small_image: '',
      large_image: '',
      side_image: '',
      service_content: ''
    });
    setEditingService(null);
    setShowForm(false);
  };
console.log(services);

  // Handle file field changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'small_image' | 'large_image' | 'side_image') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  // Handle text / content changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!formData.service_title || !formData.service_content) {
    toast.warning('Please fill required fields');
    return;
  }

  const payload = new FormData();
  payload.append('service_title', formData.service_title);
  if (formData.service_title_url) {
    payload.append('service_title_url', formData.service_title_url);
  }
  payload.append('service_content', formData.service_content);

  if (formData.small_image instanceof File) {
    payload.append('small_image', formData.small_image);
  }
  if (formData.large_image instanceof File) {
    payload.append('large_image', formData.large_image);
  }
  if (formData.side_image instanceof File) {
    payload.append('side_image', formData.side_image);
  }

  // Show loading toast
  const loadingToastId = toast.loading('Saving service...');

  try {
    let res;
    if (editingService && editingService._id) {
      // UPDATE
      res = await axios.put(
        `${API_BASE}/update/${editingService._id}`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    } else {
      // CREATE
      res = await axios.post(
        `${API_BASE}/create`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    }

    const data = res.data;
    if (!res.status || res.status >= 400) {
      throw new Error(data.message || 'Error saving service');
    }

    // Update toast to success
    toast.update(loadingToastId, {
      render: editingService && editingService._id ? 'Service updated successfully!' : 'Service created successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
    });

    if (editingService && editingService._id) {
      setServices(prev =>
        prev.map(s => s._id === data.data._id ? data.data : s)
      );
    } else {
      setServices(prev => [...prev, data.data]);
    }

    resetForm();
  } catch (err: any) {
    console.error('Error saving service:', err);
    // Update toast to error
    toast.update(loadingToastId, {
      render: err.message || 'Failed to save service',
      type: 'error',
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
    });
  }
};


  // Delete
  const handleDelete = async (id?: string) => {
    if (!id) {
      toast.warning('No ID provided for deletion');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await axios.delete(`${API_BASE}/deleteMany/${id}`);
      const data = res.data;
      if (res.status >= 400) {
        throw new Error(data.message || 'Failed to delete service');
      }
      setServices(prev => prev.filter(s => s._id !== id));
      toast.success('Service deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting service:', err);
      toast.error(err.message || 'An error occurred while deleting service');
    }
  };

  // Delete SEO
  const handleDeleteSeo = async (seoId: string) => {
    if (!seoId) return;
    if (!window.confirm('Delete SEO?')) return;
    try {
      const res = await axios.delete(`http://localhost:8003/SeoRouter/delete/${seoId}`);
      const data = res.data;
      if (res.status >= 400) throw new Error(data.message || 'Failed to delete SEO');
      toast.success('SEO deleted successfully!');
      fetchServices();
    } catch (err: any) {
      console.error('Error deleting SEO:', err);
      toast.error(err.message || 'Failed to delete SEO');
    }
  };

  // Set up edit
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      service_title: service.service_title,
      service_title_url: service.service_title_url || '',
      small_image: service.small_image,
      large_image: service.large_image,
      side_image: service.side_image,
      service_content: service.service_content
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium">Service Title *</label>
                  <input
                    type="text"
                    name="service_title"
                    required
                    value={formData.service_title}
                    onChange={handleChange}
                    placeholder="Service Title"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                {/* <div>
                  <label className="block mb-1 font-medium">Service Title URL (optional)</label>
                  <input
                    type="text"
                    name="service_title_url"
                    value={formData.service_title_url || ''}
                    onChange={handleChange}
                    placeholder="Service Title URL"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div> */}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* <div>
                  <label className="block mb-1">Small Image</label>
                  {typeof formData.small_image === 'string' && editingService && (
                    <img
                      src={formData.small_image}
                      alt="small"
                      className="w-24 h-24 object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'small_image')}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div> */}
                <div>
                  <label className="block mb-1">Side Image</label>
                  {typeof formData.large_image === 'string' && editingService && (
                    <img
                      src={formData.large_image}
                      alt="large"
                      className="w-24 h-24 object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'large_image')}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Banner</label>
                  {typeof formData.side_image === 'string' && editingService && (
                    <img
                      src={formData.side_image}
                      alt="side"
                      className="w-24 h-24 object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'side_image')}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Service Content *</label>
                <RichTextEditor
                  value={formData.service_content}
                  onChange={(value: string) =>
                    setFormData(prev => ({ ...prev, service_content: value }))
                  }
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     {/* Services Table */}
<div className="bg-white shadow rounded-lg overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Title</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Side Image</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Large Image</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Content Preview</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Slug</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">SEO Status</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {services.length === 0 ? (
        <tr>
          <td colSpan={7} className="text-center py-4 text-gray-500">
            No services found.
          </td>
        </tr>
      ) : (
        services.map(svc => (
          <tr key={svc._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{svc.service_title}</div>
              {svc.service_title_url && (
                <div className="text-xs text-gray-500 truncate">{svc.service_title_url}</div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {typeof svc.side_image === 'string' && svc.side_image ? (
                <a
                  href={svc.side_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Image
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {typeof svc.large_image === 'string' && svc.large_image ? (
                <a
                  href={svc.large_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Image
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </td>
            <td className="px-6 py-4 max-w-xs text-sm text-gray-700 overflow-hidden whitespace-nowrap overflow-ellipsis">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    svc.service_content.length > 100
                      ? svc.service_content.slice(0, 100) + "..."
                      : svc.service_content,
                }}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{svc.slug || '-'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {svc.serviceSeoDetails ? (
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-semibold">Done</span>
                  <button
                    onClick={() => handleDeleteSeo(svc.serviceSeoDetails!._id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label="Delete SEO"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-yellow-600 font-semibold">Pending</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap space-x-3">
              <button
                onClick={() => handleEdit(svc)}
                className="text-blue-600 hover:text-blue-900"
                aria-label="Edit Service"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(svc._id)}
                className="text-red-600 hover:text-red-900"
                aria-label="Delete Service"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default ServiceManagement;
