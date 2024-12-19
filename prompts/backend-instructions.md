# Backend Instructions

Follow these instructions to create new backend actions.

## Guidelines

- Always use the hooks from @/hooks/use-toast to show toasts.

### Project Structure

- The actions folder is at the root of the project.
- Please put all actions that you create in the actions folder.
- Do not create any new actions folders, just use the existing one.
- Please group similar actions in the same folder within the actions folder.
- All types are going to come from the table schema found in the `db/schema` files

### Server Components

- Please use server actions to fetch data and pass the data to the client components.

### Client Components

- Client components need 'use client' at the top of the file. So anytime you use useState, useEffect, useContext, useRef, etc. you need to use 'use client' at the top of the file.
- Always use client components for user interaction and other client-specific logic.