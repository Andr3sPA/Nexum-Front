# Servicios de la Aplicación

Esta carpeta contiene todos los servicios de la aplicación organizados en módulos para una mejor estructura y mantenibilidad.

## Estructura

```
lib/services/
├── index.ts                    # Archivo de índice principal
├── base.service.ts             # Servicio base con funciones comunes
├── local-storage.service.ts    # Servicio para manejo de localStorage
├── auth.service.ts             # Servicio de autenticación
├── user.service.ts             # Servicio de usuarios
├── detailed-user.service.ts    # Servicio de usuarios detallados
├── graduate-search.service.ts  # Servicio de búsqueda de egresados
├── constants/                  # Constantes de la API
│   └── api.constants.ts
├── catalog/                    # Módulo de servicios del catálogo
│   ├── index.ts
│   ├── identity-document-type.service.ts
│   ├── salary-range.service.ts
│   ├── program.service.ts
│   ├── program-version.service.ts
│   ├── program-competency.service.ts
│   ├── job-institution-type.service.ts
│   ├── job-delay.service.ts
│   ├── job-area.service.ts
│   ├── innovation-process-type.service.ts
│   └── alternative-academic-route.service.ts
└── profile/                    # Módulo de servicios del perfil
    ├── index.ts
    ├── contact-information.service.ts
    ├── family-information.service.ts
    ├── job.service.ts
    ├── graduate-participation.service.ts
    ├── coursed-program.service.ts
    ├── academic-education.service.ts
    └── program-opinion.service.ts
```

## Módulos

### Catalog Services
Servicios que manejan datos del catálogo (información estática):
- **IdentityDocumentTypeService**: Tipos de documento de identidad
- **SalaryRangeService**: Rangos salariales
- **ProgramService**: Programas universitarios
- **ProgramVersionService**: Versiones de programas
- **ProgramCompetencyService**: Competencias de programas
- **JobInstitutionTypeService**: Tipos de institución de empleo
- **JobDelayService**: Opciones de demora laboral
- **JobAreaService**: Áreas de primer empleo
- **InnovationProcessTypeService**: Tipos de proceso de innovación
- **AlternativeAcademicRouteService**: Rutas de formación alternativa

### Profile Services
Servicios que manejan información del perfil de usuario:
- **ContactInformationService**: Información de contacto
- **FamilyInformationService**: Información familiar
- **JobService**: Información laboral
- **GraduateParticipationService**: Participación del egresado
- **CoursedProgramService**: Programas cursados
- **AcademicEducationService**: Educación académica adicional
- **ProgramOpinionService**: Opiniones del programa

## Uso

### Importar desde el índice principal
```typescript
import { 
  AuthenticationService, 
  ContactInformationService,
  IdentityDocumentTypeService 
} from "@/lib/services"
```

### Importar desde módulos específicos
```typescript
import { ContactInformationService } from "@/lib/services/profile"
import { IdentityDocumentTypeService } from "@/lib/services/catalog"
```

### Importar servicios individuales
```typescript
import { ContactInformationService } from "@/lib/services/profile/contact-information.service"
import { IdentityDocumentTypeService } from "@/lib/services/catalog/identity-document-type.service"
```

## Características

- **Modularidad**: Servicios organizados por funcionalidad
- **Tipado completo**: Todas las interfaces basadas en el API documentation
- **Manejo de errores**: Cada método incluye manejo de errores apropiado
- **Autenticación**: Servicios de perfil usan `serviceWithAuth`, catálogo usa `service`
- **Consistencia**: Todos siguen el mismo patrón de nomenclatura y estructura
- **Compatibilidad**: Mantiene compatibilidad con servicios existentes

## Hosts de API

- **API_HOST**: `http://localhost:8100/nexum` - Para servicios principales
- **CATALOG_HOST**: `http://localhost:8110/nexum` - Para servicios del catálogo 