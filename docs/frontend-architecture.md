# Frontend Architecture Documentation

## Overview

This document outlines the frontend architecture of the Honeycomb Front End Application, a centralized IoT management frontend built for configuring devices, visualizing data, and managing user roles across industrial environments.

> **Note**: In the context of the Honeycomb platform, a **Thing** refers to a device or IoT device, and a **Channel** corresponds to an Asset to which the device sends data.

## Tech Stack

- **Framework**: React with TypeScript
  - React is used for building modular, reusable UI components, while TypeScript provides static typing for safer and more maintainable code.
- **Build Tool**: Vite
  - Vite offers fast development server startup and optimized production builds, supporting hot module replacement for rapid feedback.
- **Package Manager**: Yarn
  - Yarn ensures deterministic dependency management and fast installs, supporting workspaces for monorepo setups.
- **UI Framework**: Metronic Theme
  - Metronic provides a rich set of Bootstrap-based UI components, layouts, and SASS/CSS theming, enabling rapid UI development and consistent design.
- **State Management**: React Context API
  - Used for sharing global state (e.g., authentication, theme) across components without prop drilling.
- **Routing**: React Router
  - Enables declarative, nested, and dynamic routing, supporting route guards and lazy loading.
- **Code Quality**: ESLint
  - Enforces code style and best practices, integrated with Prettier for formatting.

## Routing Flow

The application separates routes into public (unauthenticated) and private (authenticated) flows. Public routes (e.g., login, forgot password) are accessible to all users, while private routes (e.g., dashboard, profile) require authentication and are guarded by token checks.

```mermaid
graph TD
    A[Public Routes] -->|Unauthenticated| B[Login/Forgot Password]
    C[Private Routes] -->|Authenticated| D[Dashboard/Profile]
    B -->|Authentication| C
```

### Implementation Example

```typescript
// filepath: src/routing/AppRoutes.tsx
import { FC } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { Logout, AuthPage, useAuth } from "../modules/auth";
import { DomainPage } from "../modules/domain";
import { App } from "../App";

const { BASE_URL } = import.meta.env;

const AppRoutes: FC = () => {
  const { currentUser } = useAuth();
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />
          {currentUser ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/home" />} />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthPage />} />
              <Route path="domain/*" element={<DomainPage />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
```

## Frontend Data Lifecycle

The data lifecycle covers user actions, component state, API calls, and UI updates. State is managed via hooks and context, with API interactions handled by a centralized Axios client.

```mermaid
graph TD
    A[User Action] -->|Triggers| B[Component]
    B -->|API Call| C[Service Layer]
    C -->|Response| D[State Management]
    D -->|Updates| B
    B -->|Renders| E[UI]
```

### Example: State Management Flow

```typescript
// filepath: src/hooks/useAuth.ts
import { useState } from 'react';
import apiClient from '../api/apiClient';

const useAuth = () => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    setUser(response.data.user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, login, logout };
};

export default useAuth;
```

## Inter-Module Interactions

Modules such as `auth`, `device`, and `history` interact via shared context, hooks, and event-driven updates. For example, authentication state is consumed by device and history modules to control access and personalize charts/alerts.

```mermaid
graph TD
    Auth -->|Token| Device
Device -->|Data| History
History -->|Charts/Alerts| Auth
```

## Coding Standards and Patterns

- **API Layer**: All HTTP requests use a shared Axios instance, configured with interceptors for token injection and error handling.
- **Hooks Pattern**: Custom hooks encapsulate logic for authentication, data fetching, and UI state.
- **Component Structure**: Follows a container/presenter split where appropriate, with reusable UI components in `partials/` and feature logic in `modules/`.

### Example: Axios API Layer

```typescript
// filepath: src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
```

## Performance Optimization Techniques

- **Memoization**: `React.memo` and `useMemo` are used to prevent unnecessary re-renders of heavy components.
- **Lazy Loading**: Large modules (e.g., charts, dashboards) are loaded on demand using React's `lazy` and `Suspense`.

### Example: Lazy Loading

```typescript
// filepath: src/routing/PrivateRoutes.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MasterLayout from '../_metronic/layout/MasterLayout';

const ThingPage = lazy(() => import('../modules/things/ThingPage'));

const PrivateRoutes = () => (
  <Routes>
      <Route element={<MasterLayout />}>
      <Route
          path="things/*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ThingPage />
            </Suspense>
          }
        />
      </Route>
  </Routes>
);

export default PrivateRoutes;
```

## Security Practices

- **Headers**: NGINX or a frontend proxy sets headers like `X-Content-Type-Options: nosniff` and `Strict-Transport-Security` for secure delivery.
- **Input Sanitization**: Libraries such as `DOMPurify` are used to sanitize user input and prevent XSS.
- **Token Storage**: Access and refresh tokens are stored in HTTP-only cookies to mitigate XSS and CSRF risks.
- **CSRF Protection**: CSRF tokens are included in cookies and validated on sensitive requests.
- **Rate Limiting**: API endpoints are protected by rate limiting and device/IP-based controls.

## Token and Session Handling

- **Access/Refresh Tokens**: Short-lived access tokens are used for API calls; refresh tokens are used to obtain new access tokens without re-authentication.
- **Renewal**: Tokens are automatically renewed before expiry using silent refresh mechanisms.
- **Rotation**: Refresh tokens are rotated on each use to reduce replay attack risk.
- **Session Expiry**: Expired tokens trigger logout and redirect to login.
- **CSRF**: All cookie-based authentication is protected by CSRF tokens.

## Testing Strategy

- **Unit Testing**: Components, hooks, and utility functions are tested with Jest and React Testing Library, covering props, state, and rendering logic.
- **Integration Testing**: Tests verify interactions between components, API calls, and state updates.
- **Lint & Prettier**: Code style and formatting are enforced via ESLint and Prettier.

### Example: Unit Test for a Component

```typescript
// filepath: src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button text="Click Me" />);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

## Component Hierarchy Diagrams

Visualizing the component structure helps understand dependencies and data flow:

```mermaid
graph TD
    App --> Header
    App --> Sidebar
    App --> MainContent
    MainContent --> Dashboard
    MainContent --> Profile
```

## Metronic Theme

Metronic is integrated under `src/_metronic/`, providing SASS/CSS overrides, layout components, and reusable UI elements. Layouts (header, sidebar, footer) and partials (modals, dropdowns, notifications) are imported and customized as needed.

## Project Structure

The application follows a well-organized directory structure that promotes modularity and separation of concerns:

```
honeycomb-fe-app/
├── src/
│   ├── _metronic/               # Metronic theme integration
│   │   ├── assets/             # Theme assets (images, styles)
│   │   ├── helpers/            # Theme utility functions
│   │   ├── layout/             # Layout components
│   │   └── partials/           # Reusable UI components
│   │
│   ├── app/                    # Main application code
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication & authorization
│   │   │   ├── channels/     # Channel management
│   │   │   ├── dashboard/    # Dashboard features
│   │   │   ├── domain/       # Domain-specific logic
│   │   │   ├── errors/       # Error handling
│   │   │   ├── groups/       # Group management
│   │   │   ├── histories/    # History tracking
│   │   │   ├── home/         # Home page features
│   │   │   ├── invitations/  # Invitation system
│   │   │   ├── profile/      # User profile
│   │   │   ├── reports/      # Reporting features
│   │   │   ├── things/       # Thing management
│   │   │   ├── stream/       # Stream processing
│   │   │   ├── rule/         # Rule management
│   │   │   ├── notification/ # Notification handling
│   │   │   ├── subscription/ # Subscription management
│   │   │   └── users/        # User management
│   │   │
│   │   ├── pages/           # Page components
│   │   ├── routing/         # Route configurations
│   │   ├── hooks/           # Custom React hooks
│   │   ├── constants/       # Application constants and functions
│   │   └── App.tsx         # Root component
│   │
│   └── main.tsx              # Application entry point
│
├── public/                    # Static assets
│   ├── media/               # Media files
│   └── favicon.ico         # Site favicon
│
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── .eslintrc.cjs             # ESLint configuration
```

### Key Directories Explained

#### 1. Feature Modules (`src/app/modules/`)

Feature modules encapsulate specific functionalities (e.g., auth, dashboard, things). Each module contains its own components, API services, and main page.

##### Structure of a Feature Module

```
module-name/
├── components/     # Module-specific reusable components
├── api/            # API services for the module
└── page.tsx        # Main page component for the module
```

##### Example: `auth/` Module

- **Purpose**: Handles user authentication and authorization.
- **Components**: Login form, forgot password, logout.
- **API Services**: `login`, `logout`, `getUserDetails`.
- **Hooks**: `useAuth` for managing authentication state.
- **Constants**: Role definitions, permission mappings.

##### Example: `dashboard/` Module

- **Purpose**: Provides a customizable dashboard for users.
- **Components**: Widgets, charts, and summary cards.
- **API Services**: Fetching user-specific data and analytics.

#### 2. Core Application (`src/app/`)

The core application directory contains shared resources and configurations that are used across multiple modules.

##### Key Directories

- **`pages/`**: Contains top-level page components, such as the home page, error pages, and layout wrappers.
- **`routing/`**: Defines the application's routing structure, including protected routes and lazy-loaded modules.
- **`hooks/`**: Custom React hooks for shared functionality.
- **`constants/`**: Centralized constants, common functions/methods, and configuration settings.

##### Example: `routing/`

The `routing/` directory organizes routes by feature modules. It includes:

- **`AppRoutes.tsx`**: High-level route definitions.
  - *Public Routes*: Accessible to all users, typically used for login and registration pages.
- **`PrivateRoutes.tsx`**: Guards for authenticated routes.
  - *Protected Routes*: Ensure that only authenticated users can access certain parts of the application.
- **`Page.tsx`**: Module based routing, which loads the appropriate module based on the URL.
  - *Module-Based Routing*: Routes are organized by feature modules, promoting modularity and ease of navigation.
- **`Lazy Loading`**: Lazy loading of modules for performance optimization.

##### Example: `hooks/`

Custom hooks encapsulate reusable logic. For example:

- **`useAuth.ts`**: Provides authentication state and helper methods.
- **`useLayout.ts`**: Manages layout-related state, such as sidebar visibility.

#### 3. Theme Integration (`src/_metronic/`)

The `_metronic/` directory integrates the Metronic theme into the application. It includes assets, layout components, and reusable UI elements.

##### Key Directories

- **`assets/`**: Contains theme assets, such as images, fonts, and styles.
- **`helpers/`**: Utility functions for common tasks, such as formatting dates and managing themes.
- **`layout/`**: Defines the application's layout, including the header, sidebar, and footer.
- **`partials/`**: Reusable UI components, such as modals, dropdowns, and notifications.

##### Example: `layout/`

The `layout/` directory manages the application's layout. It includes:

- **`Header.tsx`**: The top navigation bar.
- **`Sidebar.tsx`**: The main sidebar menu.
- **`Footer.tsx`**: The footer section.

##### Example: `partials/`

The `partials/` directory contains reusable components, such as:

- **`ThemeModeSwitcher.tsx`**: Allows users to toggle between light and dark themes.
- **`HeaderUserMenu.tsx`**: Displays the user menu in the header.

#### 4. Configuration Files

The root directory contains configuration files for the build process, TypeScript, and code quality.

##### Key Files

- **`vite.config.ts`**: Configures the Vite build tool, including plugins, aliases, and environment variables.
- **`tsconfig.json`**: Defines TypeScript compiler options, such as strict mode and path aliases.
- **`.eslintrc.cjs`**: Configures ESLint for enforcing code quality and style rules.
- **`package.json`**: Lists project dependencies and scripts for development and production.

##### Example: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
```

##### Example: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    /* Linting */
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    /* Strict */
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": false,
    "noImplicitOverride": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

##### Example: `.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "off",
  },
};
```

### Data Flow

```mermaid
graph TD
    A[User Interface] -->|Action| B[Component]
    B -->|State Update| C[Context/Store]
    C -->|Data| D[API Service]
    D -->|Response| C
    C -->|Update| B
    B -->|Render| A
```

### Component Communication Patterns

- **Prop Drilling**: Passing data through component trees via props.
- **Context API**: Provides a way to share values between components without passing props explicitly.
- **Custom Hooks**: Encapsulate logic and state management, offering reusable functionality across components.

### Functions and Implementations

The application is designed to be modular, with each feature encapsulated within its own directory. This structure allows for easy navigation and understanding of the codebase.

![alt text](Rapid.drawio.png)

The following sections outline the key features and functionalities of the application, organized by module.

1. **Authentication (`auth/`)**

   - Login/Logout functionality
   - ![alt text](image.png)
   - Authorization management
   - ![alt text](image-1.png)
   - User session handling
   - ![alt text](image-2.png)

2. **Home (`home/`)**

   - Home page layout: Provides the main landing page for users, displaying key information and navigation options.
   - ![alt text](image-3.png)
   - Analytics displays: Showcases various analytics and data visualizations to provide insights into user activity and system performance.

3. **Dashboard (`dashboard/`)**
   - A visual interface providing an overview of data through customizable widgets, including graphs, pie charts, and line graphs. It enables real-time sensor data visualization, with sensor selection based on associated assets and devices.

   - Dashboard creation: Allows users to create personalized dashboards tailored to their needs.
   - ![alt text](image-4.png)
   - Widget configuration: Users can add, remove, and configure widgets to display specific data points.
   - ![alt text](image-44.png)
   - Data visualization: Offers a range of visualization tools to represent data in an easily digestible format.
   - ![alt text](image-45.png)
   - Summary views: Provides summary statistics and overviews for quick access to important metrics.

4. **User Management (`users/`)**
   - Individuals within the organization, each assigned specific roles and permissions. Users can be enabled or disabled through selection and filters, which allow retrieval of active and inactive users. Disabled users can be reactivated when needed.

   - User CRUD operations: Supports creating, reading, updating, and deleting user accounts.
   - ![alt text](image-42.png)
   - ![alt text](image-46.png)
   - User permissions: Manages user roles and permissions to ensure appropriate access levels.
   - ![alt text](image-48.png)
   - Profile management: Allows users to update personal information and manage their profiles.
   - ![alt text](image-47.png)

5. **Invitation System (`invitations/`)**
   - A process that allows a user to join a organization by receiving an invite from an administrator. The user must log in, accept or reject the invitation, and then access their assigned domain with the designated role.

   - Invitation creation and management: Facilitates sending and managing invitations to new users.
   - ![alt text](image-49.png)
   - User acceptance: Tracks and manages the acceptance of invitations by users.
   - ![alt text](image-50.png)

6. **Domain Management (`domain/`)**
   - The top-level entity managing user access, asset groups, assets, and devices. Users can view and retrieve organizations by ID, see a list of accessible organizations and their members, create new organizations, and view user profiles with default avatars based on name initials and email identity.

   - Domain creation and management: Enables the creation and management of domains within the application.
   - ![alt text](image-51.png)
   - Organization structure: Defines the hierarchical structure of domains within the application.
   - ![alt text](image-52.png)

7. **Profile (`profile/`)**

   - User profile management: Allows users to update their personal information and manage their profiles.
   - ![alt text](image-9.png)
   - Change password: Enables users to change their passwords for enhanced security.
   - ![alt text](image-14.png)

8. **Group Management (`groups/`)**
   - An administrative unit that organizes assets, subgroups, and devices. Each asset group contains only one asset and serves as a parent group for asset hierarchy. Users can create, update, delete, and assign assets to groups using filters. Assets and asset groups are displayed together, differentiated by parent IDs. Timestamp tracking indicates creation time.

   - Group creation and management: Facilitates the creation and management of asset groups.
   - ![alt text](image-56.png)
   - ![alt text](image-57.png)
   - Channel assignment: Allows for the assignment of channels to groups for better organization.
   - Member administration: Manages group members, including adding and removing users.
   - ![alt text](image-58.png)

9. **Channel Management (`channels/`)**
    - A core functional unit within an asset group, responsible for executing tasks, storing data, and managing operations. Each asset belongs to only one asset group but can connect to multiple devices. Users can filter assets by status, view creation timestamps, connect/disconnect devices, assign/unassign groups, and disable assets.

   - Channel creation and configuration: Enables the creation and configuration of communication channels.
   - ![alt text](image-53.png)
   - ![alt text](image-54.png)
   - Thing assignment: Allows for the assignment of things to channels for effective management.
   - Group assignment: Facilitates the organization of asset groups.
   - Member management: Manages group members, including adding and removing users.
   - ![alt text](image-55.png)

10. **Thing Management (`things/`)**
    - A fundamental entity linked to multiple assets, representing physical or virtual components. Users can filter devices by status (enabled/disabled), view creation timestamps, edit metadata, identity, and tags, disable devices, or delete them permanently.

    - Thing creation and management: Facilitates the creation and management of things within the domain.
    - ![alt text](image-43.png)
    - ![alt text](image-59.png)
    - ![alt text](image-60.png)
    - Channel assignment: Allows for the assignment of channels to things for better organization.
    - ![alt text](image-61.png)

11. **History Tracking (`histories/`)**

    - Activity logging: Device activity logging for tracking changes and events.
    - ![alt text](image-26.png)
    - Data export: Exporting history data for analysis.
    - Analytics: Provides insights into historical data trends.

**Rule Engine (EdgeX) functions**
Rule Engine integrating with the EdgeX API for managing devices and creating rules using the Rule Engine. The workflow includes user creation, authentication, device management, and rule creation.

12. **Stream (`stream/`)**

    - Stream creation and management: Facilitates the creation and management of streams within the application.
    - ![alt text](image-62.png)
    - ![alt text](image-63.png)

13. **Rule (`rule/`)**

    - Rule creation and management: Enables the creation and management of rules within the application.
    - ![alt text](image-64.png)
    - ![alt text](image-65.png)

14. **Notification (`notification/`)**

    - Display notifications: Manages and displays notifications to users.
    - ![alt text](image-66.png)
  
15. **Subscription (`subscription/`)**

    - Subscription management: Handles the management of user subscriptions.
    - ![alt text](image-67.png)
    - ![alt text](image-68.png)

**LoRa functions**
LoRa integration with the ChirpStack API enables the management of device profiles, applications, and gateways. The workflow involves handling application management, as well as creating and configuring devices and gateways.

1.  **Device Profiles (`device-profiles/`)**
    
    - Device profile creation and management: Facilitates the creation and management of device profiles within the application.
    - ![alt text](image-69.png)
    - ![alt text](image-70.png)
    
2.  **Gateway (`gateway/`)**
    
    - Gateway creation and configuration: Enables the creation and configuration of gateways within the application.
    - ![alt text](image-71.png)
    - ![alt text](image-72.png)
    
3.  **Application (`application/`)**
    
    - Application creation and device configuration: Facilitates the creation and configuration of applications and their associated devices.
    - ![alt text](image-73.png)
    - ![alt text](image-74.png)
    - ![alt text](image-75.png)


This modular structure enables:

- Independent feature development
- Clear separation of concerns
- Easy maintenance and testing
- Scalable architecture
- Code reusability

### Testing Strategy

- **Unit Testing**: Utilizes Jest and React Testing Library for component and logic testing.
- **Lint & Prettier**: Enforced via ESLint and Prettier, with configurations specified in `.eslintrc.cjs`.

### Vite Build Output

The Vite build process generates optimized static assets for deployment, including JavaScript bundles, CSS files, and other resources.

## Useful Resources

### Official Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Metronic Theme](https://preview.keenthemes.com/metronic8/demo1/documentation/)
- [React Router Documentation](https://reactrouter.com/en/main)
- [React Table Documentation](https://react-table.tanstack.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Bootstrap Typeahead](https://react-bootstrap-typeahead.js.org/)
- [Tanstack/React Query](https://tanstack.com/query/v4/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [ApexCharts Documentation](https://apexcharts.com/docs/react-charts/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Yup Documentation](https://github.com/jquense/yup)
- [Formik Documentation](https://formik.org/)
- [Moment Documentation](https://momentjs.com/)
- [Yarn Documentation](https://classic.yarnpkg.com/lang/en/docs/cli/)
