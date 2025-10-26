
import { getAllFamilies, getFamily, getFamilyMembers } from "@/lib/families";
import { getUserByEmail } from "@/lib/users";
import FamilyPageClient from "./family-page-client";
import { Family, User } from "@/lib/types";

// Ensure that generateStaticParams returns a valid array of params
export async function generateStaticParams() {
  const families = await getAllFamilies();

  // If no families, return a dummy ID to prevent build errors
  if (families.length === 0) {
    return [{ familyId: 'temp-build-fix' }];
  }

  return families
    .filter((family) => family && family.id)
    .map((family) => ({ familyId: family.id }));
}

// Safeguard getFamilyData against invalid familyId
async function getFamilyData(familyId: string): Promise<{ family: Family; members: User[] } | null> {
  // The dummy ID will cause getFamily to return null, which is handled gracefully.
  if (!familyId || familyId === 'temp-build-fix') return null;

  const family = await getFamily(familyId);
  if (!family) return null;

  const memberEmails = await getFamilyMembers(familyId);
  const membersWithUserData = await Promise.all(
    memberEmails.map(async (email) => {
      return await getUserByEmail(email);
    })
  );

  return {
    family,
    members: membersWithUserData.filter((user) => user !== null) as User[],
  };
}

export default async function FamilyPage({ params }: { params: { familyId: string } }) {
  const data = await getFamilyData(params.familyId);

  if (!data) {
    // This will be shown for the 'temp-build-fix' page, which is fine.
    return <div>Family not found.</div>;
  }

  return (
    <FamilyPageClient
      initialFamily={data.family}
      initialMembers={data.members}
      familyId={params.familyId}
    />
  );
}

// Define PageProps
interface PageProps {
  params: {
    familyId: string;
  };
}
