/**
 * CampusHub — User Management Module (Admin Only)
 * Practical 9: RBAC User Administration & Access Control
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Shield,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Lock,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

const INITIAL_USER_FORM = {
  username: "",
  full_name: "",
  email: "",
  password: "",
  role: "student"
};

export function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState(INITIAL_USER_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successBanner, setSuccessBanner] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers({
        role: roleFilter,
        search: searchQuery
      });
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load user accounts from MySQL.");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const showSuccess = (msg) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleOpenAdd = () => {
    setFormData(INITIAL_USER_FORM);
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSubmitting(true);
    try {
      await userService.createUser(formData);
      setIsAddModalOpen(false);
      showSuccess(`User account '${formData.username}' created successfully.`);
      loadUsers();
    } catch (err) {
      setFormError(err.message || "Failed to create user account.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenEdit = (user) => {
    setUserToEdit(user);
    setFormData({
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: ""
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!userToEdit) return;
    setFormError("");
    setFormSubmitting(true);
    try {
      await userService.updateUser(userToEdit.id, {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role
      });
      setIsEditModalOpen(false);
      showSuccess(`User '${userToEdit.username}' updated successfully.`);
      loadUsers();
    } catch (err) {
      setFormError(err.message || "Failed to update user account.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setFormError("");
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setFormSubmitting(true);
    setFormError("");
    try {
      await userService.deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      showSuccess(`User '${userToDelete.username}' deleted successfully.`);
      loadUsers();
    } catch (err) {
      setFormError(err.message || "Failed to delete user account.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Admin</Badge>;
      case "faculty":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Faculty</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Student</Badge>;
    }
  };

  return (
    <div className="space-y-5 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-600" />
            User Management & RBAC
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Admin console for provisioning user accounts, assigning roles, and managing authentication credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            disabled={loading}
            className="text-xs h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Add User
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <Card className="border-slate-200 shadow-2xs">
        <CardContent className="p-3.5">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search users by name, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="py-3.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">User Accounts Directory</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Showing {users.length} registered system accounts
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto text-blue-600" />
              <p>Loading user accounts from MySQL database...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-xs text-rose-600 space-y-2">
              <AlertCircle className="h-6 w-6 mx-auto text-rose-500" />
              <p>{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <User className="h-8 w-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No User Accounts Found</p>
              <p>Try modifying your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-4">Username</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Created Date</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isSelf = currentUser && currentUser.id === u.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{u.full_name}</span>
                            {isSelf && (
                              <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600">
                                You
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{u.username}</td>
                        <td className="py-3 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(u)}
                              className="h-7 px-2 text-slate-600 hover:text-blue-600"
                              aria-label={`Edit ${u.username}`}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDelete(u)}
                              className="h-7 px-2 text-slate-600 hover:text-rose-600"
                              aria-label={`Delete ${u.username}`}
                              disabled={isSelf}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md" onClose={() => setIsAddModalOpen(false)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <UserPlus className="h-4 w-4 text-blue-600" />
              Provision New User Account
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Create an account with role-based permissions in MySQL.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-3 py-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <Input
                type="text"
                required
                placeholder="e.g. Dr. Priya Shah"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username</label>
              <Input
                type="text"
                required
                placeholder="e.g. priya.shah"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <Input
                type="email"
                required
                placeholder="priya.shah@campushub.test"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <Input
                type="password"
                required
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="student">Student (Limited Portal Access)</option>
                <option value="faculty">Faculty (Academic Management & Students CRUD)</option>
                <option value="admin">Admin (Full System & User Control)</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                disabled={formSubmitting}
              >
                {formSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md" onClose={() => setIsEditModalOpen(false)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Edit2 className="h-4 w-4 text-blue-600" />
              Edit User Account — {userToEdit?.username}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update user details and assigned permissions.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateUser} className="space-y-3 py-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <Input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role Assignment</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                disabled={formSubmitting}
              >
                {formSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm" onClose={() => setIsDeleteModalOpen(false)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-rose-600">
              <Trash2 className="h-4 w-4" />
              Confirm User Account Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to permanently delete the account for <strong>{userToDelete?.full_name}</strong> (<code>{userToDelete?.username}</code>)?
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDeleteUser}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
