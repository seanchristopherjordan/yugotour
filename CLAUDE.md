# Project Rules
Reference legacy files in /legacy-wp/understrap-child-main
Use Tailwind CSS for styling.
Parallax: Use Framer Motion for the city headers.
Database: Neon.tech (Postgres).
Javascript functionality: the custom-javascript.js file features a lot of custom work, and all of it should be ported over to the new next.js build as best as possible. 
Workflow: Build one component at a time. Do not skip ahead.
Design & Aesthetic (The "Vibe")
Era: This current design targets a 1970s Yugoslavian aesthetic. References brutalist architecture and vintage Zastava automotive design. There will not be a lot of opportunity for you to get creative unless I specifically ask, as 95% of this has been largely designed and built out.  
Typography should always remain templated and relatively strict in terms of sizing and line-height. Pay attention to the definitions in the existing Wordpress site to establish firm conventions for the new site. Ensure you're using the custom .woff files uploaded.
Imagery: All photos should feel like "film." If a component handles images, ensure it supports high-fidelity assets from Uploadthing without aggressive over-compression.
Color Palette: Use the "Two-Tone" office scheme: Eggshell White and Medium Grey, with accents of "Yugo Red" or "Safety Orange."
Responsive Breakpoints (WP Sync)
Sync: Mobile and Tablet are identical. Refer to the existing scss files. 
Logic: If an element is hidden on mobile, it must also be hidden on tablet. Do not suggest "tablet-only" layouts.
Technical Stack Specifics
Framework: Next.js 15 (App Router) + Payload 3.0.
Animations: Use Framer Motion for the parallax headers. Priority: Smoothness and performance on high-res Belgrade city layers.
Storage: Cloudflare R2 is the source of truth for all media. Use utfs.io URLs. Never use local /public/media for content.
Database: Neon.tech. Ensure all schema changes are reflected in migrations.
Legacy Code Protocol
Refactoring: When reading from /legacy-wp/understrap-child-main, extract the PHP logic and GSAP/JS logic, but translate it into clean TypeScript/React.
Plugin replication: this build will need to generally reproduce functionality provided in Formidable Forms (for the book now modal) and the 
CSS Migration: Convert Understrap (Bootstrap-based) classes into Tailwind utility classes. Do not bring over Bootstrap's overhead.
CMS Data: Reference functions.php from the legacy folder to understand how "Tours" were structured, then recreate them as Payload Collections.
Component Workflow
Isolation: Build components in /src/components. Each should be a "leaf" before being added to a "branch" (Page).
SEO: Every image-heavy component must include an alt text field mapped from the Payload Media collection. Please automate this as best you can.
Hydration: Be mindful of "Client Components" vs "Server Components." Keep the heavy lifting on the server wherever possible.
Existing site reference:
PHP Files to reference:
header.php
functions.php
front-page.php
footer.php
tour-list.php
booking-iframe.php
single-tour.php
wp-config.php
CSS files to reference:
_child_theme_variables.scss
child-theme.scss
_animations.scss
_global.scss
_header.scss
_footer.scss
_home-sections.scss
_megamenu.scss
_city-picker.scss
_slider.scss
_tales-section.scss
_television.scss
_tour-header.scss
_tour-intro.scss
_tour-tiles.scss
_simulator.scss
_booking-modal.scss
Javascript files to rerence:
custom-javascript.js
Editability: site content should be generally editable via blocks in Payload, and via collections (for tours), and whatever is appropriate for storing image data for the image slider. 
What does not exist in the current Wordpress Build includes:
-Various static pages (Terms & Conditions, FAQs, about us, etc.)
Fonts can be found in \src\app\(frontend)\fonts. Please register them in the root layout using next/font/local and add them to my Tailwind config
