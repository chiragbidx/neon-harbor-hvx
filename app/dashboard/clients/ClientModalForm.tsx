"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientAction } from "./actions";
import { updateClientAction } from "./[clientId]/actions";

export default function ClientModalForm({ client }: { client?: any }) {
  const [form, setForm] = useState({
    name: client?.name || "",
    contactName: client?.contactName || "",
    contactEmail: client?.contactEmail || "",
    phone: client?.phone || "",
    address: client?.address || "",
    notes: client?.notes || "",
    status: client?.status || "active",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // When the modal is closed, remove modal query param and refresh
  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`/dashboard/clients?${params.toString()}`, { scroll: false });
    setTimeout(() => router.refresh(), 50); // Ensure UI updates after close
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v ?? ""));

    let resp;
    if (client?.id) {
      resp = await updateClientAction(client.id, formData);
    } else {
      resp = await createClientAction(formData);
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
          <DialogTitle>{client ? "Edit Client" : "Add Client"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block font-medium mb-1">Client Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            {errors.name && <div className="text-destructive text-xs mt-1">{errors.name.join(", ")}</div>}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">Contact Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={form.contactName}
                onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Contact Email</label>
              <input
                type="email"
                className="w-full border p-2 rounded"
                value={form.contactEmail}
                onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
              />
              {errors.contactEmail && <div className="text-destructive text-xs mt-1">{errors.contactEmail.join(", ")}</div>}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Notes</label>
            <textarea
              className="w-full border p-2 rounded"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "active" | "archived" }))}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          {success && <div className="text-green-700 text-center">Client saved! Closing…</div>}
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
              {loading ? "Saving..." : client ? "Save Changes" : "Add Client"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}