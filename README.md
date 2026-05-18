# RBAC App (Angular 21 + NgRx)

Role-based access control demo with **Admin**, **Editor**, and **Viewer** roles.

## Features

- **Login** — authenticate existing users
- **Register** — self-service signup (always assigned **Viewer**)
- **User creation** — Admins create users with any role
- **NgRx Store** — auth and users state, effects, selectors, DevTools
- **Guards** — route protection by authentication and permission
- **Directives** — `*appHasPermission` and `*appHasRole` for UI access control

## Role permissions

| Capability      | Admin | Editor | Viewer |
|----------------|:-----:|:------:|:------:|
| Dashboard      | ✓     | ✓      | ✓      |
| View content   | ✓     | ✓      | ✓      |
| Edit content   | ✓     | ✓      | —      |
| Manage users   | ✓     | —      | —      |
| Create users   | ✓     | —      | —      |

## Demo account

- **Email:** `admin@example.com`
- **Password:** `Anil@123`

## Run locally

```bash
cd rbac-app
npm start
```

Open http://localhost:4200

## Build

```bash
npm run build
```

Data is stored in `localStorage` (users and session).
