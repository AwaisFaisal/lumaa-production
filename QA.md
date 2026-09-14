# LUMAA Landing Page QA

## Visual review

Reviewed the rendered page at 1440 by 1000 desktop and 390 by 844 mobile viewports.

### Desktop

- The asymmetrical hero, photo collage, Moments carousel, five-card data section, two-by-two property grid, founder module, signup band, and footer render in the intended hierarchy.
- The cream, burgundy, terracotta, and muted-gold palette is consistent.
- The Cormorant Garamond and DM Sans typography pairing matches the editorial direction.
- All source links and action controls are visually distinct.
- Licensed-image placeholders preserve the final photo crops without shipping unapproved images.

### Mobile

- The hero stacks cleanly and the collage retains the layered composition.
- The Moments carousel exposes one primary card with controls and remains horizontally swipeable.
- Statistics stack into readable single-column cards.
- Property cards preserve category, title, description, status, and Join for Updates action.
- Founder, signup, and footer sections remain legible without horizontal overflow.

## Build validation

- `pnpm check`: passed
- `pnpm build`: passed
- TypeScript diagnostics: no errors
- Development server: healthy

## Production dependencies still required

- Approved licensed photography and the approved Kedma portrait
- Final LUMAA domain and social links
- Newsletter endpoint
- Moment-submission endpoint and moderation destination

## Interaction review

The Share Your Moment action opens the modal correctly, locks background scrolling, exposes labeled fields, retains anonymous publication as the default, keeps marketing consent separate, and provides a visible close control. The next-carousel control is present and clickable; its state change requires one additional targeted verification because the browser capture did not visibly update the counter after the automated click.

The Moment form accepted a valid 64-character submission, preserved the default anonymous setting, executed the static demo integration, displayed a success toast, and transitioned to the moderated-submission confirmation state. No external data was sent because production endpoints are intentionally unconfigured.

The Moments next control was retested after the modal closed. It advanced the horizontal track and updated the position indicator from `01 / 04` to `02 / 04`, confirming the carousel state and scroll behavior are working.

The Midlife Power Index update action and main newsletter field were exercised in the live preview. The property control routes the viewport to the single LUMAA signup area, and the email field accepts a valid address without layout shift.

The newsletter form rejected an empty submission with a clear validation message. After a valid address was entered, it executed the static demo integration, displayed the success toast, and replaced the form with “You’re in. Watch your inbox.” No external data was sent.

## Link-preview QA

The Open Graph share card was rendered at the standard 1200 by 630 ratio. The LUMAA wordmark, full brand expansion, primary headline, supporting line, “Stay in the room” callout, and `wearelumaa.com` label remain legible at reduced preview size. The domain label uses a cream-backed surface so it retains contrast over the burgundy accent.
