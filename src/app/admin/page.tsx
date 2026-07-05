import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const honeyVarieties = await prisma.honeyVariety.findMany({
    orderBy: { name: 'asc' }
  });
  const remedies = await prisma.remedy.findMany({
    orderBy: { title: 'asc' },
    include: { honeyVarieties: { include: { honeyVariety: true } } }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-honey-950">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Honey Varieties Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-honey-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-honey-900">Honey Varieties ({honeyVarieties.length})</h2>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {honeyVarieties.map((hv) => (
              <div key={hv.id} className="p-3 bg-honey-50 rounded-lg border border-honey-100">
                <p className="font-bold text-honey-900">{hv.name}</p>
                <p className="text-sm text-honey-700 truncate">{hv.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Remedies Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-honey-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-honey-900">Remedies ({remedies.length})</h2>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {remedies.map((remedy) => (
              <div key={remedy.id} className="p-3 bg-honey-50 rounded-lg border border-honey-100">
                <p className="font-bold text-honey-900">{remedy.title}</p>
                <div className="text-xs text-honey-700 mt-1 flex flex-wrap gap-1">
                  {remedy.honeyVarieties.map(hv => (
                    <span key={hv.honeyVarietyId} className="px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded">
                      {hv.honeyVariety.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
        <p className="text-blue-800">
          Full Create/Edit/Delete forms would be implemented here in a full build. The data is currently populated via the <strong>seed script</strong> (prisma/seed.ts).
        </p>
      </div>
    </div>
  );
}
