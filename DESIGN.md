---
version: alpha
name: NutriAI Web Dashboard Design System
description: Standardized design tokens and design language specifications for the NutriAI Calorie & Meal Tracker Web Dashboard across Light and Dark themes.
colors:
  primary: "#10B981"
  brand-primary: "#10B981"
  brand-accent: "#059669"
  brand-tint: "#E8F7F0"
  brand-dark-showcase: "#064E3B"
  bg-app: "#F8FAFC"
  bg-surface: "#FFFFFF"
  bg-surface-subtle: "#F1F5F9"
  text-primary: "#0F172A"
  text-secondary: "#64748B"
  text-muted: "#94A3B8"
  border-default: "#E2E8F0"
  macro-carbs: "#F59E0B"
  macro-protein: "#3B82F6"
  macro-fat: "#EC4899"
  status-success: "#10B981"
  status-warning: "#F59E0B"
  status-danger: "#EF4444"
  ai-action: "#1E293B"
typography:
  sans:
    fontFamily: Inter
  display-1:
    fontFamily: Inter
    fontSize: 36px
    lineHeight: 44px
    fontWeight: 700
  heading-1:
    fontFamily: Inter
    fontSize: 24px
    lineHeight: 32px
    fontWeight: 700
  heading-2:
    fontFamily: Inter
    fontSize: 18px
    lineHeight: 26px
    fontWeight: 600
  heading-3:
    fontFamily: Inter
    fontSize: 16px
    lineHeight: 24px
    fontWeight: 600
  body-regular:
    fontFamily: Inter
    fontSize: 14px
    lineHeight: 20px
    fontWeight: 400
  body-medium:
    fontFamily: Inter
    fontSize: 14px
    lineHeight: 20px
    fontWeight: 500
  caption:
    fontFamily: Inter
    fontSize: 12px
    lineHeight: 16px
    fontWeight: 500
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  12: 48px
---

## Overview

NutriAI is an intelligent nutrition management and meal tracking web dashboard designed to simplify healthy eating without complex manual weighing. The visual system pairs clinical healthcare clarity with energetic health-tech aesthetics, using Emerald Green as the primary brand anchor, high-contrast dark surfaces for marketing and AI interaction focal points, dedicated color-coding for macro nutrients, and a dual-theme architecture (Light and Dark modes).

## Colors

The color system establishes clear visual hierarchy, semantic nutrient tracking, and dual-mode contrast compliance:

- **Brand Colors**: Emerald Green (`#10B981`) serves as the primary interactive accent for key call-to-actions, active navigation highlights, and completion progress bars. Mint Light (`#E8F7F0`) provides positive badge backgrounds and active navigation pill fills.
- **Showcase & AI Dark Contrast**: Forest Green (`#064E3B` / `#022C22`) establishes the marketing showcase container on authentication screens. Midnight Navy (`#1E293B`) defines the primary AI image analysis trigger button (`✨ Bắt đầu phân tích Calo`).
- **Macro Nutrients**: Fixed color-coding applies across all donut charts, progress bars, and meal cards:
  - **Carbohydrates**: Warm Amber (`#F59E0B` in Light / `#FBBF24` in Dark)
  - **Protein**: Vibrant Blue (`#3B82F6` in Light / `#60A5FA` in Dark)
  - **Fat (Chất béo)**: Magenta Pink (`#EC4899` in Light / `#F472B6` in Dark)
- **Status Indicators**:
  - **Success**: Emerald Green (`#10B981` in Light / `#34D399` in Dark) for target achievement.
  - **Warning**: Warm Amber (`#F59E0B` in Light / `#FBBF24` in Dark) for approaching limits.
  - **Danger**: Crimson Red (`#EF4444` in Light / `#F87171` in Dark) for exceeded calorie budgets.

## Themes

The interface supports Light Mode (default) and Dark Mode through synchronized token mapping:

| Token Identifier | Semantic Role | Light Mode (Default) | Dark Mode |
| :--- | :--- | :--- | :--- |
| `brand-primary` / `primary` | Main brand color & primary action buttons | `#10B981` | `#059669` |
| `brand-accent` | Secondary brand accent & hover highlights | `#059669` | `#34D399` |
| `brand-tint` | Active menu background & positive badge fill | `#E8F7F0` | `#064E3B` |
| `brand-dark-showcase` | Auth showcase card & dark hero backdrop | `#064E3B` | `#022C22` |
| `bg-app` | Overall application canvas background | `#F8FAFC` | `#0F172A` |
| `bg-surface` | Card surfaces, modal containers & sidebar | `#FFFFFF` | `#1E293B` |
| `bg-surface-subtle` | Input fields, table header bars & hover fills | `#F1F5F9` | `#334155` |
| `text-primary` | Page titles, large calorie metrics & strong text | `#0F172A` | `#F8FAFC` |
| `text-secondary` | Measurement units (kcal, g), labels & supporting copy | `#64748B` | `#94A3B8` |
| `text-muted` | Placeholder hints, timestamps & subtle dividers | `#94A3B8` | `#64748B` |
| `border-default` | Card outlines, table dividers & input borders | `#E2E8F0` | `#334155` |
| `macro-carbs` | Carbohydrate metric progress, badges & chart arcs | `#F59E0B` | `#FBBF24` |
| `macro-protein` | Protein metric progress, badges & chart arcs | `#3B82F6` | `#60A5FA` |
| `macro-fat` | Fat metric progress, badges & chart arcs | `#EC4899` | `#F472B6` |
| `status-success` | Target met & positive confirmation | `#10B981` | `#34D399` |
| `status-warning` | Near-threshold warning | `#F59E0B` | `#FBBF24` |
| `status-danger` | Exceeded calorie budget warning | `#EF4444` | `#F87171` |
| `ai-action` | AI scan action trigger button background | `#1E293B` | `#10B981` |

## Typography

Typography is set in `Inter` (with `Plus Jakarta Sans` as approved alternative) to provide crisp legibility for Vietnamese diacritics and technical nutrition figures:

- **Display 1** (`36px / 44px`, Bold 700): Daily total calories and primary dashboard counter figures.
- **Heading 1** (`24px / 32px`, Bold 700): Screen titles and major module headings.
- **Heading 2** (`18px / 26px`, SemiBold 600): Meal group section titles (Breakfast, Lunch, Dinner, Snack), modal headings, and analytics card titles.
- **Heading 3** (`16px / 24px`, SemiBold 600): Meal item names, widget subheadings, and quick action titles.
- **Body Regular** (`14px / 20px`, Regular 400): Standard table cell content, explanatory text, and AI analysis summary notes.
- **Body Medium** (`14px / 20px`, Medium 500): Interactive button text, input values, table column headers, and form field labels.
- **Caption / Badge** (`12px / 16px`, Medium 500): Measurement units (`kcal`, `g`), timestamps, and source identifier badges (`AI Scan`, `Manual`).

## Layout

Layout aligns to a 4px base spacing grid across three responsive viewport tiers:

- **Desktop (1440 × 900 px)**:
  - Sidebar: Fixed `260px` width on the left containing logo, 5 navigation items, and bottom mini profile.
  - Top App Bar: Sticky `72px` header containing breadcrumb/title, date picker strip, quick search, and user avatar dropdown.
  - Main Content: 12-column grid with `24px` gutter and `32px` outer margin.
- **Tablet (1024 × 768 px & 768 × 1024 px)**:
  - Sidebar: Collapsed `80px` width icon-only bar with hover tooltips, or overlay drawer.
  - Main Content: 8-column grid with `16px` gutter and `20px` outer margin.
- **Mobile Web (375 × 812 px)**:
  - Top App Bar: Sticky `56px` header with hamburger menu trigger.
  - Bottom Navigation Bar: Fixed `64px` bottom bar with 4 core action tabs.
  - Main Content: Single-column scroll layout with `12px` gutter and `16px` outer margin.

## Elevation & Depth

Visual depth relies on tonal background layers and subtle elevation outlines rather than heavy drop shadows:

- **Low Elevation (`shadow-sm`)**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` applied to baseline content cards, meal group containers, and metric summary boxes.
- **Medium Elevation (`shadow-md`)**: `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)` applied to hover states, dropdown menus, and popover editing cards.
- **High Elevation (`shadow-xl`)**: `0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` applied to modal dialogs (AI meal review modal) in combination with a blurred backdrop overlay (`backdrop-filter: blur(8px)`).

## Shapes

- **Corner Radii Tokens**:
  - `sm` (`6px`): Small badges, nutritional source tags, inline status dots, and text input fields.
  - `md` (`10px`): Primary buttons, secondary buttons, select dropdowns, and segmented goal selector cards.
  - `lg` (`16px`): Content cards, meal group accordion containers, and chart widgets.
  - `xl` (`24px`): Modal dialog windows, AI image dropzone frames, and large hero cards.
  - `full` (`9999px`): Pill tags, avatar frames, and live status indicators.

## Components

- **Navigation**:
  - Desktop Sidebar uses fixed `260px` container with `16px` padding and active items highlighted with `{colors.brand-tint}` background and `{colors.brand-primary}` text/icon.
  - Mobile Bottom Bar uses fixed `64px` height with 4 evenly spaced icon-label tabs.
- **Buttons**:
  - Primary button uses `{colors.brand-primary}` background, white text, `10px` radius, and `14px` Medium typography.
  - AI Action button uses `{colors.ai-action}` background, white text, `10px` radius, and sparkle icon prefix.
  - Outlined button uses transparent background, `1px solid {colors.border-default}`, and `{colors.text-primary}`.
- **Form Controls & Inputs**:
  - Text inputs use `{colors.bg-surface-subtle}` background, `6px` radius, `1px solid {colors.border-default}`, and `14px` Regular text.
  - Focus state transitions border to `{colors.brand-primary}` with a subtle focus ring.
  - Error state transitions border and validation message to `{colors.status-danger}`.
- **Cards & Containers**:
  - Content containers use `{colors.bg-surface}`, `16px` radius, `1px solid {colors.border-default}`, and `shadow-sm`.
  - Empty state meal cards use dashed border style (`2px dashed {colors.border-default}`) with centered icon and action button.
- **Nutritional Progress & Badges**:
  - Donut chart uses `10px` stroke width with Emerald progress arc, switching to `{colors.status-danger}` when exceeding 100%.
  - Macro progress bars use `6px` height with dedicated nutrient colors and rounded caps.
  - Source badges (`✨ AI Scan`, `✍️ Thủ công`) use `6px` radius and `12px` Caption typography.
- **Modals & Dialogs**:
  - Modal windows use `24px` radius, `{colors.bg-surface}` background, `shadow-xl`, and centered layout over a blurred backdrop overlay.

## Do's and Don'ts

### Do's
- Do apply macro colors consistently across all screens (`#F59E0B` for Carbs, `#3B82F6` for Protein, `#EC4899` for Fat).
- Do maintain WCAG 2.1 AA minimum contrast ratios (4.5:1 for standard body text, 3:1 for large display titles and icons) across both Light and Dark themes.
- Do use the 4px base spacing scale for all padding, margins, and layout gaps.
- Do use `shadow-sm` with `1px` subtle borders for cards to preserve clean healthcare UI clarity.

### Don'ts
- Don't use hardcoded hex values outside the standardized token set.
- Don't mix sharp corners (`0px`) with rounded components on the same view surface.
- Don't swap or reuse macro indicator colors for other non-macro interface elements.
- Don't omit source badges (`AI Scan` vs `Manual`) on meal entry line items.
