
import { getAllFamilies, getFamily, getFamilyMembers } from "@/lib/families";
import { getUserByEmail } from "@/lib/users";
import FamilyPageClient from "./family-page-client";
import { Family, User } from "@/lib/types";

// Define props for the page component to make them explicit
interface FamilyPageProps {
  params: {
    familyId: string;
  };
}

// Ensure that generateStaticParams returns a valid array of params
export async function generateStaticParams() {
  const families = await getAllFamilies();
  return families
    .filter((family) => family && family.id)
    .map((family) => ({ familyId: family.id }));
}

// Safeguard getFamilyData against invalid familyId
async function getFamilyData(familyId: string): Promise<{ family: Family; members: User[] } | null> {
  if (!familyId) return null;

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

export default async function FamilyPage({ params }: FamilyPageProps) {
  const data = await getFamilyData(params.familyId);

  if (!data) {
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
