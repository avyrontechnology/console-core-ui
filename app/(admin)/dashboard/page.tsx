import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredPermission="console:get_partner_homepage_details">
      <h1 className="text-xl font-semibold">Dashboard</h1>
    </ProtectedRoute>
  );
}
