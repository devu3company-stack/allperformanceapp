---
name: Apex Velocity
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#e8bcb9'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#ae8785'
  outline-variant: '#5e3f3d'
  surface-tint: '#ffb3af'
  primary: '#ffb3af'
  on-primary: '#68000e'
  primary-container: '#e4002b'
  on-primary-container: '#fff6f5'
  inverse-primary: '#bf0022'
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#727171'
  on-tertiary-container: '#faf6f6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#930018'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 72px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The brand personality is high-octane, competitive, and uncompromising. Designed for high-performance sports, automotive, or elite fitness sectors, the UI evokes a sense of urgency, precision, and power. 

The design style is **High-Contrast / Bold** with a focus on structural tension. It utilizes aggressive typography and a restricted color palette to create a focused, athletic environment. Every element is designed to feel "fast," utilizing sharp edges and heavy weights to signal strength and reliability.

## Colors
The palette is built on extreme contrast to ensure legibility and energy.
- **Primary (Red):** Used exclusively for calls to action, active states, and critical performance indicators. It is the "engine" of the UI.
- **Surface Secondary (Lead Grey):** Applied to secondary containers, dividers, and card backgrounds within the dark mode context to provide subtle depth without losing the "Rich Black" aesthetic.
- **Neutral (Light Grey):** Used for high-information panels or secondary screens where a light background is required for long-form data reading.
- **Typography:** Strict adherence to White (#FFFFFF) on dark surfaces and Rich Black (#0A0A0A) on Light Grey surfaces to maintain maximum accessibility and impact.

## Typography
Typography is the primary driver of the athletic aesthetic. 
- **Headlines:** Montserrat is used in heavy weights (Bold to Black) and often set in uppercase to mimic sportswear branding.
- **Body:** Archivo Narrow is chosen for its efficient horizontal footprint, allowing for dense data display without sacrificing readability.
- **Data/Labels:** JetBrains Mono provides a technical, precise feel for metrics, timestamps, and secondary metadata, reinforcing the performance-tracking nature of the system.

## Layout & Spacing
The layout follows a strict **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

The rhythm is based on a 4px baseline, but transitions are abrupt and intentional. Large margins (64px+) are used to isolate hero elements, while data-heavy sections use tight 16px gutters to feel compact and "instrumental." Components should favor vertical stacking on mobile to maintain the momentum of the scroll.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layers** rather than shadows. 
- **Base Level:** Rich Black (#0A0A0A).
- **Secondary Level:** Lead Grey (#1A1A1A) used for cards and floating headers.
- **Interaction Level:** Primary Red (#E4002B) for active states.
- **Contrast Level:** Light Grey (#F2F2F2) for heavy data panels that sit "above" the dark core of the app.

Shadows are avoided entirely to maintain the "Sharp" style. Instead, use 1px solid borders in Lead Grey or pure White (at 10% opacity) to define boundaries between dark elements.

## Shapes
The shape language is strictly **Sharp**. Radii are set to 0px across all components including buttons, input fields, and cards. This reinforces the "unrefined" and aggressive athletic aesthetic. Angularity is used to convey precision and speed. The only exception is the use of circular icons or profile avatars to provide necessary visual relief.

## Components
- **Buttons:** Rectangular with 0px border-radius. Primary buttons are solid Red (#E4002B) with White text. Secondary buttons are outlined in White with no fill.
- **Input Fields:** Solid Lead Grey (#1A1A1A) backgrounds with bottom-only borders in White. Focus state changes the bottom border to Red.
- **Cards:** No shadows. Use 1px borders in Lead Grey or solid Lead Grey fills against the Rich Black background.
- **Lists:** High-density rows with 1px dividers. Use JetBrains Mono for all numerical data within lists.
- **Chips/Status:** Small, uppercase labels using JetBrains Mono. Success states use White; warning/active states use the Primary Red.
- **Progress Bars:** Thick, 8px bars. The background track is Lead Grey, and the progress fill is Primary Red.