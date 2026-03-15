"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { createTaskAction } from "./actions";
import { updateTaskAction } from "./[taskId]/actions";

export default function TaskModalForm({ task }: { task?: any }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    projectId: task?.projectId || "",
    description: task?.description || "",
    assigneeId: task?.assigneeId || "",
    status: task?.status || "todo",
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().substr(0, 10) : "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`/dashboard/tasks?${params.toString()}`, { scroll: false });
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
    if (task?.id) {
      resp = await updateTaskAction(task.id, formData);
    } else {
      resp = await createTaskAction(formData);
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
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block font-medium mb-1">Task Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            {errors.title && <div className="text-destructive text-xs mt-1">{errors.title.join(", ")}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Project ID</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.projectId}
              onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
              required
            />
            {errors.projectId && <div className="text-destructive text-xs mt-1">{errors.projectId.join(", ")}</div>}
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
            <label className="block font-medium mb-1">Assignee (User ID)</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.assigneeId}
              onChange={(e) => setForm((f) => ({ ...f, assigneeId: e.target.value }))}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}
            >
              <option value="todo">Todo</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Due Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
          {success && <div className="text-green-700 text-center">Task saved! Closing…</div>}
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
              {loading ? "Saving..." : task ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}