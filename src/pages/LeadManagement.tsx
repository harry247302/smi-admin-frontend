"use client";
import React, { useEffect, useState } from "react";
import { Search, Eye, Trash } from "lucide-react";
import axios from "axios";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  createdAt: string;
}

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://web.smilessence.co.in/enquiry");
      console.log(res,"||||||||||||||||||||||||||||||||||||||||||||");
      setLeads(res?.data?.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ✅ Toggle checkbox selection
  const toggleSelect = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  // ✅ Delete single lead
  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`https://web.smilessence.co.in/enquiry/${id}`);
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Failed to delete lead.");
    }
  };

  // ✅ Delete multiple leads
  const deleteSelected = async () => {
    if (selectedLeads.length === 0) {
      alert("Please select at least one lead to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete selected leads?")) return;

    try {
      await axios.delete("httphttps://web.smilessence.co.in/enquiry", {
        data: { ids: selectedLeads },
      });
      setLeads((prev) => prev.filter((lead) => !selectedLeads.includes(lead._id)));
      setSelectedLeads([]);
    } catch (error) {
      console.error("Error deleting leads:", error);
      alert("Failed to delete leads.");
    }
  };

  // ✅ Search filter
  const filteredLeads = leads.filter((lead) => {
    return (
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Total Leads: <span className="font-semibold">{leads.length}</span>
        </span>

        {/* Delete Button */}
        <button
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
        >
          <Trash className="w-4 h-4" />
          <span>Delete Selected</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
        {loading ? (
          <p className="p-4 text-gray-500">Loading leads...</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === leads.length && leads.length > 0}
                    onChange={(e) =>
                      setSelectedLeads(
                        e.target.checked ? leads.map((lead) => lead._id) : []
                      )
                    }
                  />
                </th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => toggleSelect(lead._id)}
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {lead.name}
                  </td>
                  <td className="px-6 py-3">{lead.email}</td>
                  <td className="px-6 py-3">{lead.phone}</td>
                  <td className="px-6 py-3">{lead.message}</td>
                  <td className="px-6 py-3">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => deleteLead(lead._id)}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                    >
                      <Trash className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;
