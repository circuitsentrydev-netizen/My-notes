# React Native Notes Application (TypeScript)

Secure note-taking app built with **Expo + TypeScript + React Navigation + AsyncStorage**.

## Features

### User Management
- Register with email, username and password
- Login with credentials
- Protected routing (logged-in users cannot see Login/Register)
- Profile screen to update email / username / password

### Notes Management
- **Categories**: Work, Study, Personal (separate tab pages) + All Notes
- **CRUD**: Create, Read, Update, Delete notes
- Optional title, required content, category, automatic `dateAdded`
- `dateUpdated` timestamp on edit
- Search across note content and title
- Sort by date added (ascending / descending)

### Technical
- TypeScript throughout
- AsyncStorage as local database
- React Navigation (native stack + bottom tabs)
- Context API for auth and notes state

## Setup (Codespaces / Local)

```bash
# Install dependencies
npm install

# Start the app
npx expo start
```

## Project Structure

```
src/
├── types/
├── context/          # AuthContext + NotesContext
├── navigation/       # Auth + App + Root navigators
├── screens/          # Login, Register, Notes, AddEdit, Profile
└── utils/            # AsyncStorage helpers
```

## Notes for Marker

- Navigation system: Bottom Tabs for categories + Stack for Add/Edit
- Protected routes implemented via RootNavigator conditional rendering
- All data persists with AsyncStorage
- Full CRUD + Search + Sort implemented
