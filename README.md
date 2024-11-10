# 🚀 Proyecto Deno Rápido - Plantilla para Aplicaciones Web con Deno, Oak y MySQL

![Deno](https://img.shields.io/badge/Deno-1.x-000000?logo=deno&logoColor=white)
![Oak](https://img.shields.io/badge/Oak-10.x-007acc?logo=deno&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-green.svg)

## 📑 Tabla de Contenidos

1. [📖 Descripción](#-descripción)
2. [✨ Características Principales](#-características-principales)
3. [📁 Estructura del Proyecto](#-estructura-del-proyecto)
4. [⚙️ Instalación y Configuración](#️-instalación-y-configuración)
   - [Prerequisitos](#prerequisitos)
   - [Pasos de Instalación](#pasos-de-instalación)
5. [🔧 Tecnologías Utilizadas](#-tecnologías-utilizadas)
6. [🛠️ Uso del Proyecto](#️-uso-del-proyecto)
7. [📋 Funcionalidades](#-funcionalidades)
8. [🛡️ Middlewares](#️-middlewares)
9. [📜 Scripts Útiles](#-scripts-útiles)
10. [🤝 Contribuciones](#-contribuciones)
11. [🔒 Licencia](#-licencia)
12. [📞 Contacto](#-contacto)
13. [💡 Agradecimientos](#-agradecimientos)

## 📖 Descripción

Este proyecto es una plantilla rápida para crear aplicaciones web con **Deno**, utilizando el framework web **Oak**, gestión de variables de entorno con **dotenv**, y conexión a bases de datos **MySQL**. Incluye una estructura modular para añadir fácilmente nuevas funcionalidades, y proporciona un punto de partida sólido para desarrollar aplicaciones escalables y mantenibles.

## ✨ Características Principales

- **Estructura Modular:** Organización clara del código con separación por funcionalidades.
- **Gestión de Variables de Entorno:** Uso de **dotenv** para cargar variables de entorno desde un archivo `.env`.
- **Conexión a MySQL:** Integración con **MySQL** mediante el driver oficial.
- **Framework Oak:** Utilización de **Oak** para manejar rutas, middlewares y solicitudes HTTP.
- **Middlewares Personalizados:** Implementación de middlewares para manejo de errores y autenticación.
- **Generador de Código:** Funcionalidades para generar código de manera automatizada, facilitando la creación de nuevos módulos.

## 📁 Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

```
├── .env
├── deps.ts
├── main.ts
├── middlewares/
│   ├── error.middleware.ts
│   └── auth.middleware.ts
├── settings/
│   └── config.ts
└── src/
    └── feature_a/
        ├── controllers/
        ├── db/
        ├── models/
        ├── routes/
        └── services/
```

- **.env:** Archivo de variables de entorno.
- **deps.ts:** Archivo para manejar las dependencias del proyecto.
- **main.ts:** Archivo principal donde se inicializa la aplicación.
- **middlewares/:** Directorio que contiene los middlewares globales.
- **settings/:** Configuraciones globales de la aplicación.
- **src/:** Directorio principal del código fuente, organizado por funcionalidades (features).

## ⚙️ Instalación y Configuración

### Prerequisitos

- **Deno:** Asegúrate de tener instalado Deno en tu sistema. Puedes instalarlo desde [aquí](https://deno.land/#installation).
- **Git:** Opcional, pero recomendado para el control de versiones.

### Pasos de Instalación

1. **Crear y entrar al directorio del proyecto:**

   ```bash
   mkdir mi-proyecto-deno
   cd mi-proyecto-deno
   ```

2. **Inicializar Git (opcional pero recomendado):**

   ```bash
   git init
   ```

3. **Crear archivo de configuración de Deno:**

   ```bash
   deno init
   ```

4. **Agregar dependencias:**

   - **Oak - Framework web:**

     ```bash
     deno add oak
     ```

   - **dotenv - Para variables de entorno:**

     ```bash
     deno add dotenv
     ```

   - **MySQL driver:**

     ```bash
     deno add mysql
     ```

5. **Crear archivo de variables de entorno (.env):**

   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=tu_base_de_datos
   DB_PORT=3306
   PORT=8000
   ```

6. **Ejecutar la aplicación:**

   ```bash
   deno run --allow-net --allow-read main.ts
   ```

## 🔧 Tecnologías Utilizadas

- **Deno:** Runtime seguro para JavaScript y TypeScript.
- **Oak:** Middleware framework para Deno similar a Koa.
- **dotenv:** Carga variables de entorno desde un archivo `.env`.
- **MySQL Driver:** Driver oficial para conectar Deno con MySQL.

## 🛠️ Uso del Proyecto

El proyecto está diseñado para facilitar la adición de nuevas funcionalidades (features) de manera modular. A continuación, se muestra cómo crear una nueva funcionalidad siguiendo la estructura propuesta.

### Ejemplo: Añadiendo una Nueva Feature

1. **Crear la estructura de directorios:**

   Dentro de `src/`, crea un nuevo directorio para la feature, por ejemplo `feature_b/`, con los siguientes subdirectorios:

   ```
   src/
   └── feature_b/
       ├── controllers/
       ├── db/
       ├── models/
       ├── routes/
       └── services/
   ```

2. **Crear los archivos necesarios:**

   - **Controller:** `controllers/feature_b_controller.ts`
   - **DB Service:** `db/feature_b_db_service.ts`
   - **Model:** `models/feature_b_model.ts`
   - **Routes:** `routes/feature_b_routes.ts`
   - **Service:** `services/feature_b_service.ts`

3. **Implementar la lógica de la feature en los archivos correspondientes.**

4. **Registrar las rutas en `main.ts`:**

   Importa y usa las rutas de la nueva feature en `main.ts`:

   ```typescript
   import { Application } from "./deps.ts";
   import { router as featureBRoutes } from "./src/feature_b/routes/feature_b_routes.ts";

   const app = new Application();

   // Usar las rutas
   app.use(featureBRoutes.routes());
   ```

## 📋 Funcionalidades

- **Rutas:** Definición de rutas para diferentes endpoints de la API.
  
  ```typescript
  // src/feature_a/routes/feature_routes.ts
  import { Router } from "../../../deps.ts";
  import { FeatureController } from "../controllers/feature_controller.ts";
  
  const router = new Router();
  const controller = new FeatureController();
  
  router.get("/api/feature", controller.getAll);
  router.post("/api/feature", controller.create);
  
  export { router };
  ```

- **Controladores:** Manejo de la lógica de las solicitudes HTTP.
- **Servicios:** Implementación de la lógica de negocio.
- **Modelos:** Definición de interfaces y tipos de datos.
- **Servicios de Base de Datos:** Conexión y operaciones con la base de datos.

## 🛡️ Middlewares

El proyecto incluye middlewares personalizados para mejorar la funcionalidad y seguridad de la aplicación.

- **error.middleware.ts:** Manejo global de errores en la aplicación.
- **auth.middleware.ts:** Autenticación y autorización de usuarios.

## 📜 Scripts Útiles

- **Iniciar el servidor:**

  ```bash
  deno run --allow-net --allow-read main.ts
  ```

- **Ejecutar pruebas:**

  ```bash
  deno test
  ```

- **Formatear el código:**

  ```bash
  deno fmt
  ```

- **Analizar el código en busca de problemas:**

  ```bash
  deno lint
  ```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas colaborar, por favor sigue estos pasos:

1. **Fork** el proyecto.
2. Crea una **rama** para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus **cambios** y **commits** (`git commit -m 'Agrega nueva funcionalidad'`).
4. **Empuja** tus cambios al repositorio remoto (`git push origin feature/nueva-funcionalidad`).
5. Abre un **Pull Request**.

## 🔒 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más detalles.

## 📞 Contacto

Para consultas o sugerencias, puedes contactarme en:

- **Email:** javier@flutterchile.com
- **GitHub:** [tu_usuario](https://github.com/jiaas)
- **LinkedIn:** [tu_perfil](https://www.linkedin.com/in/javier-ignacio/)

## 💡 Agradecimientos

- A la comunidad de **Deno** por proporcionar una plataforma moderna y eficiente.
- A los desarrolladores de **Oak** y **dotenv** por sus excelentes herramientas.
- A ti, por interesarte en este proyecto y contribuir a su crecimiento.

---