"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table"
import Navbar from "@/components/navbar"
import { ROUTES } from "@/lib/routes"
import { GraduateSearchService, GraduateSearchResult, GraduateSearchFilters } from "@/lib/services/profile/graduate-search.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { logger } from "@/lib/logging"
import { sanitizeInput } from "@/lib/security"
import { ROLES } from "@/lib/services/constants/api.constants"

export default function SearchGraduatesPage() {
  const router = useRouter()
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const user = LocalStorageService.getItem<any>("user")
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")
  const [searchTerm, setSearchTerm] = useState("")
  const [program, setProgram] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [location, setLocation] = useState("")
  const [searchResults, setSearchResults] = useState<GraduateSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const role = user?.role

  useEffect(() => {
    if (role !== ROLES.ADMINISTRATIVE && role !== ROLES.DEAN) {
      router.replace("/dashboard")
    }
  }, [role, router])

  if (role !== ROLES.ADMINISTRATIVE && role !== ROLES.DEAN) {
    return null
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    try {
      // Sanitize inputs
      const sanitizedSearchTerm = sanitizeInput(searchTerm)

      // Prepare search filters
      const filters: GraduateSearchFilters = {
        searchTerm: sanitizedSearchTerm,
        program: program || undefined,
        graduationYear: graduationYear || undefined,
        location: location || undefined,
      }

      // Use mock service for now (replace with real API call when ready)
      const result = await GraduateSearchService.searchGraduatesMock(filters)
      setSearchResults(result.graduates)
    } catch (error) {
      logger.error("Error searching graduates:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting results")
  }

  return (
    <>
      <Navbar user={{
        firstName,
        firstLastname,
        email,
        role: user?.role,
        initials,
        ...userProfile
      }} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold udea-primary-text">Buscador de Egresados</CardTitle>
                <CardDescription>Busque y filtre egresados por diferentes criterios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="searchTerm" className="text-sm font-medium">
                        Buscar por nombre, ID o email
                      </label>
                      <div className="relative">
                        <Input
                          id="searchTerm"
                          placeholder="Buscar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          maxLength={100}
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="program" className="text-sm font-medium">
                        Programa Académico
                      </label>
                      <Select value={program} onChange={(e) => setProgram(e.target.value)}>
                        <option value="">Seleccionar programa</option>
                        <option value="sistemas">Ingeniería de Sistemas</option>
                        <option value="industrial">Ingeniería Industrial</option>
                        <option value="electronica">Ingeniería Electrónica</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="graduationYear" className="text-sm font-medium">
                        Año de Graduación
                      </label>
                      <Select value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}>
                        <option value="">Seleccionar año</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Ubicación
                      </label>
                      <Select value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="">Seleccionar ubicación</option>
                        <option value="medellin">Medellín</option>
                        <option value="bogota">Bogotá</option>
                        <option value="cali">Cali</option>
                        <option value="internacional">Internacional</option>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="submit" className="udea-primary" disabled={isSearching}>
                      {isSearching ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                </form>

                {searchResults.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Resultados ({searchResults.length})</CardTitle>
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Programa</TableHead>
                              <TableHead>Año Graduación</TableHead>
                              <TableHead>Ubicación</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {searchResults.map((graduate) => (
                              <TableRow key={graduate.id}>
                                <TableCell>{graduate.name} {graduate.lastname}</TableCell>
                                <TableCell>{graduate.institutionalEmail}</TableCell>
                                <TableCell>{graduate.program}</TableCell>
                                <TableCell>{graduate.graduationYear}</TableCell>
                                <TableCell>{graduate.location}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => router.push(`${ROUTES.ADMIN.VIEW_PROFILE}?userId=${graduate.id}`)}
                                  >
                                    Ver Perfil
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
