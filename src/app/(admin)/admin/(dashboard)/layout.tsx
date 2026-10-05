import { assertAdminAccess } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await assertAdminAccess()

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
