"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { SectionTitle } from "@/components/atoms/section-title";
import { Briefcase, Users, TrendingUp, Search, Plus, ArrowRight, LayoutDashboard } from "lucide-react";
import { AuthenticatedUserResponse, DetailedUserResponse } from "@/lib/services/profile";
import { LocalStorageService } from "@/lib/services/local-storage.service";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<(AuthenticatedUserResponse & DetailedUserResponse) | null>(null);

  useEffect(() => {
    // Get user from localStorage if available
    const storedUser = LocalStorageService.getItem<AuthenticatedUserResponse>("user");
    const storedUserProfile = LocalStorageService.getItem<DetailedUserResponse>("userProfile");
    setUser(storedUser && storedUserProfile ? { ...storedUser, ...storedUserProfile } : null);
  }, []);

  const handleCreateOpportunity = () => {
    // Allow anyone to create opportunities - anonymous users can create directly
    router.push("/opportunity?register=1");
  };

  const handleViewOpportunities = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/opportunity");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a <span className="text-[#026937]">Nexum</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La plataforma que conecta a los egresados de la Universidad de Antioquia con las mejores oportunidades laborales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="xl"
                onClick={handleCreateOpportunity}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Publicar Oportunidad Laboral
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={handleViewOpportunities}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-5 w-5" />
                Ver Oportunidades
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                  } else {
                    router.push("/dashboard");
                  }
                }}
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                Ir al Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* What is Nexum Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <SectionTitle>¿Qué es Nexum?</SectionTitle>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Nexum es la plataforma oficial de la Universidad de Antioquia diseñada para facilitar la conexión entre empleadores y nuestros talentosos egresados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Para Empleadores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Accede a un talento calificado y diverso. Publica tus oportunidades laborales y encuentra al candidato ideal entre nuestros egresados.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Para Egresados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Encuentra oportunidades laborales que se ajusten a tu perfil profesional. Conecta con empleadores que valoran tu formación UdeA.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Para la Universidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fortalecemos los lazos entre la academia y el sector productivo, facilitando la inserción laboral de nuestros egresados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How it works Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <SectionTitle>¿Cómo funciona?</SectionTitle>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Regístrate</h3>
                <p className="text-gray-600 text-sm">
                  Crea tu cuenta como empleador o egresado según tu perfil.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Publica y Explora</h3>
                <p className="text-gray-600 text-sm">
                  Empleadores publican oportunidades. Egresados exploran y aplican.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Conecta</h3>
                <p className="text-gray-600 text-sm">
                  Establece contacto directo con los candidatos más adecuados.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Crece</h3>
                <p className="text-gray-600 text-sm">
                  Contribuye al desarrollo profesional y al crecimiento institucional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-[#026937] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¡Únete a la comunidad Nexum hoy!
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Forma parte de la red profesional más importante de egresados de la Universidad de Antioquia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/register?employer=1")}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Comenzar como Empleador
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/register")}
                className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-[#026937]"
              >
                Registrarse como Egresado
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">
              © 2024 Universidad de Antioquia. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
