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

interface VehicleForm {
  fleet_id: string;
  vehicle_number: string;
  model: string;
  brand: string;
  capacity: string;
  status: string;
}

export default function VehiclesPage() {
  const qc = useQueryClient();

  // ✅ Fetch vehicles
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => (await api.get("/vehicles")).data,
  });

  // ✅ Fetch fleets
  const { data: fleets = [] } = useQuery({
    queryKey: ["fleets"],
    queryFn: async () => (await api.get("/fleets")).data,
  });

  // ✅ Snackbar state
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // ✅ Confirm Dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: "",
    message: "",
  });

  // ✅ Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleForm>({
    fleet_id: "",
    vehicle_number: "",
    model: "",
    brand: "",
    capacity: "",
    status: "active",
  });

  // ✅ Checkbox state
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === vehicles.length) setSelected([]);
    else setSelected(vehicles.map((v: any) => v.vehicle_id));
  };

  // ✅ Create mutation
  const create = useMutation({
    mutationFn: async (payload: VehicleForm) => api.post("/vehicles", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      setAlert({
        open: true,
        message: "Vehicle added successfully!",
        severity: "success",
      });
      setShowForm(false);
    },
  });

  // ✅ Update mutation
  const update = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: VehicleForm }) =>
      api.patch(`/vehicles/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      setAlert({
        open: true,
        message: "Vehicle updated successfully!",
        severity: "success",
      });
      setShowForm(false);
      setEditingId(null);
    },
  });

  // ✅ Delete mutation
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      setAlert({
        open: true,
        message: "Vehicle deleted successfully!",
        severity: "success",
      });
      setConfirmDialog({ open: false, id: "", message: "" });
    },
  });

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fleet_id) {
      setAlert({
        open: true,
        message: "Please select a Fleet",
        severity: "warning",
      });
      return;
    }

    if (editingId) {
      await update.mutateAsync({ id: editingId, payload: form });
    } else {
      await create.mutateAsync(form);
    }

    setForm({
      fleet_id: "",
      vehicle_number: "",
      model: "",
      brand: "",
      capacity: "",
      status: "active",
    });
  };

  // ✅ Handle delete confirmation
  const handleConfirm = async () => {
    if (confirmDialog.id) {
      await remove.mutateAsync(confirmDialog.id);
    }
  };

  // ✅ Handle edit
  const handleEdit = (vehicle: any) => {
    setEditingId(vehicle.vehicle_id);
    setForm({
      fleet_id: vehicle.fleet_id,
      vehicle_number: vehicle.vehicle_number,
      model: vehicle.model,
      brand: vehicle.brand,
      capacity: vehicle.capacity,
      status: vehicle.status,
    });
    setShowForm(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-[#CC375D]">Vehicles</h1>

      {/* Add Vehicle Button */}
      <button
        onClick={() => {
          setShowForm(true);
          setEditingId(null);
          setForm({
            fleet_id: "",
            vehicle_number: "",
            model: "",
            brand: "",
            capacity: "",
            status: "active",
          });
        }}
        className="bg-[#CC375D] hover:bg-[#e04f75] text-white px-4 py-2 rounded mb-4 transition"
      >
        + Add Vehicle
      </button>

      {/* Vehicles Table */}
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-[#CC375D] text-white">
          <tr>
            <th className="p-2 text-center">
              <input
                type="checkbox"
                checked={selected.length === vehicles.length && vehicles.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-2">Fleet</th>
            <th className="p-2">Vehicle Number</th>
            <th className="p-2">Model</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Capacity</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles?.map((v: any) => (
            <tr key={v.vehicle_id} className="border-t hover:bg-gray-100 transition">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(v.vehicle_id)}
                  onChange={() => toggleSelect(v.vehicle_id)}
                />
              </td>
              <td className="p-2">
                {fleets.find((f: any) => f.fleet_id === v.fleet_id)?.fleet_name || "N/A"}
              </td>
              <td className="p-2">{v.vehicle_number}</td>
              <td className="p-2">{v.model}</td>
              <td className="p-2">{v.brand}</td>
              <td className="p-2">{v.capacity}</td>
              <td className="p-2 capitalize">{v.status}</td>
              <td className="p-2 text-center flex justify-center gap-3">
                <button
                  onClick={() => handleEdit(v)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center justify-center transition"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      id: v.vehicle_id,
                      message: "Are you sure you want to delete this vehicle?",
                    })
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center transition"
                >
                  <FaTrash size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Vehicle Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-[#CC375D]">
              {editingId ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select
                value={form.fleet_id}
                onChange={(e) => setForm({ ...form, fleet_id: e.target.value })}
                className="border p-2 rounded"
                required
              >
                <option value="">-- Select Fleet --</option>
                {fleets.map((f: any) => (
                  <option key={f.fleet_id} value={f.fleet_id}>
                    {f.fleet_name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Vehicle Number"
                value={form.vehicle_number}
                onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                placeholder="Model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                placeholder="Brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="border p-2 rounded"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#CC375D] hover:bg-[#e04f75] text-white px-4 py-2 rounded transition"
                >
                  {editingId ? "Update" : "Save"}
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
