"use client";
import Layout from "@/components/Layout";
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import api from "@/lib/apiClient";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface DriverForm {
  fleet_id: string;
  driver_name: string;
  license_number: string;
  contact_number: string;
  address: string;
  status: string;
}

interface Fleet {
  fleet_id: string;
  fleet_name: string;
}

export default function DriversPage() {
  const qc = useQueryClient();

  // ✅ Queries
  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => (await api.get("/drivers")).data,
  });

  const { data: fleets = [] } = useQuery<Fleet[]>({
    queryKey: ["fleets"],
    queryFn: async () => (await api.get("/fleets")).data,
  });

  // ✅ Mutations
  const create = useMutation({
    mutationFn: async (payload: DriverForm) => (await api.post("/drivers", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drivers"] });
      setShowForm(false);
      showAlert("Driver added successfully!", "success");
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: DriverForm }) =>
      (await api.patch(`/drivers/${id}`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drivers"] });
      setShowForm(false);
      showAlert("Driver updated successfully!", "success");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await api.delete(`/drivers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drivers"] });
      showAlert("Driver deleted successfully!", "success");
    },
  });

  // ✅ UI State
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: "",
    message: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [form, setForm] = useState<DriverForm>({
    fleet_id: "",
    driver_name: "",
    license_number: "",
    contact_number: "",
    address: "",
    status: "active",
  });

  const showAlert = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleCheckboxChange = (driver_id: string) => {
    setSelectedDrivers((prev) =>
      prev.includes(driver_id)
        ? prev.filter((id) => id !== driver_id)
        : [...prev, driver_id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDrivers.length === drivers.length) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(drivers.map((d: any) => d.driver_id));
    }
  };

  const handleEdit = () => {
    if (selectedDrivers.length !== 1) {
      showAlert("Please select exactly one driver to edit.", "warning");
      return;
    }
    const driver = drivers.find((d: any) => d.driver_id === selectedDrivers[0]);
    if (driver) {
      setForm({
        fleet_id: driver.fleet_id,
        driver_name: driver.driver_name,
        license_number: driver.license_number,
        contact_number: driver.contact_number,
        address: driver.address,
        status: driver.status,
      });
      setEditMode(true);
      setShowForm(true);
    }
  };

  const handleDelete = () => {
    if (selectedDrivers.length === 0) {
      showAlert("Please select at least one driver to delete.", "warning");
      return;
    }
    setConfirmDialog({
      open: true,
      id: "",
      message: `Are you sure you want to delete ${selectedDrivers.length} selected driver(s)?`,
    });
  };

  const handleConfirm = async () => {
    for (const id of selectedDrivers) {
      await remove.mutateAsync(id);
    }
    setSelectedDrivers([]);
    setConfirmDialog({ open: false, id: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.fleet_id) {
      showAlert("Please select a Fleet", "warning");
      return;
    }

    if (editMode && selectedDrivers.length === 1) {
      await update.mutateAsync({ id: selectedDrivers[0], payload: form });
    } else {
      await create.mutateAsync(form);
    }

    setForm({
      fleet_id: "",
      driver_name: "",
      license_number: "",
      contact_number: "",
      address: "",
      status: "active",
    });
    setSelectedDrivers([]);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white z-40 p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#CC375D]">Drivers</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditMode(false);
                setShowForm(true);
              }}
              className="bg-[#CC375D] hover:bg-[#e04f75] text-white px-4 py-2 rounded transition"
            >
              + Add Driver
            </button>
            {selectedDrivers.length > 0 && (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <table className="w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-[#CC375D] text-white">
              <tr>
                <th className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedDrivers.length === drivers.length && drivers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2">Fleet</th>
                <th className="p-2">Driver Name</th>
                <th className="p-2">License</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Address</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d: any) => (
                <tr key={d.driver_id} className="border-t hover:bg-gray-100 transition">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedDrivers.includes(d.driver_id)}
                      onChange={() => handleCheckboxChange(d.driver_id)}
                    />
                  </td>
                  <td className="p-2">
                    {fleets.find((f) => f.fleet_id === d.fleet_id)?.fleet_name || "N/A"}
                  </td>
                  <td className="p-2">{d.driver_name}</td>
                  <td className="p-2">{d.license_number}</td>
                  <td className="p-2">{d.contact_number}</td>
                  <td className="p-2">{d.address}</td>
                  <td className="p-2 capitalize">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-[#CC375D]">
              {editMode ? "Edit Driver" : "Add New Driver"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select
                value={form.fleet_id}
                onChange={(e) => setForm({ ...form, fleet_id: e.target.value })}
                className="border p-2 rounded"
                required
              >
                <option value="">-- Select Fleet --</option>
                {fleets.map((f) => (
                  <option key={f.fleet_id} value={f.fleet_id}>
                    {f.fleet_name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Driver Name"
                value={form.driver_name}
                onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
                className="border p-2 rounded"
                required
              />

              <input
                placeholder="License Number"
                value={form.license_number}
                onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                placeholder="Contact Number"
                value={form.contact_number}
                onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border p-2 rounded"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditMode(false);
                    setSelectedDrivers([]);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#CC375D] hover:bg-[#e04f75] text-white px-4 py-2 rounded transition"
                >
                  {editMode ? "Update" : "Save"}
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
