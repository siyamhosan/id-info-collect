# ঢাকা পলিটেকনিক ইনস্টিটিউট - শিক্ষার্থী পরিচয়পত্র আবেদন সিস্টেম

## Dhaka Polytechnic Institute - Student ID Card Application System

A modern, responsive web application built with SvelteKit for collecting student information for ID card applications at Dhaka Polytechnic Institute. This system provides a smooth, multi-step form experience with real-time validation, comprehensive security measures, and a beautiful user interface that reflects the institution's official branding.

## 🚀 Features

### 🏛️ Institutional Branding
- **Official DPI Identity**: Complete integration with Dhaka Polytechnic Institute's official branding
- **Bilingual Interface**: Bengali and English language support throughout the application
- **Government Portal Style**: Designed to match Bangladesh National Portal standards
- **12 Official Departments**: All current DPI technology departments with proper names and codes
- **Institutional Statistics**: Live display of student (10,800), teacher (212), and infrastructure data
- **Official Contact Information**: Integrated with real DPI contact details and address

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
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Automated Processing**: Cron job system for Google Sheets export
- **Rate Limiting**: Built-in API rate limiting and retry mechanisms
- **Error Handling**: Comprehensive error handling with exponential backoff
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Technology Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) - Modern web framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Language**: JavaScript with TypeScript annotations
- **Database**: PostgreSQL with Drizzle ORM for submission storage
- **Google Sheets**: Automated data export via Google Sheets API
- **Cron Jobs**: Automated background processing with rate limiting
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

## 🤖 Automated Processing System

The application includes a sophisticated cron job system that automatically processes pending submissions and exports them to Google Sheets. This ensures reliable data transfer while respecting API rate limits.

### Key Features
- **Batch Processing**: Groups submissions by department for efficient processing
- **Rate Limiting**: Respects Google Sheets API limits (100 requests/minute)
- **Retry Logic**: Exponential backoff with up to 4 retry attempts
- **Error Handling**: Comprehensive error tracking and status updates
- **Authentication**: Secure key-based authentication for cron endpoints
- **Monitoring**: Detailed logging and execution statistics

### Cron Job Endpoint
`POST /api/submitter` - Processes all pending submissions

**Authentication Methods:**
- Header: `x-cron-key: your-secret-key`
- Header: `Authorization: Bearer your-bearer-token`

**Response Format:**
```json
{
  "success": true,
  "message": "Successfully processed 15 submissions",
  "totalProcessed": 15,
  "results": [...],
  "errors": [],
  "executionTime": 2340
}
```

### Testing the Cron Job
```bash
# Test locally
npm run test:cron

# Test production
npm run test:cron:prod

# Manual testing
curl -X POST http://localhost:5173/api/submitter \
  -H "x-cron-key: your-secret-key"
```

For detailed setup instructions, see [CRON_SETUP.md](./CRON_SETUP.md).

## 🔧 Configuration

### Environment Variables
For production deployment with backend integration, you need:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"

# Cron Job Authentication
CRON_SECRET_KEY=your-super-secret-cron-key-here
CRON_BEARER_TOKEN=your-bearer-token-for-cron-jobs

# Application Environment
NODE_ENV=production
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
- `npm run test:cron` - Test cron job locally
- `npm run test:cron:prod` - Test cron job in production
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

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
