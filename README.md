# Alex Library

A modern library management system with Next.js, React, and TypeScript. Browse, search, and discover books with an intuitive interface featuring user authentication, responsive design, and dark/light themes. Built with shadcn/ui components for a seamless digital reading experience.

## 🚀 Features

### Core Functionality

- **Book Management**: Browse, search, and discover books with detailed information
- **User Authentication**: Secure login system with role-based access control
- **Interactive Book Carousel**: Featured books display with smooth navigation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Built-in theme switching for comfortable reading

### Technical Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Modular, reusable React components
- **API Integration**: RESTful API communication with axios
- **Form Validation**: React Hook Form with Zod schema validation

## 🛠️ Tech Stack

### Frontend

- **Next.js 16.1.7** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.2.1** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library

### Key Libraries

- **@hookform/resolvers** & **react-hook-form** - Form handling
- **zod** - Schema validation
- **lucide-react** & **@hugeicons/react** - Icon libraries
- **next-themes** - Theme management
- **sonner** - Toast notifications
- **embla-carousel-react** - Carousel functionality
- **axios** - HTTP client

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd library
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Configure your environment variables in .env
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```text
library/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── books/             # Book-related pages
│   ├── profile/           # User profile pages
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── navbar1.tsx       # Navigation bar
│   ├── ecommerce-footer1.tsx # Footer component
│   └── ...               # Other UI components
├── contexts/             # React context providers
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication (if applicable)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Adding Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## 📚 Key Components

### Book Management

- **Book Carousel**: Interactive display of featured books
- **Book Details**: Comprehensive book information pages
- **Search & Filter**: Find books by title, author, or category

### User Interface

- **Navigation**: Responsive navbar with user authentication
- **Theme Provider**: Dark/light mode support
- **Footer**: Comprehensive footer with newsletter and contact info

### Forms & Validation

- **Login Form**: Secure user authentication
- **Profile Management**: User account settings
- **Book Forms**: Add/edit book functionality (admin)

## 🎨 Design System

The project uses a consistent design system built on:

- **Color Palette**: Tailwind CSS color system
- **Typography**: Inter and Geist Mono fonts
- **Spacing**: Consistent spacing scale
- **Components**: Reusable shadcn/ui components

## 🔐 Authentication

The application includes:

- Role-based access control (User/Admin)
- JWT token authentication
- Protected routes
- User context management

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoint-based layouts**
- **Touch-friendly interactions**
- **Optimized performance**

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include screenshots and error messages when applicable

## 🔗 Related Projects

### Backend & API

- **Backend Code**: [https://github.com/YB122/Library](https://github.com/YB122/Library)

### Admin Dashboard

- **Admin Dashboard Code**: [https://github.com/YB122/admin-library-react](https://github.com/YB122/admin-library-react)
- **Admin Dashboard Demo**: [https://library-alex.vercel.app/](https://library-alex.vercel.app/)

### Frontend Library

- **Alex Library Code**: [https://github.com/YB122/Alex-Library](https://github.com/YB122/Alex-Library)
- **Live Demo**: [https://alex-library-next.vercel.app/](https://alex-library-next.vercel.app/)

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/) and [HugeIcons](https://hugeicons.com/)

---

**Alex Library** - Your digital gateway to endless reading adventures.
