import { DocsLayout } from "@/components/docs-layout";

export default function ContactPage() {
  return (
    <DocsLayout
      title="Contact"
      section="Company"
      description="Feedback, bugs, partnership ideas or a question about your plan. We read everything."
    >
      <h2>Send us a message</h2>
      <form className="max-w-md space-y-4" onSubmit={(e) => e.preventDefault()}>
        {[
          ["Name", "text"],
          ["Email", "email"],
        ].map(([label, type]) => (
          <label key={label} className="block text-sm">
            {label}
            <input
              type={type}
              required
              className="mt-1 h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none"
            />
          </label>
        ))}
        <label className="block text-sm">
          Message
          <textarea
            required
            rows={5}
            className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none"
          />
        </label>
        <button type="submit" className="h-10 rounded-md bg-white px-4 text-sm font-medium text-black">
          Send message
        </button>
      </form>
    </DocsLayout>
  );
}
