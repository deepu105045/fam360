
import { getAllFamilies, getFamily, getFamilyMembers } from "@/lib/families";
import { getUser } from "@/lib/users";
import FamilyPageClient from "./family-page-client";

export async function generateStaticParams() {
  const families = await getAllFamilies();
  return families.map((family) => ({ familyId: family.id }));
}

async function getFamilyData(familyId: string) {
  const family = await getFamily(familyId);
  if (!family) return null;

  const members = await getFamilyMembers(familyId);
  const membersWithUserData = await Promise.all(
    members.map(async (member) => {
      const user = await getUser(member.userId);
      return { ...member, user };
    })
  );

  return {
    family,
    members: membersWithUserData,
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
