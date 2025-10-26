
import FamilyPageClient from "./family-page-client";

// Define the correct props for a Next.js page component
interface PageProps {
  params: { familyId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function FamilyPage({ params }: PageProps) {
  // This is a temporary, simplified version of the page.
  // We will re-introduce the data fetching logic once we've confirmed the basic component works.
  return (
    <div>
      <h1>Family Page (Simplified)</h1>
      <p>Family ID: {params.familyId}</p>
    </div>
  );
}
