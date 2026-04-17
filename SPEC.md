# Borker - Broker Management System

## 1. Concept & Vision

Borker is a sleek, efficient property broker management dashboard that feels like a premium CRM tool. The aesthetic draws from modern fintech apps—dark mode by default with crisp data visualization, smooth micro-interactions, and a professional feel that instills confidence. It's designed for brokers who value speed and clarity over complexity.

## 2. Design Language

### Aesthetic Direction
Dark, professional fintech aesthetic with teal accent colors. Clean data presentation with subtle depth through shadows and gradients. Card-based layout with clear hierarchy.

### Color Palette
- **Background Primary**: `#0f1419` (deep charcoal)
- **Background Secondary**: `#1a2332` (card surfaces)
- **Background Tertiary**: `#243447` (hover states, inputs)
- **Accent Primary**: `#14b8a6` (teal - actions, highlights)
- **Accent Secondary**: `#0d9488` (darker teal - hover)
- **Text Primary**: `#f1f5f9` (headings, important text)
- **Text Secondary**: `#94a3b8` (body text, labels)
- **Text Muted**: `#64748b` (placeholders, hints)
- **Success**: `#22c55e` (deal closed, positive)
- **Warning**: `#f59e0b` (hot leads, attention)
- **Danger**: `#ef4444` (cancelled, delete)
- **Info**: `#3b82f6` (new inquiries)

### Typography
- **Headings**: Inter, 600-700 weight
- **Body**: Inter, 400-500 weight
- **Monospace (numbers)**: JetBrains Mono
- **Scale**: 12px (small), 14px (body), 16px (subheading), 20px (section), 28px (page title)

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Card padding: 24px

### Motion Philosophy
- **Transitions**: 200ms ease-out for hover states
- **Page transitions**: Fade-in 300ms with slight upward translate
- **Modal entrance**: Scale from 0.95 + fade, 250ms
- **Staggered lists**: 50ms delay between items on load
- **Micro-interactions**: Subtle scale (1.02) on card hover

### Visual Assets
- **Icons**: Lucide Icons (consistent 24px stroke width 1.5)
- **Charts**: CSS-based progress bars and stat cards
- **Empty states**: Minimal illustrations with muted icons
- **Avatars**: Initials-based with gradient backgrounds

## 3. Layout & Structure

### Overall Architecture
Single-page application with client-side routing. Three-column layout:
1. **Sidebar** (240px fixed): Navigation, logo, user menu
2. **Main Content** (fluid): Dynamic content area
3. **Optional Right Panel** (320px): Context-sensitive details (collapsible on mobile)

### Page Structure

#### Dashboard (Home)
- Top row: 4 stat cards (Total Inquiries, Hot Leads, Properties, Pending Reminders)
- Middle: Two-column grid
  - Left: Recent activity feed + reminder panel
  - Right: Inquiry status breakdown + quick actions
- Bottom: Recent properties carousel

#### Inquiries
- Filter bar: Status tabs + search + add button
- Card grid: Inquiry cards showing key info
- Detail view: Full inquiry with comments timeline, reminders, linked property

#### Properties
- Filter bar: Type filter + search + add button
- Card grid: Property cards with image preview
- Detail view: Full property with media gallery, linked landlord, linked inquiries

#### Landlords
- Simple table/list view
- Detail view: Landlord info with linked properties list

### Responsive Strategy
- **Desktop (1200px+)**: Full three-column layout
- **Tablet (768-1199px)**: Sidebar collapses to icons, right panel becomes modal
- **Mobile (<768px)**: Bottom navigation bar, full-screen pages, slide-up modals

## 4. Features & Interactions

### Authentication

#### Sign-up
- Fields: Full Name, Email, Password, Confirm Password
- Validation: Email format, password min 8 chars, passwords match
- On success: Auto-login, redirect to dashboard
- On error: Inline field errors with red border + message

#### Login
- Fields: Email, Password
- "Remember me" checkbox
- On success: Redirect to dashboard with welcome toast
- On error: Shake animation + error message below form

#### Session
- Store in localStorage
- Auto-logout after 7 days of inactivity
- Logout clears session, redirects to login

### Inquiry Management

#### Create Inquiry
- Modal form with fields:
  - Name* (text)
  - Contact Number* (tel with validation)
  - Property Type* (dropdown: Flat, Land, Office, Shop, Warehouse, Villa)
  - Budget* (number input with currency prefix)
  - Location Preference* (text)
  - Inquiry Type* (radio: Buy / Sell)
  - Status (dropdown, default: New)
  - Notes (textarea, optional)
- Submit: Save to localStorage, close modal, refresh list, show success toast
- Cancel: Close modal, discard changes

#### Edit Inquiry
- Same form as create, pre-filled
- Delete button visible
- Changes tracked in activity feed

#### Inquiry Status Flow
- Visual badges with colors:
  - New (blue #3b82f6)
  - Follow-up (yellow #f59e0b)
  - Hot Lead (orange #f97316)
  - Deal Closed (green #22c55e)
  - Completed (teal #14b8a6)
  - Cancelled (red #ef4444)
- Click to change status via dropdown

#### Link Property to Inquiry
- In inquiry detail view
- "Link Property" button opens property selector
- Shows linked property card with unlink option

### Property Management

#### Add Property
- Modal form:
  - Property Title*
  - Type* (dropdown: Residential, Commercial, Land)
  - Price* (number)
  - Location* (text)
  - Description (textarea)
  - Owner (dropdown from landlords, optional)
  - Image URLs (comma-separated text input, preview thumbnails shown)
  - Video URL (optional)
- Image preview: Show first 3 images as thumbnails, click to enlarge

#### Property Card
- Image thumbnail (or placeholder gradient)
- Title, type badge, price
- Location with icon
- Linked inquiry count badge
- Click: Open detail view

#### Property Detail
- Full image gallery (carousel if multiple)
- All property info
- Linked landlord card (clickable)
- Linked inquiries list (clickable)

### Landlord Management

#### Add Landlord
- Modal form:
  - Name*
  - Contact Number*
  - Address (textarea)
- Quick add from property form if needed

#### Landlord Card
- Avatar with initials
- Name, contact
- Property count badge

#### Landlord Detail
- Full info
- Properties list (linked)
- Inquiries list (linked)

### Reminder System

#### Set Reminder
- From inquiry detail: "Add Reminder" button
- Modal:
  - Date picker
  - Time picker
  - Note (optional)
- Stored with inquiry ID and timestamp

#### Reminder Display
- Dashboard: Today's reminders card, upcoming list
- Inquiry detail: Reminder badge if pending
- Overdue reminders highlighted in red

#### Reminder Notification
- On dashboard load, check reminders
- Show toast for due reminders
- Badge count on dashboard nav

### Comments / Remarks

#### Add Comment
- From inquiry detail
- Text input + submit button
- Auto-timestamped
- Appears in timeline (newest first)

#### Comment Display
- Timeline format in inquiry detail
- Avatar (user initial), timestamp, text
- Delete option for own comments

### Activity Feed
- Global feed on dashboard
- Shows: New inquiries, status changes, comments, reminders
- Relative timestamps ("2 hours ago")
- Click to navigate to relevant item

## 5. Component Inventory

### Navigation
- **Sidebar**: Logo, nav items with icons, active state (teal left border + bg tint), user avatar at bottom
- **Mobile Nav**: Bottom bar with 4 main icons (Dashboard, Inquiries, Properties, More)

### Cards
- **Stat Card**: Icon, number (large), label, optional trend indicator
- **Inquiry Card**: Status badge, name, contact, property type, budget, location, date
- **Property Card**: Image, title, type, price, location, inquiry count
- **Landlord Card**: Avatar, name, contact, property count

### Forms
- **Input**: Label above, full-width, dark bg (#243447), light border, teal focus ring
- **Select**: Custom styled dropdown, same as input
- **Textarea**: Same styling, auto-grow option
- **Radio/Toggle**: Custom styled with teal accent
- **Button Primary**: Teal bg, white text, hover darkens
- **Button Secondary**: Transparent, teal text, teal border
- **Button Danger**: Red bg for destructive actions

### Feedback
- **Toast**: Slide in from top-right, auto-dismiss 4s, types: success (green), error (red), info (blue)
- **Modal**: Centered, backdrop blur, max-width 500px, close X button
- **Loading**: Pulsing teal dots animation
- **Empty State**: Centered icon, message, action button

### Data Display
- **Badge**: Pill-shaped, color-coded by type
- **Table**: For landlords list, zebra striping, hover highlight
- **Timeline**: Vertical line with dots, timestamp left, content right

## 6. Technical Approach

### Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage (no backend)
- **Architecture**: Module pattern with separate JS files

### File Structure
```
/Borker
├── index.html (main entry)
├── css/
│   ├── variables.css (CSS custom properties)
│   ├── base.css (reset, typography)
│   ├── components.css (buttons, forms, cards)
│   ├── layout.css (sidebar, grid)
│   └── pages.css (page-specific styles)
├── js/
│   ├── app.js (main app, router)
│   ├── auth.js (login, signup, session)
│   ├── store.js (localStorage abstraction)
│   ├── dashboard.js
│   ├── inquiries.js
│   ├── properties.js
│   ├── landlords.js
│   ├── reminders.js
│   ├── comments.js
│   ├── ui.js (modals, toasts, notifications)
│   └── utils.js (formatters, validators)
└── SPEC.md
```

### Data Models

#### User
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "password": "hashed_string",
  "createdAt": "ISO timestamp"
}
```

#### Inquiry
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "contact": "string",
  "propertyType": "string",
  "budget": "number",
  "location": "string",
  "inquiryType": "buy|sell",
  "status": "new|follow-up|hot-lead|deal-closed|completed|cancelled",
  "notes": "string",
  "linkedPropertyId": "uuid|null",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

#### Property
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "string",
  "type": "residential|commercial|land",
  "price": "number",
  "location": "string",
  "description": "string",
  "ownerId": "uuid|null",
  "images": ["url1", "url2"],
  "videoUrl": "string|null",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

#### Landlord
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "contact": "string",
  "address": "string",
  "createdAt": "ISO timestamp"
}
```

#### Reminder
```json
{
  "id": "uuid",
  "userId": "uuid",
  "inquiryId": "uuid",
  "date": "ISO date",
  "time": "HH:mm",
  "note": "string",
  "completed": "boolean",
  "createdAt": "ISO timestamp"
}
```

#### Comment
```json
{
  "id": "uuid",
  "userId": "uuid",
  "inquiryId": "uuid",
  "text": "string",
  "createdAt": "ISO timestamp"
}
```

### localStorage Keys
- `borker_session`: Current user session
- `borker_users`: Array of all users
- `borker_inquiries_{userId}`: User's inquiries
- `borker_properties_{userId}`: User's properties
- `borker_landlords_{userId}`: User's landlords
- `borker_reminders_{userId}`: User's reminders
- `borker_comments_{userId}`: User's comments

### Routing
Hash-based routing (#/dashboard, #/inquiries, etc.)
- `#/login` - Login page
- `#/signup` - Signup page
- `#/dashboard` - Main dashboard
- `#/inquiries` - Inquiry list
- `#/inquiries/:id` - Inquiry detail
- `#/properties` - Property list
- `#/properties/:id` - Property detail
- `#/landlords` - Landlord list
- `#/landlords/:id` - Landlord detail
