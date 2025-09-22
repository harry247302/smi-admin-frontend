import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import RichTextEditor from '../components/TextEditor';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Service {
  _id?: string;
  service_title: string;
  service_title_url: string;
  small_image: File | string;
  large_image: File | string;
  side_image: File | string;
  service_content: string;
  serviceSeoDetails?: string;
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

  const API_BASE = 'http://localhost:8003/service';

  // ================= FETCH ALL SERVICES =================
  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();
      setServices(data.data || data);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error('Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ================= CREATE / UPDATE =================
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const form = new FormData();
  //     form.append('service_title', formData.service_title);
  //     form.append('service_title_url', formData.service_title_url);
  //     form.append('service_content', formData.service_content);

  //     // Append files if they are File objects
  //     if (formData.small_image instanceof File) form.append('small_image', formData.small_image);
  //     if (formData.large_image instanceof File) form.append('large_image', formData.large_image);
  //     if (formData.side_image instanceof File) form.append('side_image', formData.side_image);

  //     let res;
  //     if (editingService?._id) {
  //       // UPDATE
  //       res = await fetch(`${API_BASE}/update/${editingService._id}`, {
  //         method: 'PUT',
  //         body: form
  //       });
  //     } else {
  //       // CREATE
  //       res = await fetch(`${API_BASE}/create`, {
  //         method: 'POST',
  //         body: form
  //       });
  //     }


  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || 'Error saving service');

  //     if (editingService?._id) {
  //       setServices(services.map(s => s._id === data.data._id ? data.data : s));
  //       toast.success('Service updated successfully!');
  //     } else {
  //       setServices([...services, data.data]); 

  //       toast.success('Service created successfully!');
  //     }

  //     resetForm();
  //   } catch (err: any) {
  //     console.error('Error saving service:', err);
  //     toast.error(err.message || 'Failed to save service');
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("service_title", formData.service_title);
    form.append("service_title_url", formData.service_title_url);
    form.append("service_content", formData.service_content);

    if (formData.small_image instanceof File)
      form.append("small_image", formData.small_image);
    if (formData.large_image instanceof File)
      form.append("large_image", formData.large_image);
    if (formData.side_image instanceof File)
      form.append("side_image", formData.side_image);

    const request = async () => {
      let res;
      if (editingService?._id) {
        // UPDATE
        res = await fetch(`${API_BASE}/update/${editingService._id}`, {
          method: "PUT",
          body: form,
        });
      } else {
        // CREATE
        res = await fetch(`${API_BASE}/create`, {
          method: "POST",
          body: form,
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving service");

      if (editingService?._id) {
        setServices(
          services.map((s) => (s._id === data.data._id ? data.data : s))
        );
      } else {
        setServices([...services, data.data]);
      }

      resetForm();
      return editingService?._id
        ? "Service updated successfully!"
        : "Service created successfully!";
    };

    toast.promise(request(), {
      pending: "Submitting your service...",
      success: {
        render({ data }) {
          return data as string;
        },
      },
      error: {
        render({ data }) {
          return (data as Error).message || "Failed to save service";
        },
      },
    });
  };

  console.log(services, "|||||||||||||||||||||||||||||||||||");
  // ================= DELETE =================
  const handleDelete = async (id?: string) => {
    if (!id) return toast.warning('No ID provided for deletion');
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`${API_BASE}/deleteMany/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (response.ok) {
        // console.log(response,"|||||||||||||||||||||||||||");

        setServices(prev => prev.filter(s => s._id !== id));
        toast.success('Service deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('An error occurred while deleting service');
    }
  };



  const handleDeleteSeo = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this SEO?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_PROD}/SeoRouter/delete/${id}`,
        { withCredentials: true }
      );
      toast.success("SEO deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting SEO:", error);
      toast.error("Failed to delete SEO!");
    }
  };

  // ================= RESET FORM =================
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

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({ ...service });
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

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  required
                  value={formData.service_title}
                  onChange={e => setFormData({ ...formData, service_title: e.target.value })}
                  placeholder="Service Title"
                  className="w-full px-3 py-2 border rounded"
                />
                {/* <input
                  type="text"
                  required
                  value={formData.service_title_url}
                  onChange={e => setFormData({ ...formData, service_title_url: e.target.value })}
                  placeholder="Service Title URL"
                  className="w-full px-3 py-2 border rounded"
                /> */}
              </div>

              <div className="">
                {/* <p>Small Image</p>
                <input
                  type="file"
                  onChange={e => setFormData({ ...formData, small_image: e.target.files?.[0] || '' })}
                  className="w-full px-3 py-2 border rounded"
                /> */}
                <p className='mt-5'>Small Image</p>
                <input
                  type="file"
                  onChange={e => setFormData({ ...formData, large_image: e.target.files?.[0] || '' })}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className='mt-5'>Banner</p>
                <input
                  type="file"
                  onChange={e => setFormData({ ...formData, side_image: e.target.files?.[0] || '' })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <RichTextEditor
                value={formData.service_content}
                onChange={(service_content: string) => setFormData({ ...formData, service_content })}
              />

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICES TABLE */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Small Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map(service => (
              <tr key={service._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{service.service_title}</div>
                  <div className="text-sm text-gray-500">{service.service_title_url}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {/* {service.status || 'Active'} */}
                    <a target="_blank" rel="noopener noreferrer" href={service?.side_image as string}>
                      Click To View
                    </a>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {/* {service.createdAt?.split('T')[0]} */}
                  <a target='_blank' href={service?.large_image as string}>Click To View</a>
                </td>

                <td className=" px-6 py-4 whitespace-nowrap">

                  <td
                    className="px-6 py-4 text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: service.service_content.slice(0, 30) }}
                  />

                </td>
                <td className="px-6 py-4 space-x-2">
                  {service?.serviceSeoDetails ? (
                    <div>
                      Done
                      <button
                        onClick={() => handleDeleteSeo(service?.serviceSeoDetails?._id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      Pending
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 space-x-2">
                  {/* <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4" />
                  </button> */}
                  <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceManagement;
