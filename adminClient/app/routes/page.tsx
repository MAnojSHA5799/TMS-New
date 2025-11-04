"use client";

import Layout from "@/components/Layout";
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
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

interface Route {
  route_id: string;
  fleet_id: string;
  route_name: string;
  start_location: string;
  end_location: string;
  distance_km: string;
  estimated_time: string;
  status: string;
}

interface Fleet {
  fleet_id: string;
  fleet_name: string;
}

interface FormData {
  fleet_id: string;
  route_name: string;
  start_location: string;
  end_location: string;
  distance_km: string;
  estimated_time: string;
  status: string;
}

export default function RoutesPage() {
  const qc = useQueryClient();

  // ✅ Fetch routes
  const { data: routes, isLoading } = useQuery<Route[]>(["routes"], async () => {
    const res = await api.get("/routes");
    return res.data;
  });

  // ✅ Fetch fleets
  const { data: fleets = [] } = useQuery<Fleet[]>(["fleets"], async () => {
    const res = await api.get("/fleets");
    return res.data;
  });

  // ✅ Create Route mutation
  const create: UseMutationResult<any, unknown, FormData> = useMutation(
    async (payload: FormData) => {
      return await api.post("/routes", payload);
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["routes"]);
        setShowForm(false);
        setAlert({
          open: true,
          message: "Route added successfully!",
          severity: "success",
        });
      },
      onError: () =>
        setAlert({
          open: true,
          message: "Failed to add route.",
          severity: "error",
        }),
    }
  );

  // ✅ Update Route mutation
  const update: UseMutationResult<any, unknown, { id: string; payload: FormData }> =
    useMutation(
      async ({ id, payload }) => {
        return await api.patch(`/routes/${id}`, payload);
      },
      {
        onSuccess: () => {
          qc.invalidateQueries(["routes"]);
          setShowForm(false);
          setEditingRoute(null);
          setAlert({
            open: true,
            message: "Route updated successfully!",
            severity: "success",
          });
        },
        onError: () =>
          setAlert({
            open: true,
            message: "Failed to update route.",
            severity: "error",
          }),
      }
    );

  // ✅ Delete Route mutation
  const remove: UseMutationResult<any, unknown, string> = useMutation(
    async (id: string) => {
      return await api.delete(`/routes/${id}`);
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["routes"]);
        setAlert({
          open: true,
          message: "Route deleted successfully!",
          severity: "success",
        });
      },
      onError: () =>
        setAlert({
          open: true,
          message: "Failed to delete route.",
          severity: "error",
        }),
    }
  );

  // ✅ States
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: "",
    message: "",
  });

  const [form, setForm] = useState<FormData>({
    fleet_id: "",
    route_name: "",
    start_location: "",
    end_location: "",
    distance_km: "",
    estimated_time: "",
    status: "active",
  });

  // ✅ Handle checkbox select
  const handleCheckboxChange = (id: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRoutes.length === routes?.length) {
      setSelectedRoutes([]);
    } else {
      setSelectedRoutes(routes?.map((r) => r.route_id) || []);
    }
  };

  // ✅ Confirm delete handler
  const handleConfirm = async () => {
    if (confirmDialog.id) {
      await remove.mutateAsync(confirmDialog.id);
    }
    setConfirmDialog({ open: false, id: "", message: "" });
  };

  // ✅ Handle delete
  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      id,
      message: "Are you sure you want to delete this route?",
    });
  };

  // ✅ Handle multiple delete
  const handleBulkDelete = () => {
    if (selectedRoutes.length === 0) {
      setAlert({
        open: true,
        message: "Please select at least one route to delete.",
        severity: "warning",
      });
      return;
    }

    setConfirmDialog({
      open: true,
      id: "",
      message: `Delete ${selectedRoutes.length} selected routes?`,
    });
  };

  // ✅ Handle edit click
  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setForm({
      fleet_id: route.fleet_id,
      route_name: route.route_name,
      start_location: route.start_location,
      end_location: route.end_location,
      distance_km: route.distance_km,
      estimated_time: route.estimated_time,
      status: route.status,
    });
    setShowForm(true);
  };

  // ✅ Handle submit (Add or Edit)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.fleet_id) {
      setAlert({
        open: true,
        message: "Please select a Fleet",
        severity: "warning",
      });
      return;
    }

    if (editingRoute) {
      await update.mutateAsync({ id: editingRoute.route_id, payload: form });
    } else {
      await create.mutateAsync(form);
    }

    setForm({
      fleet_id: "",
      route_name: "",
      start_location: "",
      end_location: "",
      distance_km: "",
      estimated_time: "",
      status: "active",
    });

    setEditingRoute(null);
    setShowForm(false);
  };

  if (isLoading) return <div>Loading Routes...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-[#CC375D]">Routes</h1>

      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingRoute(null);
            setForm({
              fleet_id: "",
              route_name: "",
              start_location: "",
              end_location: "",
              distance_km: "",
              estimated_time: "",
              status: "active",
            });
          }}
          className="bg-[#CC375D] hover:bg-[#e04f75] text-white px-4 py-2 rounded transition"
        >
          + Add Route
        </button>

        {selectedRoutes.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Delete Selected ({selectedRoutes.length})
          </button>
        )}
      </div>

      {/* Routes Table */}
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-[#CC375D] text-white">
          <tr>
            <th className="p-2 text-center">
              <input
                type="checkbox"
                checked={selectedRoutes.length === routes?.length && routes?.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2">Fleet</th>
            <th className="p-2">Route Name</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Distance</th>
            <th className="p-2">Time</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes?.map((r) => (
            <tr
              key={r.route_id}
              className={`border-t hover:bg-gray-100 transition ${
                selectedRoutes.includes(r.route_id) ? "bg-gray-100" : ""
              }`}
            >
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedRoutes.includes(r.route_id)}
                  onChange={() => handleCheckboxChange(r.route_id)}
                />
              </td>
              <td className="p-2">
                {fleets.find((f) => f.fleet_id === r.fleet_id)?.fleet_name || "N/A"}
              </td>
              <td className="p-2">{r.route_name}</td>
              <td className="p-2">{r.start_location}</td>
              <td className="p-2">{r.end_location}</td>
              <td className="p-2">{r.distance_km}</td>
              <td className="p-2">{r.estimated_time}</td>
              <td className="p-2 capitalize">{r.status}</td>
              <td className="p-2 text-center flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(r)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(r.route_id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  <FaTrash size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
