# Componentes de Búsqueda de Graduados

Este documento describe los nuevos componentes atómicos, moleculares y organismos creados para la funcionalidad de búsqueda de graduados.

## Átomos (Atoms)

### SearchEmptyState
Componente para mostrar el estado vacío cuando no hay resultados de búsqueda.

**Props:**
- `icon`: Icono de Lucide React
- `title`: Título del estado vacío
- `description`: Descripción del estado vacío
- `isLoading`: Indica si está cargando

**Uso:**
```tsx
<SearchEmptyState
  icon={Search}
  title="No se encontraron resultados"
  description="Intenta ajustar los filtros de búsqueda"
  isLoading={false}
/>
```

### GraduateCard
Tarjeta que muestra la información de un graduado en los resultados de búsqueda.

**Props:**
- `graduate`: Objeto con la información del graduado
- `onViewProfile`: Función callback para ver el perfil completo

**Uso:**
```tsx
<GraduateCard
  graduate={graduateData}
  onViewProfile={(id) => router.push(`/profile?userId=${id}`)}
/>
```

### Pagination
Componente de paginación reutilizable.

**Props:**
- `currentPage`: Página actual
- `totalPages`: Total de páginas
- `onPageChange`: Función callback para cambiar de página
- `showPageInfo`: Mostrar información de página (opcional)

**Uso:**
```tsx
<Pagination
  currentPage={0}
  totalPages={5}
  onPageChange={(page) => setPage(page)}
/>
```

## Moléculas (Molecules)

### SearchFilters
Componente que contiene todos los filtros de búsqueda en una barra lateral.

**Props:**
- `filters`: Objeto con todos los valores de los filtros simplificados
- `onFilterChange`: Función para actualizar filtros
- `onSubmit`: Función para ejecutar la búsqueda
- `isLoading`: Estado de carga
- `programs`: Lista de programas académicos

**Filtros Simplificados:**
```typescript
{
  names: string        // "Juan Carlos María" - incluye todos los nombres
  lastnames: string    // "Pérez López" - incluye todos los apellidos
  gender: string
  birthdate: string
  graduationYear: string
  programId: string
  country: string
  city: string
  mobile: string
  email: string
  academicEmail: string
}
```

**Uso:**
```tsx
<SearchFilters
  filters={filters}
  onFilterChange={handleFilterChange}
  onSubmit={handleSearch}
  isLoading={isSearching}
  programs={programs}
/>
```

### SearchResults
Componente que muestra los resultados de búsqueda con paginación.

**Props:**
- `results`: Array de resultados
- `totalCount`: Total de resultados
- `currentPage`: Página actual
- `totalPages`: Total de páginas
- `onPageChange`: Función para cambiar página
- `onViewProfile`: Función para ver perfil
- `onExport`: Función para exportar (opcional)

**Uso:**
```tsx
<SearchResults
  results={searchResults}
  totalCount={totalCount}
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  onViewProfile={handleViewProfile}
  onExport={handleExport}
/>
```

## Organismos (Organisms)

### GraduateSearch
Organismo principal que combina todos los componentes de búsqueda.

**Props:**
- `filters`: Objeto con todos los filtros simplificados
- `onFilterChange`: Función para actualizar filtros
- `onSearch`: Función para ejecutar búsqueda
- `onClearFilters`: Función para limpiar filtros
- `onViewProfile`: Función para ver perfil
- `onExport`: Función para exportar (opcional)
- `onPageChange`: Función para cambiar página
- `results`: Array de resultados
- `totalCount`: Total de resultados
- `currentPage`: Página actual
- `totalPages`: Total de páginas
- `isLoading`: Estado de carga general
- `isSearching`: Estado de búsqueda
- `programs`: Lista de programas
- `catalogError`: Error de catálogos (opcional)

**Uso:**
```tsx
<GraduateSearch
  filters={filters}
  onFilterChange={handleFilterChange}
  onSearch={handleSearch}
  onClearFilters={handleClearFilters}
  onViewProfile={handleViewProfile}
  onExport={handleExport}
  onPageChange={handlePageChange}
  results={searchResults}
  totalCount={totalCount}
  currentPage={page}
  totalPages={totalPages}
  isSearching={isSearching}
  programs={programs}
  catalogError={catalogError}
/>
```

## Funciones Utilitarias

### search-utils.ts
Contiene funciones para manejar la separación de nombres y apellidos.

#### `separateNames(names: string)`
Separa una cadena de nombres en nombre principal y segundo nombre.

```typescript
// Ejemplos:
separateNames("Juan")           // { name: "Juan", middleName: "" }
separateNames("Juan Carlos")    // { name: "Juan", middleName: "Carlos" }
separateNames("Juan Carlos María") // { name: "Juan", middleName: "Carlos María" }
```

#### `separateLastnames(lastnames: string)`
Separa una cadena de apellidos en primer apellido y segundo apellido.

```typescript
// Ejemplos:
separateLastnames("Pérez")           // { lastname: "Pérez", secondLastname: "" }
separateLastnames("Pérez López")     // { lastname: "Pérez", secondLastname: "López" }
separateLastnames("Pérez López García") // { lastname: "Pérez", secondLastname: "López García" }
```

#### `convertFiltersToDetailed(filters)`
Convierte los filtros simplificados a filtros detallados para la API.

```typescript
const simplifiedFilters = {
  names: "Juan Carlos",
  lastnames: "Pérez López",
  // ... otros filtros
}

const detailedFilters = convertFiltersToDetailed(simplifiedFilters)
// Resultado:
// {
//   name: "Juan",
//   middleName: "Carlos",
//   lastname: "Pérez",
//   secondLastname: "López",
//   // ... otros filtros
// }
```

## Reutilización de Componentes Existentes

Los nuevos componentes reutilizan varios componentes existentes:

### Átomos Reutilizados:
- `Button`: Para botones de acción
- `Input`: Para campos de texto
- `Select`: Para campos de selección
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`: Para estructura de tarjetas

### Moléculas Reutilizadas:
- `Card`: Como base para todos los contenedores

## Estructura de Archivos

```
components/
├── atoms/
│   ├── search-empty-state.tsx
│   ├── graduate-card.tsx
│   └── pagination.tsx
├── molecules/
│   ├── search-filters.tsx
│   └── search-results.tsx
├── organisms/
│   └── graduate-search.tsx
├── lib/
│   └── utils/
│       └── search-utils.ts
└── index.ts (archivos de exportación)
```

## Beneficios de la Arquitectura

1. **Reutilización**: Los componentes pueden ser reutilizados en otras partes de la aplicación
2. **Mantenibilidad**: Cada componente tiene una responsabilidad específica
3. **Testabilidad**: Los componentes pequeños son más fáciles de probar
4. **Consistencia**: Mantiene el mismo patrón de diseño que el resto de la aplicación
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar componentes existentes
6. **UX Mejorada**: Filtros simplificados que son más fáciles de usar para el usuario

## Mejoras en la Experiencia de Usuario

### Filtros Simplificados
- **Nombres**: Un solo campo para todos los nombres (ej: "Juan Carlos María")
- **Apellidos**: Un solo campo para todos los apellidos (ej: "Pérez López")
- **Separación Automática**: La aplicación se encarga de separar internamente los campos
- **Textos de Ayuda**: Placeholders y descripciones que guían al usuario

### Ventajas:
- ✅ Menos campos para llenar
- ✅ Más intuitivo para el usuario
- ✅ Flexibilidad en el formato de entrada
- ✅ Mantiene la funcionalidad completa de búsqueda 