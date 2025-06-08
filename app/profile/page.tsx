import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold udea-primary-text">Mi Perfil</CardTitle>
                <CardDescription>Actualiza tu información personal, académica y laboral</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileTabs />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
