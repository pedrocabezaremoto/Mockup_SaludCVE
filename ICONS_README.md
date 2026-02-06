# Sistema de Iconos SVG - SaludConecta VE

Este documento describe el sistema de iconos SVG minimalista implementado para reemplazar los emojis en la interfaz.

## 📁 Estructura de Carpetas

```
src/components/icons/
├── navigation/           # Iconos de navegación
│   ├── Search.tsx       # 🔍 → SVG Lupa
│   ├── Calendar.tsx     # 📅 → SVG Calendario
│   ├── Clipboard.tsx    # 📋 → SVG Portapapeles
│   └── Chat.tsx         # 💬 → SVG Chat
│
├── users/               # Iconos de usuarios
│   ├── Doctor.tsx       # 👨‍⚕️👩‍⚕️ → SVG Doctor
│   └── User.tsx         # 👤 → SVG Usuario
│
├── location/            # Iconos de ubicación y contacto
│   ├── Hospital.tsx     # 🏥 → SVG Hospital
│   ├── Location.tsx     # 📍 → SVG Pin de ubicación
│   ├── Phone.tsx        # 📞 → SVG Teléfono
│   ├── Mobile.tsx       # 📱 → SVG Móvil
│   └── IdCard.tsx       # 🪪 → SVG Tarjeta ID
│
├── schedule/            # Iconos de horarios
│   ├── Morning.tsx      # 🌅 → SVG Sol (mañana)
│   └── Afternoon.tsx    # 🌆 → SVG Sol parcial (tarde)
│
├── status/              # Iconos de estados de cita
│   ├── Confirmed.tsx    # ✅ → SVG Check circular
│   ├── Pending.tsx      # ⏳ → SVG Reloj
│   ├── Rejected.tsx     # ❌ → SVG X circular
│   ├── Completed.tsx    # ✔️ → SVG Check
│   └── Cancelled.tsx    # 🚫 → SVG Prohibido
│
├── specialty/           # Iconos de especialidades médicas
│   ├── Pediatrics.tsx   # 👶 → SVG Figura infantil
│   ├── Gynecology.tsx   # 🤰 → SVG Símbolo femenino
│   ├── InternalMedicine.tsx  # 🩺 → SVG Estetoscopio
│   ├── Cardiology.tsx   # ❤️ → SVG Corazón
│   └── Surgery.tsx      # 🏥 → SVG Bisturí
│
├── alerts/              # Iconos de alertas e información
│   ├── Warning.tsx      # ⚠️ → SVG Triángulo de advertencia
│   ├── Info.tsx         # 💡 → SVG Círculo de información
│   ├── Academic.tsx     # 🎓 → SVG Birrete graduación
│   ├── Document.tsx     # 📌 → SVG Documento
│   ├── Wave.tsx         # 👋 → SVG Mano saludando
│   └── Sad.tsx          # 😔 → SVG Cara triste
│
└── index.ts             # Exportación centralizada
```

## 🎨 Características de Diseño

### Estilo Consistente
- **Unicolor**: Todos los iconos usan `currentColor` para heredar el color del texto
- **Stroke-based**: Diseño con trazos en lugar de formas rellenas
- **Grosor uniforme**: `strokeWidth="2"` en todos los iconos
- **Esquinas redondeadas**: `strokeLinecap="round"` y `strokeLinejoin="round"`

### Tamaños Disponibles
```typescript
size?: 'sm' | 'md' | 'lg' | 'xl'
// sm: 16x16px (w-4 h-4)
// md: 24x24px (w-6 h-6) - default
// lg: 32x32px (w-8 h-8)
// xl: 48x48px (w-12 h-12)
```

## 📖 Uso

### Importación Individual
```tsx
import { SearchIcon, CalendarIcon } from '@/components/icons';
```

### Importación por Categoría
```tsx
import { SearchIcon, CalendarIcon, ClipboardIcon, ChatIcon } from '@/components/icons/navigation';
```

### Ejemplos de Uso

#### Ejemplo Básico
```tsx
<SearchIcon size="md" />
```

#### Con Color Personalizado
```tsx
<SearchIcon size="lg" className="text-blue-500" />
```

#### En Botones
```tsx
<Button
    variant="primary"
    leftIcon={<CalendarIcon />}
>
    Agendar Cita
</Button>
```

#### Con Flexbox
```tsx
<div className="flex items-center gap-2">
    <LocationIcon size="sm" />
    <span>San Juan de los Morros</span>
</div>
```

## 🔄 Mapeo de Emojis a SVG

| Emoji Original | Componente SVG | Ubicaciones Principales |
|---------------|----------------|------------------------|
| 🔍 | `SearchIcon` | Home, MyAppointments |
| 📅 | `CalendarIcon` | Home, DoctorProfile |
| 📋 | `ClipboardIcon` | Home, MyAppointments |
| 💬 | `ChatIcon` | Home, Contact |
| 👨‍⚕️👩‍⚕️ | `DoctorIcon` | DoctorProfile, Search, MyAppointments |
| 👤 | `UserIcon` | Home, Login |
| 🏥 | `HospitalIcon` | Contact, Search, DoctorProfile |
| 📍 | `LocationIcon` | Contact, Search, DoctorProfile |
| 📞 | `PhoneIcon` | Contact, Search |
| 📱 | `MobileIcon` | Home |
| 🪪 | `IdCardIcon` | Home |
| 🌅 | `MorningIcon` | DoctorProfile, Search, MyAppointments |
| 🌆 | `AfternoonIcon` | DoctorProfile, Search, MyAppointments |
| ✅ | `ConfirmedIcon` | Home, MyAppointments |
| ⏳ | `PendingIcon` | MyAppointments |
| ❌ | `RejectedIcon` | MyAppointments |
| ✔️ | `CompletedIcon` | MyAppointments |
| 🚫 | `CancelledIcon` | MyAppointments |
| 👶 | `PediatricsIcon` | Search, DoctorProfile, MyAppointments |
| 🤰 | `GynecologyIcon` | Search, DoctorProfile, MyAppointments |
| 🩺 | `InternalMedicineIcon` | Search, DoctorProfile, MyAppointments |
| ❤️ | `CardiologyIcon` | Search, DoctorProfile, MyAppointments |
| ⚠️ | `WarningIcon` | Contact, Search, DoctorProfile, MyAppointments |
| 💡 | `InfoIcon` | Contact |
| 🎓 | `AcademicIcon` | Login |
| 📌 | `DocumentIcon` | Home, Contact, Login |
| 👋 | `WaveIcon` | Home |
| 😔 | `SadIcon` | Search |

## 🛠️ Personalización de Colores

Los iconos de especialidades médicas tienen colores predefinidos en las páginas donde se usan:

```tsx
// En Search.tsx, DoctorProfile.tsx, MyAppointments.tsx
const specialtyIcons = {
    'pediatria': <PediatricsIcon className="text-sky-500" />,
    'ginecologia': <GynecologyIcon className="text-pink-500" />,
    'medicina-interna': <InternalMedicineIcon className="text-blue-500" />,
    'cardiologia': <CardiologyIcon className="text-red-500" />,
    'cirugia-general': <SurgeryIcon className="text-purple-500" />
};
```

## 📦 Exportaciones

Todas las exportaciones están centralizadas en `src/components/icons/index.ts`:

```typescript
// Navegación
export { SearchIcon, CalendarIcon, ClipboardIcon, ChatIcon };

// Usuarios
export { DoctorIcon, UserIcon };

// Ubicación y Contacto
export { HospitalIcon, LocationIcon, PhoneIcon, MobileIcon, IdCardIcon };

// Horarios
export { MorningIcon, AfternoonIcon };

// Estados de Cita
export { ConfirmedIcon, PendingIcon, RejectedIcon, CompletedIcon, CancelledIcon };

// Especialidades Médicas
export { PediatricsIcon, GynecologyIcon, InternalMedicineIcon, CardiologyIcon, SurgeryIcon };

// Alertas e Información
export { WarningIcon, InfoIcon, AcademicIcon, DocumentIcon, WaveIcon, SadIcon };
```

## ✅ Archivos Actualizados

- ✅ [Home.tsx](src/pages/Home.tsx) - Iconos de navegación y perfil de usuario
- ✅ [Contact.tsx](src/pages/Contact.tsx) - Iconos de contacto y ubicación
- ✅ [Search.tsx](src/pages/Search.tsx) - Iconos de búsqueda y especialidades
- ✅ [DoctorProfile.tsx](src/pages/DoctorProfile.tsx) - Iconos de perfil médico
- ✅ [MyAppointments.tsx](src/pages/MyAppointments.tsx) - Iconos de estados de cita
- ✅ [Login.tsx](src/pages/Login.tsx) - Iconos de modo demo

## 🎯 Beneficios

1. **Consistencia Visual**: Diseño uniforme en toda la aplicación
2. **Escalabilidad**: Los SVG se ven nítidos en cualquier tamaño
3. **Accesibilidad**: `aria-hidden="true"` para lectores de pantalla
4. **Personalización**: Fácil cambio de colores con Tailwind CSS
5. **Rendimiento**: SVG inline, sin requests adicionales
6. **Mantenibilidad**: Estructura organizada y documentada
7. **Minimalismo**: Interfaz más moderna y profesional

## 🔮 Extensión Futura

Para agregar nuevos iconos:

1. Crear el componente en la carpeta correspondiente
2. Seguir la estructura de props existente (`size`, `className`)
3. Usar `currentColor` para el color
4. Exportar desde el `index.ts` de la carpeta
5. Agregar a `src/components/icons/index.ts`
6. Documentar en este README

---

**Proyecto:** SaludConecta VE  
**Fecha de implementación:** Febrero 2026  
**Diseño:** Sistema de iconos minimalista unicolor
