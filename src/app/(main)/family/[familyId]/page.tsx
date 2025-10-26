
import { getAllFamilies, getFamily, getFamilyMembers } from "@/lib/families";
import { getUserByEmail } from "@/lib/users";
import FamilyPageClient from "./family-page-client";
import { User } from "@/lib/types";

export async function generateStaticParams() {
  const families = await getAllFamilies();
  return families.map((family) => ({ familyId: family.id }));
}

async function getFamilyData(familyId: string) {
  const family = await getFamily(familyId);
  if (!family) return null;

  const memberEmails = await getFamilyMembers(familyId);
  const membersWithUserData = await Promise.all(
    memberEmails.map(async (email) => {
      const user = await getUserByEmail(email);
      return user;
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
