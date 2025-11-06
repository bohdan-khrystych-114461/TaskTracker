# Development Notes - Task Tracker

## Phase 1 Implementation Details

### Architecture Decisions

#### Component Structure
- **Standalone Components**: Using Angular 19's standalone components (no NgModule)
- **Service-Based State**: Centralized state management via `TimeTrackerService`
- **RxJS Observables**: BehaviorSubjects for reactive state updates
- **LocalStorage**: Client-side persistence for Phase 1

#### Design Patterns Applied

**1. Service Layer Pattern**
- `TimeTrackerService` handles all business logic
- Components are thin, focused on presentation
- Clear separation of concerns

**2. Observer Pattern**
- RxJS BehaviorSubjects for state management
- Components subscribe to state changes
- Automatic UI updates on data changes

**3. Component Composition**
- App component orchestrates layout
- Timer, Calendar, and TodoList are independent
- Each component can be developed/tested separately

### Key Implementation Details

#### Calendar Component
```typescript
// Drag-and-drop implementation
- onMouseDown: Start drag operation
- onMouseMove: Update drag selection
- onMouseUp: Create time block
- isSlotInDragRange: Visual feedback during drag
```

**Time Block Positioning**
- Absolute positioning within day columns
- Calculated based on start/end times
- Height represents duration
- Top position represents start time

**Week Calculation**
```typescript
// Get Monday of current week
const monday = new Date(today);
monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
```

#### Timer Component
```typescript
// Timer implementation
- setInterval for 1-second updates
- Elapsed time in seconds
- Converts to HH:MM:SS for display
- Stops timer on component destroy
```

**State Management**
```typescript
interface TimerState {
  taskName: string;
  startTime: Date | null;
  elapsedTime: number;  // seconds
  isRunning: boolean;
  isPaused: boolean;
}
```

#### To-Do List Component
- Simple CRUD operations
- Checkbox for completion toggle
- Filtered views (active/completed)
- Hover effects for delete button

### Styling Approach

**SCSS Architecture**
- Component-scoped styles
- Global styles in `styles.scss`
- CSS variables for theme colors
- BEM-like naming convention

**Color System**
```scss
$bg-primary: #1e1e1e;
$bg-secondary: #2a2a2a;
$bg-tertiary: #3a3a3a;
$text-primary: #e0e0e0;
$text-secondary: #888;
$accent-purple: #e040fb;
$accent-orange: #ff9800;
$accent-red: #f44336;
```

**Responsive Design**
- Desktop-first approach
- Breakpoint at 1024px for tablet
- Breakpoint at 768px for mobile
- Sidebar becomes horizontal on mobile

### Data Models

```typescript
interface TimeBlock {
  id: string;              // Generated UUID
  taskName: string;        // User input
  startTime: Date;         // Block start
  endTime: Date;           // Block end
  duration: number;        // Minutes
  date: Date;              // Day of block
}

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface TimerState {
  taskName: string;
  startTime: Date | null;
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
}
```

### LocalStorage Schema

**Keys:**
- `timeBlocks`: JSON array of TimeBlock objects
- `todoItems`: JSON array of TodoItem objects

**Serialization:**
- Dates converted to ISO strings
- Parsed back to Date objects on load
- Automatic save on every change

### Performance Considerations

**Optimizations:**
- Change detection strategy: Default (can optimize in Phase 2)
- Virtual scrolling: Not needed for 24-hour view
- Lazy loading: Not applicable for Phase 1
- Debouncing: Not needed yet

**Future Optimizations:**
- OnPush change detection
- Virtual scrolling for large datasets
- Lazy load components
- Service worker for offline support

### Browser Compatibility

**Tested On:**
- Chrome 120+
- Firefox 121+
- Edge 120+
- Safari 17+

**Required Features:**
- ES2020+ support
- CSS Grid
- Flexbox
- LocalStorage API
- Date API

### Known Limitations (Phase 1)

1. **No Backend**: Data only in browser
2. **No Authentication**: Single-user only
3. **No Sync**: Data doesn't sync across devices
4. **No Validation**: Minimal input validation
5. **No Editing**: Can't edit existing blocks (only delete)
6. **No Resize**: Can't resize time blocks after creation
7. **No Move**: Can't move blocks to different times
8. **Prompt-based Input**: Using browser prompts (will improve in Phase 2)

### Testing Strategy (To Be Implemented)

**Unit Tests:**
- Service methods
- Component logic
- Utility functions

**Integration Tests:**
- Component interactions
- Service integration
- LocalStorage operations

**E2E Tests:**
- User workflows
- Drag and drop
- Timer functionality

### Accessibility Considerations

**Current:**
- Semantic HTML
- Keyboard navigation (basic)
- ARIA labels (minimal)

**To Improve:**
- Full keyboard support
- Screen reader optimization
- Focus management
- ARIA live regions for timer

### Security Considerations

**Phase 1:**
- No security needed (client-only)
- LocalStorage is domain-isolated

**Phase 2 Requirements:**
- JWT authentication
- HTTPS only
- CORS configuration
- Input sanitization
- SQL injection prevention
- XSS protection

### Build Configuration

**Development:**
```bash
ng serve
# Hot Module Replacement enabled
# Source maps enabled
# No optimization
```

**Production:**
```bash
ng build --configuration production
# Minification enabled
# Tree shaking
# AOT compilation
# Source maps disabled
```

### Dependencies

**Core:**
- @angular/core: ^19.2.0
- @angular/common: ^19.2.0
- @angular/cdk: ^19.0.0
- rxjs: ^7.8.0
- typescript: ~5.7.2

**Dev:**
- @angular/cli: ^19.2.0
- @angular-devkit/build-angular: ^19.2.0

### File Size Analysis

**Initial Bundle:**
- main.js: ~90 KB
- styles.css: ~1 KB
- Total: ~91 KB (uncompressed)

**Optimized (Production):**
- Estimated: ~40 KB (gzipped)

### Git Workflow (Recommended)

```bash
# Feature branches
git checkout -b feature/component-name

# Commit messages
feat: Add calendar drag-and-drop
fix: Timer not stopping correctly
style: Update dark theme colors
docs: Add README documentation
```

### Environment Setup

**Required:**
- Node.js 20.17.0
- npm 10.8.2
- Angular CLI 19.2.0
- .NET SDK 9.0.304

**VS Code Extensions:**
- Angular Language Service
- ESLint
- Prettier
- SCSS IntelliSense

### Common Issues & Solutions

**Issue: Timer doesn't stop**
- Solution: Clear interval in ngOnDestroy

**Issue: Drag doesn't work**
- Solution: Check mouseup event listener on document

**Issue: Styles not applying**
- Solution: Check component styleUrl path

**Issue: LocalStorage not persisting**
- Solution: Check browser privacy settings

### Future Enhancements (Phase 2+)

**Backend Integration:**
- RESTful API endpoints
- WebSocket for real-time updates
- Database persistence
- User authentication

**UI Improvements:**
- Modal dialogs instead of prompts
- Inline editing for time blocks
- Drag to resize blocks
- Drag to move blocks
- Color coding by project
- Tags and categories

**Features:**
- Project management
- Team collaboration
- Time reports and analytics
- Export to CSV/PDF
- Calendar integrations
- Mobile app (Ionic/React Native)

### Performance Metrics (Target)

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 100 KB (gzipped)

### Code Quality Standards

**TypeScript:**
- Strict mode enabled
- No implicit any
- Explicit return types
- Interface over type

**SCSS:**
- BEM naming
- Nested max 3 levels
- Variables for colors
- Mixins for reusable styles

**Angular:**
- Standalone components
- OnPush when possible
- Unsubscribe in ngOnDestroy
- Async pipe preferred

### Deployment Checklist (Phase 2)

- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Build optimized
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (Google Analytics)
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] CDN setup
- [ ] Backup strategy
- [ ] Monitoring setup

---

**Last Updated**: November 5, 2025
**Phase**: 1 (Complete)
**Next Review**: Phase 2 Planning
