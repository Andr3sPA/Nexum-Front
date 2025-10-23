"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AccountService, AuthResponse, RoleName, AuthRequest, PageResponse } from "@/lib/services/profile/account.service"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/atoms/table"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { Button } from "@/components/atoms/button"
import Navbar from "@/components/navbar"
import { LocalStorageService } from '@/lib/services/local-storage.service'

const ROLES = [
  { value: '', label: 'Todos' },
  { value: RoleName.ADMINISTRATIVE, label: 'Administrativo' },
  { value: RoleName.GRADUATE, label: 'Egresado' },
  { value: RoleName.DEAN, label: 'Decano' },
]

function AccountFilters({ filters, onChange, onSearch, loading }: any) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSearch(); }} className="flex flex-wrap gap-4 items-end mb-6">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input value={filters.email} onChange={e => onChange('email', e.target.value)} placeholder="Buscar por email" className="w-56" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rol</label>
        <Select value={filters.role} onChange={e => onChange('role', e.target.value)} className="w-40">
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </Select>
      </div>
      <Button type="submit" className="h-10">Filtrar</Button>
    </form>
  )
}

function EditAccountRow({ account, onSave, onCancel }: { account: AuthResponse, onSave: (data: AuthRequest) => void, onCancel: () => void }) {
  const [email, setEmail] = useState(account.email)
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(account.role)
  const [verified, setVerified] = useState(account.verified ? "TRUE" : "FALSE")
  const [loading, setLoading] = useState(false)
  return (
    <TableRow className="bg-[#f3f8f4] border-2 border-[#43b649] animate-pulse-[0.5s]">
      <TableCell>
        <Input value={email} onChange={e => setEmail(e.target.value)} className="h-9 text-sm" />
      </TableCell>
      <TableCell>
        <Input value={account.lastname + ' ' + (account.secondLastname || '')} disabled className="h-9 text-sm bg-neutral-100" />
      </TableCell>
      <TableCell>
        <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Nueva contraseña" type="password" className="h-9 text-sm" />
      </TableCell>
      <TableCell>
        <Select value={role} onChange={e => setRole(e.target.value as RoleName)} className="h-9 text-sm">
          {ROLES.filter(r => r.value).map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </Select>
      </TableCell>
      <TableCell>
        <Select value={verified} onChange={e => setVerified(e.target.value)} className="h-9 text-sm">
          <option value="TRUE">Verificado</option>
          <option value="FALSE">No Verificado</option>
        </Select>
      </TableCell>
      <TableCell className="flex gap-2 justify-start items-center bg-transparent">
        <Button size="sm" onClick={async () => { 
          setLoading(true); 
          try { 
            await onSave({ email, password, role, verified }); 
          } finally { 
            setLoading(false); 
          }
        }} disabled={loading} className="px-4">Guardar</Button>
        <Button size="sm" variant="secondary" onClick={onCancel} className="px-4">Cancelar</Button>
      </TableCell>
    </TableRow>
  )
}

export default function AdminAccountsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({ email: '', role: '' })
  const [accounts, setAccounts] = useState<AuthResponse[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const res: PageResponse<AuthResponse> = await AccountService.findAllFiltered(
        { email: filters.email, role: filters.role as RoleName },
        { page, size }
      )
      setAccounts(res.content)
      setTotalPages(res.totalPages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAccounts() }, [page, size])

  const handleFilterChange = (field: string, value: string) => setFilters(f => ({ ...f, [field]: value }))
  const handleSearch = () => { setPage(0); fetchAccounts() }

  const handleEditSave = async (idx: number, data: AuthRequest) => {
    console.log("🔄 Updating account:", data)
    console.log("🔄 Verified field type:", typeof data.verified, "value:", data.verified)
    
    console.log("📤 Sending to backend:", data)
    const account = accounts[idx]
    await AccountService.updateById(account.id, data)
    setEditIdx(null)
    fetchAccounts()
  }

  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const user = LocalStorageService.getItem<any>("user")
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")

  return (
    <div className="min-h-screen bg-neutral-50">
      {user && userProfile && (
        <Navbar user={{
          firstName,
          firstLastname,
          email,
          role: user?.role,
          initials,
          ...userProfile
        }} />
      )}
      <div className="mx-auto py-10 px-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Administrar Cuentas</h1>
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
        </div>
        <AccountFilters filters={filters} onChange={handleFilterChange} onSearch={handleSearch} loading={loading} />
        <div className="bg-white rounded-lg shadow">
          <Table  className="rounded-lg">
            <TableHeader>
              <TableRow className="bg-[#026937] font-bold text-md text-white rounded-t-lg">
                <TableHead className="text-white font-bold">Email</TableHead>
                <TableHead className="text-white font-bold">Nombre</TableHead>
                <TableHead className="text-white font-bold">Apellidos</TableHead>
                <TableHead className="text-white font-bold">Rol</TableHead>
                <TableHead className="text-white font-bold">Verificado</TableHead>
                <TableHead className="text-white font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((acc, idx) =>
                editIdx === idx ? (
                  <EditAccountRow
                    key={acc.email}
                    account={acc}
                    onSave={data => handleEditSave(idx, data)}
                    onCancel={() => setEditIdx(null)}
                  />
                ) : (
                  <TableRow key={acc.id}>
                    <TableCell>{acc.email}</TableCell>
                    <TableCell>{acc.name} {acc.middleName}</TableCell>
                    <TableCell>{acc.lastname} {acc.secondLastname}</TableCell>
                    <TableCell>{ROLES.find(r => r.value === acc.role)?.label}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        acc.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {acc.verified ? 'Verificado' : 'No Verificado'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => setEditIdx(idx)}>Editar</Button>
                    </TableCell>
                  </TableRow>
                )
              )}
              {accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No hay cuentas para mostrar</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end items-center justify-content p-4">
            <Button size="sm" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Anterior</Button>
            <span className="px-2 text-sm">Página {page + 1} de {totalPages}</span>
            <Button size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
