# ID Card Information Collection System

A modern, responsive web application built with SvelteKit for collecting student information for ID card applications. This system provides a smooth, multi-step form experience with real-time validation and a beautiful user interface.

## 🚀 Features

### Core Functionality
- **Multi-step Form Flow**: Login → Department Selection → Information Form → Review → Success
- **Real-time Validation**: Instant feedback on form inputs with visual indicators
- **Image Upload**: Drag-and-drop profile photo upload with preview and validation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: Prevents duplicate submissions and remembers user preferences

### User Experience
- **Collapsible Instructions**: Important guidelines with read & understood checkbox
- **Visual Feedback**: Color-coded validation states (green for valid, red for invalid)
- **Progress Indicators**: Clear navigation between form steps
- **Notification System**: Toast notifications for user feedback
- **Download Summary**: Users can download their submission summary

### Technical Features
- **TypeScript Support**: Full type safety with JSDoc annotations
- **Modern CSS**: Tailwind CSS for utility-first styling
- **Component Architecture**: Reusable Svelte components
- **State Management**: Reactive stores for global state
- **Form Validation**: Comprehensive client-side validation
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Technology Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) - Modern web framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Language**: JavaScript with TypeScript annotations
- **Database**: PostgreSQL with Drizzle ORM (configured but not used in current implementation)
- **Deployment**: Netlify-ready with adapter included

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or pnpm package manager

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd id-info-collect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/           # Reusable Svelte components
│   │   ├── CollapsibleInstructions.svelte
│   │   ├── DepartmentSelection.svelte
│   │   ├── ImageUpload.svelte
│   │   ├── LoginPage.svelte
│   │   ├── Notification.svelte
│   │   ├── ReviewPage.svelte
│   │   ├── StudentInfoForm.svelte
│   │   └── SubmissionSuccess.svelte
│   ├── stores/               # Svelte stores for state management
│   │   ├── currentView.js    # Navigation state
│   │   ├── notifications.js  # Notification system
│   │   └── userSession.js    # User session data
│   ├── utils/                # Utility functions
│   │   └── validation.js     # Form validation functions
│   └── actions/              # Custom Svelte actions
│       └── scrollIntoView.js # Smooth scrolling action
├── routes/                   # SvelteKit routes
│   ├── +layout.svelte        # Global layout with notifications
│   └── +page.svelte          # Main application router
├── app.css                   # Global styles and Tailwind imports
└── app.html                  # HTML template
```

## 🎯 Application Flow

### 1. Login Page
- **Board Roll Validation**: 6-digit numeric validation
- **Semester Selection**: Dropdown with disabled options for unavailable semesters
- **Instructions**: Collapsible section with important guidelines
- **Duplicate Prevention**: Checks localStorage for already submitted rolls

### 2. Department Selection
- **Visual Cards**: Interactive department cards with icons
- **Search Functionality**: Filter departments by name or code
- **Responsive Grid**: Adapts to different screen sizes

### 3. Student Information Form
- **Pre-filled Data**: Board roll, semester, and department from previous steps
- **Comprehensive Validation**: Real-time validation for all fields
- **Roll Conflict Detection**: Prevents conflicts between board roll and class roll
- **Image Upload**: Drag-and-drop with preview and file validation
- **Dynamic Fields**: Custom session input appears when "Other" is selected

### 4. Review Page
- **Data Summary**: Clean, organized display of all submitted information
- **Image Preview**: Shows uploaded profile photo
- **Edit Option**: Return to form to make changes
- **Final Validation**: Last chance to review before submission

### 5. Success Page
- **Confirmation**: Success message with submission details
- **Download Summary**: Text file with application details
- **Next Steps**: Information about the ID card process
- **New Application**: Option to start a new submission

## 🔧 Configuration

### Environment Variables
Currently, the application runs entirely client-side. For production deployment with backend integration, you may need:

```env
# Database (if using backend)
DATABASE_URL=postgresql://...

# API endpoints
PUBLIC_API_BASE_URL=https://your-api.com

# File upload service
PUBLIC_UPLOAD_URL=https://your-upload-service.com
```

### Customization

#### Adding New Departments
Edit `src/lib/components/DepartmentSelection.svelte`:

```javascript
const departments = [
  { id: 'new-dept', name: 'New Department', code: 'ND', icon: '🎓' },
  // ... existing departments
];
```

#### Modifying Validation Rules
Edit `src/lib/utils/validation.js` to customize validation logic.

#### Styling Changes
The application uses Tailwind CSS. Modify classes directly in components or extend the configuration in `tailwind.config.js`.

## 🚀 Deployment

### Netlify (Recommended)
The project is pre-configured for Netlify deployment:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`

### Other Platforms
For other deployment platforms, you may need to change the adapter in `svelte.config.js`.

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte type checking
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier

### Code Quality
The project includes:
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking with JSDoc
- **Svelte Check**: Svelte-specific type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- **Backend Integration**: Connect to a real database and API
- **Email Notifications**: Automated email confirmations
- **Admin Dashboard**: Interface for managing submissions
- **Bulk Operations**: Handle multiple submissions
- **Advanced Validation**: Server-side validation
- **File Storage**: Cloud storage for uploaded images
- **Print Functionality**: Generate printable application forms
- **Multi-language Support**: Internationalization

---

Built with ❤️ using SvelteKit and Tailwind CSS
