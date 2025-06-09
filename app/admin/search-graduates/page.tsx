"use client"

import { CardDescription } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search } from "lucide-react"
import { sanitizeInput } from "@/lib/security"
import Navbar from "@/components/navbar"

import { logger } from "@/lib/logging"

export default function SearchGraduatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [program, setProgram] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [location, setLocation] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    try {
      // Sanitize inputs
      const sanitizedSearchTerm = sanitizeInput(searchTerm)

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock results
      setSearchResults([
        {
          id: 1,
          name: "Ana María Rodríguez",
          email: "ana.rodriguez@example.com",
          program: "Ingeniería de Sistemas",
          graduationYear: "2020",
          location: "Medellín",
        },
        {
          id: 2,
          name: "Carlos Gómez",
          email: "carlos.gomez@example.com",
          program: "Ingeniería de Sistemas",
          graduationYear: "2019",
          location: "Bogotá",
        },
        {
          id: 3,
          name: "Laura Martínez",
          email: "laura.martinez@example.com",
          program: "Ingeniería de Sistemas",
          graduationYear: "2021",
          location: "Medellín",
        },
      ])
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
      <Navbar />
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
                      <Select value={program} onValueChange={setProgram}>
                        <SelectTrigger id="program">
                          <SelectValue placeholder="Seleccionar programa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sistemas">Ingeniería de Sistemas</SelectItem>
                          <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                          <SelectItem value="electronica">Ingeniería Electrónica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="graduationYear" className="text-sm font-medium">
                        Año de Graduación
                      </label>
                      <Select value={graduationYear} onValueChange={setGraduationYear}>
                        <SelectTrigger id="graduationYear">
                          <SelectValue placeholder="Seleccionar año" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Ubicación
                      </label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Seleccionar ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medellin">Medellín</SelectItem>
                          <SelectItem value="bogota">Bogotá</SelectItem>
                          <SelectItem value="cali">Cali</SelectItem>
                          <SelectItem value="internacional">Internacional</SelectItem>
                        </SelectContent>
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
                                <TableCell>{graduate.name}</TableCell>
                                <TableCell>{graduate.email}</TableCell>
                                <TableCell>{graduate.program}</TableCell>
                                <TableCell>{graduate.graduationYear}</TableCell>
                                <TableCell>{graduate.location}</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
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
