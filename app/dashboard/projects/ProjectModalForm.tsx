"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { createProjectAction } from "./actions";
import { updateProjectAction } from "./[projectId]/actions";

export default function ProjectModalForm({ project }: { project?: any }) {
  const [form, setForm] = useState({
    name: project?.name || "",
    clientId: project?.clientId || "",
    description: project?.description || "",
    status: project?.status || "planned",
    budget: project?.budget || "",
    startDate: project?.startDate ? new Date(project.startDate).toISOString().substr(0, 10) : "",
    endDate: project?.endDate ? new Date(project.endDate).toISOString().substr(0, 10) : "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`/dashboard/projects?${params.toString()}`, { scroll: false });
    setTimeout(() => router.refresh(), 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v ?? ""));

    let resp;
    if (project?.id) {
      resp = await updateProjectAction(project.id, formData);
    } else {
      resp = await createProjectAction(formData);
    }

    setLoading(false);
    if (resp && resp.error) {
      setErrors(resp.error);
    } else {
      setSuccess(true);
      setTimeout(() => handleClose(), 700);
    }
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block font-medium mb-1">Project Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            {errors.name && <div className="text-destructive text-xs mt-1">{errors.name.join(", ")}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Client ID (for now)</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.clientId}
              onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
              required
            />
            {errors.clientId && <div className="text-destructive text-xs mt-1">{errors.clientId.join(", ")}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Budget</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border p-2 rounded"
              value={form.budget}
              onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>
          {success && <div className="text-green-700 text-center">Project saved! Closing…</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="rounded px-6 py-2 border bg-muted font-semibold"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded px-6 py-2 bg-primary text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : project ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}