export default function FamilyPage({ params }: any) {
  return (
    <div>
      <h1>Family Page (Simplified)</h1>
      <p>Family ID: {params.familyId}</p>
    </div>
  );
}
