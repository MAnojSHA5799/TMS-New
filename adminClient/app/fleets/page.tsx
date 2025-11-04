"use client";

import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import api from "@/lib/apiClient";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface Tenant {
  tenant_id: string;
  tenant_name: string;
}

interface Fleet {
  fleet_id: string;
  tenant_id: string;
  fleet_name: string;
  fleet_type: string;
  description: string;
  is_active: boolean;
}

interface FleetForm {
  tenant_id: string;
  fleet_name: string;
  fleet_type: string;
  description: string;
  is_active: boolean;
}

export default function FleetsPage() {
  const qc = useQueryClient();

  // ✅ Fetch fleets
  const { data: fleets = [], isLoading } = useQuery<Fleet[]>(["fleets"], async () => {
    const res = await api.get("/fleets");
    return res.data;
  });

  // ✅ Fetch tenants
  const { data: tenants = [] } = useQuery<Tenant[]>(["tenants"], async () => {
    const res = await api.get("/tenants");
    return res.data;
  });

  // ✅ Snackbar and Confirm Dialog states
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: "",
    message: "",
  });

  // ✅ Mutations
  const create = useMutation({
    mutationFn: async (payload: FleetForm) => await api.post("/fleets", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fleets"] });
      setShowForm(false);
      setAlert({
        open: true,
        message: "Fleet created successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setAlert({
        open: true,
        message: "Failed to create fleet!",
        severity: "error",
      });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FleetForm }) =>
      await api.patch(`/fleets/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fleets"] });
      setShowForm(false);
      setEditId(null);
      setAlert({
        open: true,
        message: "Fleet updated successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setAlert({
        open: true,
        message: "Failed to update fleet!",
        severity: "error",
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await api.delete(`/fleets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fleets"] }),
  });

  // ✅ Local states
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState<FleetForm>({
    tenant_id: "",
    fleet_name: "",
    fleet_type: "",
    description: "",
    is_active: true,
  });

  // ✅ Handle Delete (single)
  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      id,
      message: "Are you sure you want to delete this fleet?",
    });
  };

  const handleConfirm = async () => {
    await remove.mutateAsync(confirmDialog.id);
    setConfirmDialog({ open: false, id: "", message: "" });
    setAlert({
      open: true,
      message: "Fleet deleted successfully!",
      severity: "success",
    });
  };

  // ✅ Handle Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      setAlert({
        open: true,
        message: "Please select at least one fleet to delete.",
        severity: "warning",
      });
      return;
    }

    setConfirmDialog({
      open: true,
      id: "",
      message: `Are you sure you want to delete ${selectedIds.length} fleet(s)?`,
    });
  };

  // ✅ Handle Edit
  const handleEdit = (fleet: Fleet) => {
    setForm({
      tenant_id: fleet.tenant_id,
      fleet_name: fleet.fleet_name,
      fleet_type: fleet.fleet_type,
      description: fleet.description,
      is_active: fleet.is_active,
    });
    setEditId(fleet.fleet_id);
    setShowForm(true);
  };

  // ✅ Handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.tenant_id) {
      setAlert({
        open: true,
        message: "Please select a Tenant",
        severity: "warning",
      });
      return;
    }

    if (editId) {
      await update.mutateAsync({ id: editId, payload: form });
    } else {
      await create.mutateAsync(form);
    }

    setForm({
      tenant_id: "",
      fleet_name: "",
      fleet_type: "",
      description: "",
      is_active: true,
    });
    setEditId(null);
  };

  // ✅ Checkbox logic
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === fleets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(fleets.map((f) => f.fleet_id));
    }
  };

  if (isLoading) return <div>Loading Fleets...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-[#CC375D]">Fleets</h1>

      {/* Top Actions */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => {
            setEditId(null);
            setForm({
              tenant_id: "",
              fleet_name: "",
              fleet_type: "",
              description: "",
              is_active: true,
            });
            setShowForm(true);
          }}
          className="bg-[#CC375D] hover:bg-[#e84b72] text-white px-4 py-2 rounded transition-all"
        >
          + Add Fleet
        </button>

        <button
          onClick={handleBulkDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all disabled:opacity-50"
          disabled={selectedIds.length === 0}
        >
          Delete Selected ({selectedIds.length})
        </button>
      </div>

      {/* Fleets Table */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#CC375D] text-white">
          <tr>
            <th className="p-3 text-center">
              <input
                type="checkbox"
                checked={selectedIds.length === fleets.length && fleets.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-3 text-left">Tenant</th>
            <th className="p-3 text-left">Fleet Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-center">Active</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fleets.map((f) => (
            <tr key={f.fleet_id} className="border-t hover:bg-[#FFF0F4] transition">
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(f.fleet_id)}
                  onChange={() => toggleSelect(f.fleet_id)}
                />
              </td>
              <td className="p-3">
                {tenants.find((t) => t.tenant_id === f.tenant_id)?.tenant_name || "N/A"}
              </td>
              <td className="p-3">{f.fleet_name}</td>
              <td className="p-3">{f.fleet_type}</td>
              <td className="p-3">{f.description}</td>
              <td className="p-3 text-center">{f.is_active ? "✅" : "❌"}</td>
              <td className="p-3 text-center flex justify-center gap-3">
                <button
                  onClick={() => handleEdit(f)}
                  className="text-[#CC375D] hover:text-[#e84b72] p-2 transition"
                  title="Edit Fleet"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(f.fleet_id)}
                  className="text-[#CC375D] hover:text-[#e84b72] p-2 transition"
                  title="Delete Fleet"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Fleet Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-[#CC375D]">
              {editId ? "Edit Fleet" : "Add New Fleet"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select
                value={form.tenant_id}
                onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
                required
              >
                <option value="">-- Select Tenant --</option>
                {tenants.map((t) => (
                  <option key={t.tenant_id} value={t.tenant_id}>
                    {t.tenant_name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Fleet Name"
                value={form.fleet_name}
                onChange={(e) => setForm({ ...form, fleet_name: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
                required
              />

              <input
                placeholder="Fleet Type"
                value={form.fleet_type}
                onChange={(e) => setForm({ ...form, fleet_type: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none resize-none"
                rows={3}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                Active
              </label>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#CC375D] hover:bg-[#e84b72] text-white px-4 py-2 rounded transition"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* ✅ Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: "", message: "" })}
      >
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, id: "", message: "" })}
          >
            Cancel
          </Button>
          <Button color="error" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
