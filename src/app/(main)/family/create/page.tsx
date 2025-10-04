
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createFamily } from "@/lib/families";

export default function CreateFamilyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateFamily = async () => {
    if (!user) {
      setError("You must be logged in to create a family.");
      return;
    }

    if (!familyName.trim()) {
      setError("Family name cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const familyId = await createFamily(user.uid, familyName);
      router.push(`/family/${familyId}`);
    } catch (err) {
      console.error("Error creating family:", err);
      setError("Failed to create family. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create a New Family</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700">
              Family Name
            </label>
            <input
              id="familyName"
              name="familyName"
              type="text"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleCreateFamily}
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Family"}
          </button>
        </div>
      </div>
    </div>
  );
}
