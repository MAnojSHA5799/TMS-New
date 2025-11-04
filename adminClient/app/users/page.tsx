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

// ✅ Interfaces
interface Tenant {
  tenant_id: string;
  tenant_name: string;
}

interface User {
  user_id: string;
  tenant_id: string;
  username: string;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

interface FormData {
  tenant_id: string;
  username: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

export default function UsersPage() {
  const qc = useQueryClient();

  // ✅ Fetch users
  const { data: users = [], isLoading } = useQuery<User[]>(["users"], async () => {
    const res = await api.get("/users");
    return res.data;
  });

  // ✅ Fetch tenants
  const { data: tenants = [] } = useQuery<Tenant[]>(["tenants"], async () => {
    const res = await api.get("/tenants");
    return res.data;
  });

  // ✅ Create mutation
  const create: UseMutationResult<any, unknown, FormData> = useMutation(
    async (payload: FormData) => await api.post("/users", payload),
    {
      onSuccess: () => {
        qc.invalidateQueries(["users"]);
        setShowForm(false);
        showAlert("User created successfully!", "success");
      },
    }
  );

  // ✅ Update mutation
  const update: UseMutationResult<any, unknown, { id: string; payload: FormData }> =
    useMutation(
      async ({ id, payload }) => await api.patch(`/users/${id}`, payload),
      {
        onSuccess: () => {
          qc.invalidateQueries(["users"]);
          setShowForm(false);
          setEditUser(null);
          showAlert("User updated successfully!", "success");
        },
      }
    );

  // ✅ Delete mutation
  const remove: UseMutationResult<any, unknown, string> = useMutation(
    async (id: string) => await api.delete(`/users/${id}`),
    {
      onSuccess: () => {
        qc.invalidateQueries(["users"]);
        showAlert("User deleted successfully!", "success");
      },
    }
  );

  // ✅ Snackbar state
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const showAlert = (message: string, severity: typeof alert.severity) => {
    setAlert({ open: true, message, severity });
  };

  // ✅ Dialog state for confirmation
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: "",
    message: "",
  });

  const handleConfirm = async () => {
    await remove.mutateAsync(confirmDialog.id);
    setConfirmDialog({ open: false, id: "", message: "" });
  };

  // ✅ Handle delete (opens confirmation dialog)
  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      id,
      message: "Are you sure you want to delete this user?",
    });
  };

  // ✅ Form + Selection states
  const [showForm, setShowForm] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [form, setForm] = useState<FormData>({
    tenant_id: "",
    username: "",
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    is_active: true,
  });

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.tenant_id) {
      showAlert("Please select a Tenant", "warning");
      return;
    }

    if (editUser) {
      await update.mutateAsync({ id: editUser.user_id, payload: form });
    } else {
      await create.mutateAsync(form);
    }

    setForm({
      tenant_id: "",
      username: "",
      email: "",
      password_hash: "",
      first_name: "",
      last_name: "",
      is_active: true,
    });
  };

  // ✅ Edit handler
  const handleEdit = (user: User) => {
    setEditUser(user);
    setForm({
      tenant_id: user.tenant_id,
      username: user.username,
      email: user.email,
      password_hash: "",
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
    });
    setShowForm(true);
  };

  // ✅ Checkbox selection
  const handleCheckboxChange = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  // ✅ Bulk delete with confirmation
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      showAlert("Please select at least one user to delete.", "warning");
      return;
    }
    setConfirmDialog({
      open: true,
      id: "",
      message: `Delete ${selectedUsers.length} selected users?`,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-[#CC375D]">Users</h1>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#CC375D] hover:bg-[#e84b72] text-white px-4 py-2 rounded transition-all"
        >
          + Add User
        </button>

        {selectedUsers.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
          >
            Delete Selected ({selectedUsers.length})
          </button>
        )}
      </div>

      {/* Users Table */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#CC375D] text-white">
          <tr>
            <th className="p-3 text-center">
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length && users.length > 0}
                onChange={(e) =>
                  setSelectedUsers(e.target.checked ? users.map((u) => u.user_id) : [])
                }
              />
            </th>
            <th className="p-3 text-left">Tenant</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">First Name</th>
            <th className="p-3 text-left">Last Name</th>
            <th className="p-3 text-center">Active</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id} className="border-t hover:bg-[#FFF0F4] transition">
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u.user_id)}
                  onChange={() => handleCheckboxChange(u.user_id)}
                />
              </td>
              <td className="p-3">
                {tenants.find((t) => t.tenant_id === u.tenant_id)?.tenant_name || "N/A"}
              </td>
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.first_name}</td>
              <td className="p-3">{u.last_name}</td>
              <td className="p-3 text-center">{u.is_active ? "✅" : "❌"}</td>
              <td className="p-3 text-center flex justify-center gap-3">
                <button
                  onClick={() => handleEdit(u)}
                  className="text-blue-500 hover:text-blue-700 transition"
                  title="Edit User"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(u.user_id)}
                  className="text-[#CC375D] hover:text-[#e84b72] transition"
                  title="Delete User"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-[#CC375D]">
              {editUser ? "Edit User" : "Add New User"}
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
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
                required
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
              />
              <input
                placeholder="Password"
                type="password"
                value={form.password_hash}
                onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
              />
              <input
                placeholder="First Name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
              />
              <input
                placeholder="Last Name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#CC375D] outline-none"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                Active
              </label>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditUser(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#CC375D] hover:bg-[#e84b72] text-white px-4 py-2 rounded transition"
                >
                  {editUser ? "Update" : "Save"}
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
