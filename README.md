# ElectroStore — Frontend Angular (T2 · Soluciones Web)

Proyecto **`fe-ecommerce-ChungaRobert`** para la **Parte 2** de la evaluación SW-AD. Está basado en el ejemplo `sistemas-ventas-v1310.zip` y en las guías de login/CRUD/JWT e integración FE-BE, pero ajustado al backend real `be_eccomerce_ChungaRobert.zip`.

**Nombre oficial del proyecto:** `fe-ecommerce-ChungaRobert`. La carpeta, el identificador de proyecto en `angular.json` y el repositorio usan esa escritura. En `package.json` y `package-lock.json`, el nombre interno de paquete se mantiene en minúsculas (`fe-ecommerce-chungarobert`) porque npm no admite mayúsculas en los nombres de paquetes. No cambia el nombre visible del proyecto ni la funcionalidad.

## 1. Requisitos cumplidos por el código

- Proyecto Angular standalone con nombre `fe-ecommerce-ChungaRobert`.
- Capas `core`, `models` y `pages`; dentro de `core`, `guards`, `interceptors` y `services`.
- Login con `POST /api/auth/login` y token JWT.
- Protección de rutas con `authGuard`.
- `authInterceptor` agrega `Authorization: Bearer <token>` exclusivamente a los endpoints del backend y cierra la sesión ante respuestas 401 de rutas protegidas.
- CRUD de productos `GET`, `POST`, `PUT`, `DELETE` con validaciones, tabla, búsqueda, filtro, paginación en cliente y confirmación para eliminar.
- Los seis campos de producto exigidos por la entidad backend: `nombre`, `categoria`, `precio`, `stock`, `marca`, `codigoBarras`. `id` se genera en MySQL.
- Diseño responsive para escritorio y móvil, con Sidebar que contiene **Productos** y **Cerrar sesión**.
- Indicaciones de GitHub y vídeo al final. **El repositorio y el vídeo deben realizarse desde tu equipo; no se han publicado ni grabado.**

## 2. Requisitos previos

- **Node.js v22.22.3 o superior compatible con Angular 22**, o v24.15.0 o superior. Verifica con `node -v`. Una versión v22.16.0 NO es suficiente para la versión de Angular que traía el ZIP de clase.
- Node y npm instalados; MySQL operativo.
- Tu backend Spring Boot corriendo en `http://localhost:8080`.
- CORS del backend que permita `http://localhost:4200`, como ya indica `application.properties` del backend adjunto.
- La base de datos y un usuario con BCrypt válidos para Spring Security.

## 3. Arrancar el frontend

Desde la carpeta descomprimida del proyecto:

```bash
npm install
npm start
```

Abrir `http://localhost:4200` en el navegador. Se redirige a `/login`.

> **No subas `node_modules` a GitHub.** El ZIP del proyecto está preparado sin `node_modules`, con `package.json` y `package-lock.json`.

## 4. Verificar la conexión con el backend

Configuración centralizada: `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

| Operación | Método | Endpoint |
|---|---|---|
| Login | POST | `/api/auth/login` |
| Listar productos | GET | `/api/productos` |
| Obtener producto | GET | `/api/productos/{id}` |
| Crear producto | POST | `/api/productos` |
| Editar producto | PUT | `/api/productos/{id}` |
| Eliminar producto | DELETE | `/api/productos/{id}` |

Payload válido para crear producto:

```json
{
  "nombre": "Mouse Logitech G502",
  "categoria": "Accesorios",
  "precio": 199.90,
  "stock": 12,
  "marca": "Logitech",
  "codigoBarras": "7500000001025"
}
```

**Importante:** el `codigoBarras` debe ser único. La tabla `productos` original del `.txt` tiene solo cinco columnas; el backend actual espera además `marca` y `codigo_barras`. Si tu esquema actual no tiene esas columnas, debes adecuarlo **en MySQL** antes de probar el CRUD; el código Angular no puede cambiar la base de datos.

## 5. Arquitectura

```text
src/
├── environments/
│   └── environment.ts
└── app/
    ├── core/
    │   ├── guards/auth.guard.ts
    │   ├── interceptors/auth.interceptor.ts
    │   └── services/
    │       ├── auth.service.ts
    │       └── producto.service.ts
    ├── models/producto.model.ts
    ├── pages/
    │   ├── login/
    │   ├── productos/
    │   └── producto-form/
    ├── layout/
    │   ├── layout.ts
    │   ├── layout.html
    │   └── layout.css
    ├── app.config.ts
    ├── app.routes.ts
    └── app.ts
```

Flujo: **Componentes → Services → HttpClient → AuthInterceptor → API REST Spring Boot → MySQL**.

**Detalle del JWT:** el backend `AuthResponseDTO` devuelve `{ "token": "...", "type": "Bearer" }`. No utiliza `accessToken`. El frontend guarda el token y lo añade a las peticiones a la API. En una sesión real, la autorización definitiva siempre la realiza el backend; el guard de Angular es un mecanismo de navegación, no una frontera de seguridad.

## 6. Cómo demostrar el requisito de usuario con tu nombre

La evidencia de la Parte 2 solicita un vídeo **con un usuario con tu nombre**. El frontend muestra el nombre de usuario autenticado en el Sidebar.

En MySQL debe existir previamente un usuario con un nombre identificable, por ejemplo `RobertChunga`, con una contraseña **BCrypt** válida y un rol asociado en las tablas `usuarios`, `roles`, `usuarios_roles`. El `.txt` solo incluye inicialmente `admin` y `carlos`, por lo que **no puede presumirse que `RobertChunga` ya existe**. No pongas una contraseña plana en la tabla ni en el código Angular. Crea o modifica la cuenta de demostración en tu base local antes de grabar.

## 7. GitHub: repositorio independiente + mínimo dos commits

Crear un repositorio GitHub **separado del backend**, por ejemplo `fe-ecommerce-ChungaRobert`. Desde el proyecto:

```bash
git init
git branch -M main
git add .
git commit -m "Primer avance: arquitectura Angular y autenticacion JWT"
git remote add origin https://github.com/TU_USUARIO/fe-ecommerce-ChungaRobert.git
git push -u origin main
```

Después de realizar **un cambio real** (por ejemplo, mejorar un estilo o una validación):

```bash
git add .
git commit -m "Segundo avance: CRUD y diseno responsive"
git push origin main
git log --oneline
```

**No crees dos commits idénticos solo por cumplir el número.** Si publicas el proyecto completamente terminado de una vez, el primer commit puede contener la estructura inicial y el segundo una mejora verificable. `git log --oneline` permite demostrar ambos.

## 8. Lista de evidencias para el vídeo (6 puntos)

Grabar con **el usuario con tu nombre** y mostrar:

1. Inicio de sesión exitoso con el backend funcionando.
2. Pantalla de Productos y Sidebar; mostrar el username y la opción Cerrar sesión.
3. Listado actual de productos que provenga de MySQL.
4. Crear un producto real; comprobar que aparece en la tabla.
5. Editarlo; comprobar que se guardan los cambios.
6. Eliminarlo; confirmar que desaparece, salvo restricciones por pedidos.
7. Reducir el ancho de la ventana para mostrar el responsive y el menú móvil.
8. Cerrar sesión y demostrar que `/productos` redirige al login sin token.
9. En F12 → Network, mostrar `Authorization: Bearer ...` en una petición protegida (ocultar el token completo si compartes el vídeo públicamente).
10. Mostrar el repositorio GitHub de frontend separado del backend y `git log --oneline` con al menos 2 commits.

## 9. Consideraciones y límites de la prueba

- El proyecto se compiló correctamente en modo de producción durante su preparación, **pero no se probó con tu MySQL ni con el backend ejecutándose**, porque el sistema y la base reales no están disponibles en este entorno.
- Si la eliminación arroja un error, puede ser por la FK de `detalle_pedido`; prueba con un producto nuevo que no esté vinculado a pedidos.
- Si la API está en otro host/puerto, actualiza `environment.ts` y CORS del backend.
- El módulo **Pedidos** de la segunda guía es adicional; la Parte 2 de SW-AD exige prioritariamente el **CRUD de productos**.
- Por simplicidad académica, la guía almacena JWT en `localStorage`. Para aplicaciones públicas en producción conviene revisar controles adicionales contra XSS, expiración y estrategia de sesión.


## Corrección responsive (11/11/2026)

Se corrigió el layout en móviles (320–720 px): el botón de menú ya no ocupa una columna propia dentro del contenedor flex, la zona principal usa todo el ancho disponible y la cabecera no provoca desbordamiento en pantallas de 320 px. Para ver el cambio en un proyecto instalado, reemplazar `src/app/layout/layout.css` por la versión de este ZIP y reiniciar `npm start` si fuera necesario.
