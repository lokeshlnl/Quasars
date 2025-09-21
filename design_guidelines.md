# Quasars Healthcare Platform - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from healthcare platforms like Epic MyChart and Teladoc, combined with accessibility-first design patterns for rural users with varying technical literacy.

## Core Design Principles
- **Mobile-First**: Prioritize touch-friendly interfaces with large tap targets
- **Offline-First**: Clear visual indicators for sync status and offline capabilities
- **Accessibility**: High contrast, large text, and audio support throughout
- **Trust & Calm**: Medical-grade professionalism with approachable warmth

## Color Palette
**Primary Colors:**
- Deep Medical Blue: 210 85% 25% (trust, professionalism)
- Soft Healthcare Teal: 180 45% 55% (calming, accessible)

**Supporting Colors:**
- Success Green: 140 60% 45% (positive health indicators)
- Warning Amber: 35 85% 60% (alerts, important notifications)
- Error Red: 355 75% 50% (critical alerts)
- Neutral Gray: 220 15% 85% (backgrounds, dividers)

**Dark Mode:**
- Background: 210 25% 8%
- Surface: 210 20% 12%
- Text: 210 15% 95%

## Typography
- **Primary**: Inter (clean, medical-grade readability)
- **Sizes**: Base 18px for body text, 24px+ for headings (rural accessibility)
- **Weights**: Regular (400), Medium (500), Semibold (600)

## Layout System
**Tailwind Spacing**: Consistent use of 4, 6, 8, 12, 16 units
- Cards: p-6, gap-4
- Sections: py-12, px-6
- Components: m-4, space-y-6

## Component Library

### Navigation
- **Big Card Navigation**: Dashboard with 4 primary cards (Records, Doctors, AI Bot, Medicines)
- **Bottom Tab Bar**: Persistent mobile navigation with icons
- **Sync Indicator**: Always-visible connection status in header

### Core Components
- **Health Cards**: Large, touch-friendly cards with clear icons and status indicators
- **Doctor Profiles**: Photo, specialty badges, availability status
- **Chat Interface**: Clean messaging UI with AI assistant indicators
- **Forms**: Large inputs with clear labels and validation states
- **Appointment Cards**: Time-based layout with clear CTAs

### Data Displays
- **Timeline View**: Vertical timeline for medical history
- **Status Badges**: Color-coded health indicators and sync states
- **Progress Bars**: Treatment progress and loading states
- **Empty States**: Helpful guidance for new users

### Overlays
- **Offline Banner**: Persistent indicator when disconnected
- **Loading States**: Skeleton screens for slow rural connections
- **Confirmation Modals**: Clear, accessible action confirmations

## Images
**Hero Section**: Large, warm image of diverse rural family or healthcare worker with patient - conveying trust and community care
**Doctor Cards**: Professional headshots with consistent styling
**Feature Icons**: Custom healthcare iconography throughout dashboard
**Background Elements**: Subtle medical patterns or gradients for visual interest without distraction

## Accessibility Features
- Minimum 18px base font size
- 4.5:1 contrast ratios minimum
- Large tap targets (44px minimum)
- Screen reader optimized markup
- Audio support indicators
- Consistent dark mode implementation across all form inputs