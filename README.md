# Electrical Installation Documentation Viewer

A responsive web application for accessing electrical installation documentation for residential buildings. The application provides an organized interface to view and download various types of documentation including switchboard layouts, wiring diagrams, cable routing, schedules, and installation photos.

## Features

- Responsive design that works on both desktop and mobile devices
- Organized categories for different types of documentation
- PDF viewer for technical documents
- Photo gallery for installation photos
- Firebase integration for file storage
- Material-UI components for a modern look and feel

## Categories

The documentation is organized into the following categories:
- Switchboard Layout (swl)
- Wiring Diagram (wid)
- Cable Routing (car)
- Cable Schedule (cas)
- Protection Schedule (prs)
- Installation Zones (inz)
- Photos (img)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable Storage:
   - Go to the Firebase Console
   - Create a new project
   - Enable Storage
   - Create the following folders in Storage:
     - swl (Switchboard Layout)
     - wid (Wiring Diagram)
     - car (Cable Routing)
     - cas (Cable Schedule)
     - prs (Protection Schedule)
     - inz (Installation Zones)
     - img (Photos)

4. Configure Firebase:
   - Go to the Firebase Console
   - Create a new project
   - Enable Storage
   - Create the following folders in Storage:
     - swl (Switchboard Layout)
     - wid (Wiring Diagram)
     - car (Cable Routing)
     - cas (Cable Schedule)
     - prs (Protection Schedule)
     - inz (Installation Zones)
     - img (Photos)
   - Copy your Firebase configuration from the Firebase Console
   - Copy `src/config/firebase.ts.example` to `src/config/firebase.ts`
   - Update the `firebaseConfig` object in `src/config/firebase.ts` with your configuration values

5. Start the development server:
```bash
npm run dev
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- React
- TypeScript
- Vite
- Material-UI
- Firebase
- React Router
- React Photo Gallery
- React Photo View

## Project Structure

```
src/
├── components/
│   ├── CategoryCard.tsx
│   ├── FileList.tsx
│   └── PhotoGallery.tsx
├── config/
│   └── firebase.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
