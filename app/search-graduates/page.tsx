"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import Navbar from "@/components/navbar"
import { ROUTES } from "@/lib/routes"
import { GraduateSearchService, UserFilterRequest, PageQuery, BasicUserResponse } from "@/lib/services/profile/graduate-search.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { logger } from "@/lib/logging"
import { ROLES } from "@/lib/services/constants/api.constants"
import { ProgramService } from "@/lib/services/catalog/program.service"

export default function SearchGraduatesPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState("")
  const [firstLastname, setFirstLastname] = useState("")
  const [email, setEmail] = useState("")
  const [initials, setInitials] = useState("")
  const [role, setRole] = useState<string | null>(null)

  // Catálogos
  const [programs, setPrograms] = useState<{ id: number, name: string, code: string }[]>([])
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  // Filtros
  const [name, setName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastname, setLastname] = useState("")
  const [secondLastname, setSecondLastname] = useState("")
  const [gender, setGender] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [programId, setProgramId] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [mobile, setMobile] = useState("")
  const [emailFilter, setEmailFilter] = useState("")
  const [academicEmail, setAcademicEmail] = useState("")

  // Resultados y paginación
  const [searchResults, setSearchResults] = useState<BasicUserResponse[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Inicializar datos del usuario cuando el componente se monta en el cliente
  useEffect(() => {
    setIsClient(true)
    const storedUserProfile = LocalStorageService.getItem<any>("userProfile")
    const storedUser = LocalStorageService.getItem<any>("user")
    
    setUserProfile(storedUserProfile)
    setUser(storedUser)
    
    if (storedUserProfile) {
      const fName = storedUserProfile?.name?.split(" ")[0] || ""
      const fLastname = storedUserProfile?.lastname?.split(" ")[0] || ""
      setFirstName(fName)
      setFirstLastname(fLastname)
      setInitials((fName[0] || "") + (fLastname[0] || ""))
    }
    
    if (storedUser) {
      setEmail(storedUser.email || "")
      setRole(storedUser.role)
    }
  }, [])

  useEffect(() => {
    if (isClient && role && role !== ROLES.ADMINISTRATIVE && role !== ROLES.DEAN) {
      router.replace("/dashboard")
    }
  }, [isClient, role, router])

  useEffect(() => {
    if (isClient) {
      setIsLoadingCatalogs(true)
      setCatalogError(null)
      ProgramService.getAll()
        .then((programs) => {
          setPrograms(programs)
          setIsLoadingCatalogs(false)
        })
        .catch((err) => {
          setPrograms([])
          setIsLoadingCatalogs(false)
          setCatalogError('No se pudieron cargar los catálogos. Intenta de nuevo más tarde.')
        })
    }
  }, [isClient])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSearching(true)
    try {
      const filters: UserFilterRequest = {
        name: name || undefined,
        middleName: middleName || undefined,
        lastname: lastname || undefined,
        secondLastname: secondLastname || undefined,
        gender: gender || undefined,
        birthdate: birthdate || undefined,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        programId: programId ? Number(programId) : undefined,
        country: country || undefined,
        city: city || undefined,
        mobile: mobile || undefined,
        email: emailFilter || undefined,
        academicEmail: academicEmail || undefined,
        role: 'GRADUATE', // Por defecto buscar solo graduados
      }
      const pageQuery: PageQuery = { page, pageSize }
      const result = await GraduateSearchService.searchGraduates(filters, pageQuery)
      setSearchResults(result.content)
      setTotalPages(result.totalPages)
      setTotalCount(result.totalCount)
    } catch (error) {
      logger.error("Error searching graduates:", error)
      setSearchResults([])
      setTotalPages(1)
      setTotalCount(0)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (isClient) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, page, pageSize])

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting results")
  }

  // No renderizar nada hasta que estemos en el cliente
  if (!isClient) {
    return null
  }

  // Verificar permisos después de que los datos estén cargados
  if (role !== ROLES.ADMINISTRATIVE && role !== ROLES.DEAN) {
    return null
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
                      <label htmlFor="name" className="text-sm font-medium">
                        Nombre
                      </label>
                      <Input
                        id="name"
                        placeholder="Nombre(s)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="middleName" className="text-sm font-medium">
                        Segundo Nombre
                      </label>
                      <Input
                        id="middleName"
                        placeholder="Segundo nombre"
                        value={middleName}
                        onChange={e => setMiddleName(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastname" className="text-sm font-medium">
                        Primer Apellido
                      </label>
                      <Input
                        id="lastname"
                        placeholder="Primer apellido"
                        value={lastname}
                        onChange={e => setLastname(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="secondLastname" className="text-sm font-medium">
                        Segundo Apellido
                      </label>
                      <Input
                        id="secondLastname"
                        placeholder="Segundo apellido"
                        value={secondLastname}
                        onChange={e => setSecondLastname(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="gender" className="text-sm font-medium">
                        Género
                      </label>
                      <Select value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="">Seleccionar género</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="birthdate" className="text-sm font-medium">
                        Fecha de Nacimiento
                      </label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={e => setBirthdate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="graduationYear" className="text-sm font-medium">
                        Año de Graduación
                      </label>
                      <Select value={graduationYear} onChange={e => setGraduationYear(e.target.value)}>
                        <option value="">Seleccionar año</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year.toString()}>{year}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="programId" className="text-sm font-medium">
                        Programa Académico
                      </label>
                      <Select value={programId} onChange={e => setProgramId(e.target.value)}>
                        <option value="">Seleccionar programa</option>
                        {programs.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="country" className="text-sm font-medium">
                        País
                      </label>
                      <Input
                        id="country"
                        placeholder="País"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">
                        Ciudad
                      </label>
                      <Input
                        id="city"
                        placeholder="Ciudad"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="mobile" className="text-sm font-medium">
                        Teléfono
                      </label>
                      <Input
                        id="mobile"
                        placeholder="Teléfono móvil"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        maxLength={20}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Personal
                      </label>
                      <Input
                        id="email"
                        placeholder="Email personal"
                        value={emailFilter}
                        onChange={e => setEmailFilter(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="academicEmail" className="text-sm font-medium">
                        Email Académico
                      </label>
                      <Input
                        id="academicEmail"
                        placeholder="Email académico"
                        value={academicEmail}
                        onChange={e => setAcademicEmail(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="submit" className="udea-primary" disabled={isSearching}>
                      {isSearching ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                </form>

                {catalogError && (
                  <div className="text-red-600 text-sm mb-4">{catalogError}</div>
                )}

                {searchResults.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-muted-foreground text-sm">
                        Mostrando {searchResults.length} de {totalCount} resultados
                      </div>
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map(graduate => (
                        <Card key={graduate.id} className="border shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                              {graduate.name} {graduate.middleName} {graduate.lastname} {graduate.secondLastname}
                            </CardTitle>
                            <CardDescription>
                              {graduate.email || graduate.academicEmail}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-1">
                            <div><span className="font-medium">Programas:</span> {graduate.programs?.map(p => p.name).join(", ") || "No especificado"}</div>
                            <div><span className="font-medium">País:</span> {graduate.country || "No especificado"}</div>
                            <div><span className="font-medium">Ciudad:</span> {graduate.city || "No especificado"}</div>
                            <div><span className="font-medium">Rol:</span> {graduate.role || "No especificado"}</div>
                            <div><span className="font-medium">Género:</span> {graduate.gender || "No especificado"}</div>
                            <div><span className="font-medium">Teléfono:</span> {graduate.mobile || "No especificado"}</div>
                            <div><span className="font-medium">Email Personal:</span> {graduate.email || "No especificado"}</div>
                            <div><span className="font-medium">Email Académico:</span> {graduate.academicEmail || "No especificado"}</div>
                            <div className="flex justify-end pt-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => router.push(`${ROUTES.ADMIN.VIEW_PROFILE}?userId=${graduate.id}`)}
                              >
                                Ver Perfil
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span>Página {page + 1} de {totalPages}</span>
                      <Button variant="ghost" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
