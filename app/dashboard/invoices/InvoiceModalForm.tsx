"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { createInvoiceAction } from "./actions";
import { updateInvoiceAction } from "./[invoiceId]/actions";

// Basic inline form for demo; real app may break out line items to separate fields/rows.
export default function InvoiceModalForm({ invoice }: { invoice?: any }) {
  const [form, setForm] = useState({
    invoiceNumber: invoice?.invoiceNumber || "",
    clientId: invoice?.clientId || "",
    projectId: invoice?.projectId || "",
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().substr(0, 10) : "",
    status: invoice?.status || "draft",
    total: invoice?.total || "",
    lineItems: invoice?.lineItems || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`/dashboard/invoices?${params.toString()}`, { scroll: false });
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
    if (invoice?.id) {
      resp = await updateInvoiceAction(invoice.id, formData);
    } else {
      resp = await createInvoiceAction(formData);
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
          <DialogTitle>{invoice ? "Edit Invoice" : "Add Invoice"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block font-medium mb-1">Invoice Number</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.invoiceNumber}
              onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
              required
            />
            {errors.invoiceNumber && <div className="text-destructive text-xs mt-1">{errors.invoiceNumber.join(", ")}</div>}
          </div>
          <div>
            <label className="block font-medium mb-1">Client ID</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={form.clientId}
              onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
              required
            />
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
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Total</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border p-2 rounded"
              value={form.total}
              onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
              required
            />
          </div>
          {success && <div className="text-green-700 text-center">Invoice saved! Closing…</div>}
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
              {loading ? "Saving..." : invoice ? "Save Changes" : "Add Invoice"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}