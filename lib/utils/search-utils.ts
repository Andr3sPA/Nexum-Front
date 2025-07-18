/**
 * Separa una cadena de nombres en nombre y segundo nombre
 * @param names - Cadena con todos los nombres (ej: "Juan Carlos María")
 * @returns Objeto con name y middleName
 */
export function separateNames(names: string): { name: string; middleName: string } {
  if (!names || names.trim() === '') {
    return { name: '', middleName: '' }
  }

  const nameParts = names.trim().split(/\s+/)
  
  if (nameParts.length === 1) {
    return { name: nameParts[0], middleName: '' }
  }
  
  if (nameParts.length === 2) {
    return { name: nameParts[0], middleName: nameParts[1] }
  }
  
  // Si hay más de 2 nombres, el primero es el nombre principal
  // y el resto van al segundo nombre
  return {
    name: nameParts[0],
    middleName: nameParts.slice(1).join(' ')
  }
}

/**
 * Separa una cadena de apellidos en primer apellido y segundo apellido
 * @param lastnames - Cadena con todos los apellidos (ej: "Pérez López")
 * @returns Objeto con lastname y secondLastname
 */
export function separateLastnames(lastnames: string): { lastname: string; secondLastname: string } {
  if (!lastnames || lastnames.trim() === '') {
    return { lastname: '', secondLastname: '' }
  }

  const lastnameParts = lastnames.trim().split(/\s+/)
  
  if (lastnameParts.length === 1) {
    return { lastname: lastnameParts[0], secondLastname: '' }
  }
  
  if (lastnameParts.length === 2) {
    return { lastname: lastnameParts[0], secondLastname: lastnameParts[1] }
  }
  
  // Si hay más de 2 apellidos, el primero es el apellido principal
  // y el resto van al segundo apellido
  return {
    lastname: lastnameParts[0],
    secondLastname: lastnameParts.slice(1).join(' ')
  }
}

/**
 * Convierte los filtros simplificados a filtros detallados para la API
 * @param filters - Filtros simplificados con names y lastnames
 * @returns Filtros detallados separados
 */
export function convertFiltersToDetailed(filters: {
  names: string
  lastnames: string
  gender: string
  startYear: string
  endYear: string
  programId: string
  country: string
  city: string
  mobile: string
  email: string
  academicEmail: string
}): {
  name: string
  middleName: string
  lastname: string
  secondLastname: string
  gender: string
  startYear: string
  endYear: string
  programId: string
  country: string
  city: string
  mobile: string
  email: string
  academicEmail: string
} {
  const { name, middleName } = separateNames(filters.names)
  const { lastname, secondLastname } = separateLastnames(filters.lastnames)

  return {
    name,
    middleName,
    lastname,
    secondLastname,
    gender: filters.gender,
    startYear: filters.startYear,
    endYear: filters.endYear,
    programId: filters.programId,
    country: filters.country,
    city: filters.city,
    mobile: filters.mobile,
    email: filters.email,
    academicEmail: filters.academicEmail
  }
} 