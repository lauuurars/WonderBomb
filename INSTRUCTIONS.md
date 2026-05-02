# Pre-Parcial Práctico — WonderBomb

**Tiempo:** 2 horas | **Individual** 

---

## Contexto

La empresa **BoomStudios** lo ha contratado para desarrollar el backend y parte del frontend de **WonderBomb**, un minijuego multijugador en tiempo real para dispositivos móviles.

La mecánica es la siguiente: al conectarse, cada jugador recibe una bola en el canvas compartido. Entre más fuerte agite su teléfono, más crece su bola. La primera bola en alcanzar el tamaño máximo explota, y ese jugador gana.

Su trabajo es implementar la autenticación, la comunicación en tiempo real mediante sockets, y la integración con el sensor de movimiento del dispositivo. La lógica visual (renderizado de bolas, animación de explosión) ya está resuelta en el scaffolding entregado.

---

## Scaffolding entregado

Descargue el repositorio de inicio y analícelo antes de comenzar.

**Backend (Express + TypeScript)**
- Servidor HTTP funcional con CORS y body parser configurados.
- `POST /auth/signup` implementado y funcionando.
- Carpeta `/auth` con el endpoint de login vacío y el router registrado en `main.ts`.
- Middleware de autenticación implementado en su propio archivo, pero **no aplicado** a ninguna ruta.
- Socket.IO instalado como dependencia, sin configurar.
- Módulo de juego que expone métodos para registrar jugadores, actualizar el tamaño de sus bolas y consultar el estado actual. Usted invoca estos métodos desde sus eventos.

**Frontend (React + TypeScript)**
- Aplicación que levanta correctamente.
- React Router configurado con rutas `/login`, `/signup` y `/game`.
- Página y lógica de `/signup` completamente implementadas.
- `AuthContext` montado sin lógica interna.
- Utilidad de `localStorage` (`saveTokens` / `getTokens`) implementada, lista para usar.
- Componente `Login` con formulario de UI, sin lógica.
- Componente `Game` con canvas funcional que expone el método `crecerBola(magnitude)` y escucha el evento `game-update` para renderizar el estado de todas las bolas. **No debe modificar este componente internamente.**

---

## Requerimientos

### REQ 1 — Autenticación (Backend)

**R1.1** `POST /auth/login`
- Recibe: `{ email, password }`
- Autentica al usuario con Supabase.
- Devuelve: `{ accessToken }`

**R1.2** Aplicar middleware
- El middleware de autenticación ya existe. Aplíquelo a las rutas de game del servidor.

---

### REQ 2 — Autenticación (Frontend)

**R2.1** `AuthContext`
- Al hacer login exitoso, guarde el `accessToken` en el estado del contexto y en `localStorage` usando la utilidad provista, para que la sesión sobreviva recargas.

**R2.2** Lógica de login
- El formulario de login debe llamar al endpoint R1.1, guardar el token en el contexto y redirigir a el juego.

**R2.3** Ruta protegida
- La ruta `/game` debe ser privada: si no hay `accessToken` en el contexto, redirigir automáticamente a `/login`.
- Las rutas `/login` y `/signup` deben redirigir a `/game` si el usuario ya está autenticado.

---

### REQ 3 — Sockets (Backend)

**R3.1** Configuración
- Adjunte Socket.IO al servidor HTTP de Express en el puerto existente. Configure el path y el CORS.

**R3.2** Conexión
- Al conectarse un cliente, el servidor lo registra con una bola de tamaño inicial y emite `game-update` a todos con el estado completo del juego.

**R3.3** Evento: `shake` _(cliente → servidor)_
- Payload: `{ magnitude }`
- El servidor aumenta el tamaño de la bola del jugador usando el módulo de juego y emite `game-update` a todos con el nuevo estado.

**R3.4** Detección de explosión
- Luego de actualizar el tamaño, si la bola del jugador alcanzó el tamaño máximo, el servidor emite `game-over` a todos con `{ winner: socket.id }`.

**R3.5** Desconexión
- Al desconectarse un cliente, el servidor lo elimina del estado y emite `game-update` con el estado actualizado.

---

### REQ 4 — Sensor + Sockets (Frontend)

**R4.1** Activación del acelerómetro
- La pantalla `/game` incluye un botón para activar el sensor. Al presionarlo, solicite permiso al usuario manejando correctamente la diferencia entre iOS y Android según lo visto en clase.

**R4.2** Cálculo de magnitud
- En cada evento del acelerómetro, calcule la magnitud del movimiento con la siguiente fórmula:

  ```
  magnitude = |x| + |y| + |z|
  ```

**R4.3** Crecimiento local y emisión
- Con la magnitud calculada, llame a `crecerBola(magnitude)` y emita el evento `shake` al servidor con `{ magnitude }`.

**R4.4** Escuchar `game-over`
- Compare el `winner` recibido con el `socket.id` propio para mostrar "¡Ganaste!" o "¡Perdiste!" según corresponda.

**R4.5** Conexión al servidor
- Al montar la pantalla `/game`, conéctese al servidor de Socket.IO.
- Al desmontar la pantalla, desconecte el socket.

---

## Eventos de socket — resumen

| Nombre | Dirección | Payload |
|---|---|---|
| `shake` | cliente → servidor | `{ magnitude }` |
| `game-update` | servidor → todos | `{ players: [{ id, size }] }` |
| `game-over` | servidor → todos | `{ winner: id }` |

---

## Rúbrica de calificación

| Criterio | % |
|---|---|
| R1 — Auth backend (login, aplicar middleware) | 15% |
| R2 — Auth frontend (contexto, login, ruta privada) | 15% |
| R3 — Socket.IO backend (setup + eventos + estado) | 35% |
| R4 — Acelerómetro + integración socket en cliente | 25% |
| Patrones vistos en clase aplicados correctamente | 10% |
| **Total** | **100%** |
