# Attachments Module

This module has been refactored for better maintainability and code organization.

## Structure

```
attachments/
├── components/           # Reusable UI components
│   ├── AttachmentHeader.tsx      # File header with actions
│   ├── AttachmentTimeline.tsx    # Document activity timeline
│   ├── DeleteConfirmModal.tsx    # Delete confirmation dialog
│   ├── RemarksDrawer.tsx         # Remarks sidebar panel
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── useAttachmentData.ts      # Fetch and manage attachment data
│   ├── useAttachmentActions.ts   # Handle user actions (delete, edit, download)
│   ├── useRemarksCount.ts        # Fetch remarks count
│   └── index.ts
├── modals/              # Modal dialogs
│   ├── EditAttachmentModal.tsx   # Edit attachment name/folder
│   └── index.ts
└── AttachmentPageClient.tsx      # Main page component (158 lines, was 577)
```

## Key Improvements

### Before Refactoring
- **577 lines** in single file
- 15+ useState calls
- Complex nested logic
- Hard to test and maintain
- Duplicate code patterns

### After Refactoring
- **158 lines** in main file (73% reduction)
- Separated concerns
- Reusable components
- Custom hooks for logic
- Easier to test and modify

## AttachmentPageClient
- Entry point that renders `AppLayout` + `Breadcrumb`, seeds the authenticated user, and wires the attachment lifecycle together.
- Uses the three custom hooks to fetch the data, refresh on edit, download/delete files, and keep the remark count current.
- Renders loaders, error states, and the core UI (`AttachmentHeader`, `AttachmentTimeline`) while also mounting `EditAttachmentModal`, `DeleteConfirmModal`, and `RemarksDrawer` with the hook callbacks that drive their visibility.

## Components

### AttachmentHeader
Displays file information, action buttons (Download, Edit, Delete), and metadata card with last updated date and remarks count.

**Props:**
- `attachment` - Attachment data
- `remarksCount` - Number of remarks
- `onDownload` - Download handler
- `onEdit` - Edit handler
- `onDelete` - Delete handler
- `onOpenRemarks` - Open remarks drawer handler

Includes the metadata card with a dashed border that highlights the latest update, shares info, and a remarks CTA that toggles the drawer with proper singular/plural wording.

### AttachmentTimeline
Shows document activity history in a table format.

**Props:**
- `logs` - Array of attachment logs

Handles empty history gracefully and formats each row with user initials, formatted timestamps, and human-friendly action labels via the shared date utilities.

### DeleteConfirmModal
Confirmation dialog for deleting attachments.

**Props:**
- `isOpen` - Modal visibility
- `isDeleting` - Loading state
- `onClose` - Close handler
- `onConfirm` - Delete confirmation handler

### RemarksDrawer
Slide-out panel for viewing and adding remarks with pagination.

**Props:**
- `isOpen` - Drawer visibility
- `onClose` - Close handler
- `attachmentId` - Attachment ID
- `attachment` - Attachment data

Fetches paginated remarks when opened, surfaces loading/empty/error states, and exposes pagination controls plus the `RemarkModal` trigger so new remarks refresh the list immediately.

## Modals

### EditAttachmentModal
Modal for renaming or moving attachments without leaving the page.

**Props:**
- `attachment` - Attachment payload
- `isOpen` - Modal visibility
- `onClose` - Close handler
- `onSuccess` - Optional success callback

Tracks the local name and folder inputs, validates that a name is provided, sends only changed fields to `updateAttachment`, and resets values when the modal closes. Success/error toasts keep the user informed while the submitting state disables inputs and shows a spinner.

## Hooks

### useAttachmentData
Manages attachment data fetching and state.

**Returns:**
- `attachment` - Current attachment
- `setAttachment` - Update attachment
- `logs` - Activity logs
- `isLoading` - Loading state
- `errorMessage` - Error message

Prefers `initialDetail`, avoids re-fetching when the request already ran, cancels inflight requests via `AbortController`, and shows error toasts so the layout can stay consistent even when the API fails.

### useAttachmentActions
Handles user actions (download, delete, edit).

**Returns:**
- `showDeleteModal`, `setShowDeleteModal`
- `showEditModal`, `setShowEditModal`
- `isDeleting`
- `handleOpenFile` - Download handler
- `handleDelete` - Delete handler
- `handleEditSuccess` - Edit success callback

`handleDelete` performs the API call, shows success/error toasts, and navigates to `/`. `handleEditSuccess` forces a route refresh only if the folder changes, keeping the current attachment updated locally otherwise.

### useRemarksCount
Fetches the total remarks count for an attachment.

**Returns:**
- `number` - Remarks count

Performs a lightweight `fetchAttachmentRemarks` call (1 item per page) so the badge stays current without loading the full remark list.

## Utilities

Utility functions are located in `/src/utils/`:

- `formatDate(value)` - Format date (e.g., "09 Dec, 2025")
- `formatDateTime(value)` - Format date with time
- `formatAction(action)` - Format activity action labels
- `getBreadcrumbFromPath(path)` - Generate breadcrumb from path
- `getFolderPath(path)` - Extract folder path string

## Usage Example

```typescript
import { AttachmentPageClient } from "@/modules/attachments";

<AttachmentPageClient
  attachmentId={123}
  initialDetail={preloadedData}
  initialUser={currentUser}
/>
```

## Testing

Each component and hook can now be tested independently:

```typescript
import { AttachmentHeader } from "@/modules/attachments/components";
import { useAttachmentData } from "@/modules/attachments/hooks";

// Test component
test("AttachmentHeader renders correctly", () => {
  // ...
});

// Test hook
test("useAttachmentData fetches data", () => {
  // ...
});
```

## Future Improvements

- Add unit tests for components and hooks
- Implement error boundaries
- Add loading skeletons
- Optimize re-renders with React.memo
- Add accessibility improvements

## GitHub Setup
1. **Fork/clone the repo:** create a fork if needed, then run `git clone git@github.com:<your-github>/vistra-fe.git && cd vistra-fe`.
2. **Create a working branch:** `git checkout -b feature/<short-description>` so your work stays isolated from `main`.
3. **Install deps & env:** run `npm install`, then copy the example env (`cp .env.example .env`) and update `NEXT_PUBLIC_API_BASE_URL` plus any other service keys you need.
4. **Focus on the attachments module:** work inside `src/modules/attachments`; keep the README and hooks/docs in sync with any UI or API changes you make.
5. **Run locally & test:** use `npm run dev` to verify the app and `npm run lint` before committing.
6. **Push & open a PR:** `git push --set-upstream origin feature/<short-description>`, then open a GitHub Pull Request describing your changes and tests.
