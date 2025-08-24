# Consultor de Afiliados
## Descripción General

Esta es una aplicación web full-stack diseñada para gestionar y buscar registros de afiliados. El sistema permite a los usuarios cargar archivos de Excel que contienen datos de afiliados y buscar afiliados específicos por su número de documento u otros criterios.

---

## 🚀 Características Principales

-   **Carga de Archivos Excel:** Permite cargar la base de datos de afiliados desde archivos `.xlsx` o `.xls`.
-   **Búsqueda Rápida:** Búsqueda de afiliados por número de cédula.
-   **Búsqueda Avanzada:** Filtrado de afiliados por múltiples criterios como nombres, apellidos, teléfono, prestador y categoría.
-   **Visualización de Resultados:** Muestra la información detallada del afiliado encontrado.
-   **Exportación de Resultados:** Permite exportar los resultados a formato **PDF** e **Imagen (PNG)**.
-   **Impresión de Comprobantes:** Genera un comprobante de prestación de servicios de salud listo para imprimir.
-   **Historial de Búsqueda:** Guarda un registro de las búsquedas realizadas.

---

## 📸 Capturas de Pantalla

| Carga de Archivos | Búsqueda Rápida |
| :---: | :---: |
| ![Captura de la interfaz de carga de archivos](https://i.imgur.com/cG2vKQw.png) | ![Captura de la sección de búsqueda rápida](https://i.imgur.com/9Uy7MeP.png) |
| **Búsqueda Avanzada** | **Ventana de Novedades** |
| ![Captura del formulario de búsqueda avanzada](https://i.imgur.com/XVaRHwf.png) | ![Captura de Novedades](https://i.imgur.com/6DbVd4e.png) |


---

## 🛠️ Tecnologías Utilizadas

### Frontend

-   **Framework:** React 18 con TypeScript y Vite.
-   **UI:** Componentes de [Shadcn/ui](https://ui.shadcn.com/) construidos sobre primitivos de Radix UI.
-   **Estilos:** Tailwind CSS con variables CSS personalizadas para temás claro y oscuro.
-   **Manejo de Estado:** TanStack Query (React Query) para el estado del servidor.
-   **Enrutamiento:** Wouter para un enrutamiento ligero del lado del cliente.
-   **Manejo de Formularios:** React Hook Form con Zod para validación.
-   **Procesamiento de Archivos:** SheetJS (XLSX) para el procesamiento de archivos Excel en el cliente.
-   **Generación de PDF:** jsPDF y html2canvas para la generación de reportes.

### Backend

-   **Framework:** Express.js con TypeScript.
-   **ORM de Base de Datos:** Drizzle ORM configurado para PostgreSQL.
-   **Base de Datos:** PostgreSQL con Neon Database (Serverless).
-   **Manejo de Sesiones:** Almacenamiento de sesiones en PostgreSQL.

---

## ⚙️ Prerrequisitos

-   Node.js (v20 o superior)
-   npm (o un gestor de paquetes similar)
-   Una base de datos PostgreSQL

---

## 📂 Estructura del Proyecto

| **IMG** |
| ![IMG](https://i.imgur.com/4936iZ3.png)|

---
## 🧑‍💻 Uso de la Aplicación

1.  **Cargar el archivo Excel:** Arrastra y suelta un archivo `.xlsx` o `.xls` en el área designada o haz clic para seleccionarlo. El archivo debe contener las columnas requeridas (ver `client/src/types/affiliate.ts`).
2.  **Buscar un afiliado:**
    -   **Búsqueda Rápida:** Ingresa el número de documento del afiliado y haz clic en "Consultar".
    -   **Búsqueda Avanzada:** Cambia al modo de búsqueda avanzada y completa los campos que desees para filtrar los resultados.
3.  **Ver y exportar resultados:**
    -   La información del afiliado se mostrará en una tarjeta de resultados.
    -   Utiliza los botones "PDF" e "Imagen" para descargar la información.
    -   Haz clic en "Imprimir Comprobante" para generar un formato de prestación de servicios de salud.

---

## 📄 Licencia

Creado por Kevin Posso Hurtado
