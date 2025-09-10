import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Service {
  id: number;
  service_title: string;
  service_title_url: string;
  small_image: string;
  large_image: string;
  side_image: string;
  service_content: string;
  serviceSeoDetails?: string;
  status: string;
  createdAt: string;
}

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      service_title: 'Web Development',
      service_title_url: 'web-development',
      small_image: '',
      large_image: '',
      side_image: '',
      service_content: 'We provide comprehensive web development services...',
      serviceSeoDetails: '',
      status: 'Active',
      createdAt: '2024-01-15'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    service_title: '',
    service_title_url: '',
    small_image: '',
    large_image: '',
    side_image: '',
    service_content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData }
          : service
      ));
    } else {
      const newService: Service = {
        id: Date.now(),
        ...formData,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setServices([...services, newService]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      service_title: '',
      service_title_url: '',
      small_image: '',
      large_image: '',
      side_image: '',
      service_content: ''
    });
    setShowForm(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      service_title: service.service_title,
      service_title_url: service.service_title_url,
      small_image: service.small_image,
      large_image: service.large_image,
      side_image: service.side_image,
      service_content: service.service_content
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Service</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingService ? 'Edit Service' : 'Add New Service'}
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
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.service_title}
                    onChange={(e) => setFormData({...formData, service_title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter service title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.service_title_url}
                    onChange={(e) => setFormData({...formData, service_title_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter service title URL"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Small Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.small_image}
                    onChange={(e) => setFormData({...formData, small_image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter small image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Large Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.large_image}
                    onChange={(e) => setFormData({...formData, large_image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter large image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Side Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.side_image}
                    onChange={(e) => setFormData({...formData, side_image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter side image URL"
                  />
                </div>
              </div>

           

              <iframe src="https://docs.google.com/document/d/e/2PACX-1vQ1NTPGMmotJcchBT_Sdkw8GCOVnkcJ15cu9pxNzsmlC3RnXxfYqjtejtJWlrttPVNhiLvtHiWzy7qc/pub?embedded=true"></iframe>


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
                  <span>{editingService ? 'Update' : 'Create'} Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{service.service_title}</div>
                      <div className="text-sm text-gray-500">{service.service_title_url}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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

export default ServiceManagement;