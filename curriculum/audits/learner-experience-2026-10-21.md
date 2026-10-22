# Learner experience revision

Version 0.3.0-beta, revised October 21, 2026.

## Changes

- Welcome and persistent guidance explain pausing, returning in the same browser, storage limitations, and clearing or switching devices. A numerical completion-time estimate is deferred until learner timing is available.
- The closing section offers a warm completion message after the learner explicitly marks self-reported participation. No score or survey response is required. Opening a section is not treated as verified completion.
- Learners can enter an optional name and download a standalone HTML acknowledgment or open its print view to save a PDF. The acknowledgment includes module title, version and revision date, the locally recorded participation date, and the self-reported basis for participation. It does not confer CME credit or certify competency. Names are neither stored in progress nor sent to a service. Reset clears the participation marker.
- Version metadata has one source in `site/release.json` and appears in the page shell, section footers, acknowledgment, and feedback template.
- A global feedback button offers a prefilled public GitHub issue and a downloadable text template for sharing through an existing contact. Downloading a template does not submit feedback. No research survey or new response-collection service is introduced.
- Shared accessibility behavior adds keyboard-focus styles, a skip-to-content link, named scrollable table regions, column-header scopes, question names and legends, status announcements, and focus after staged navigation. Narrow-screen wrapping and reduced-motion styles are included. Bottom navigation remains in document flow so it does not cover content.

## Verification

Use `python scripts/build.py` and `python scripts/export_draft.py` to regenerate the self-contained delivery files and learner draft. DOM regression checks in `scripts/check.js` cover 23 questions, matching, skip and restore behavior, score reporting, storage failure, reset, and participation privacy/escaping. `scripts/audit_content.js` checks question structure.

The browser check in `scripts/browser_check.js` uses Playwright and axe-core. It starts its own local server by default. Set `MODULE_URL` to test another copy, `CHROMIUM_PATH` to choose a browser executable, and `QA_OUTPUT` for temporary screenshots and logs. Browser dependencies are `playwright` and `@axe-core/playwright`; install a compatible browser through your normal development environment.

The checks exercise all 23 question submissions, all 24 skip controls including matching, self-reported completion with zero answered items, private optional name handling, acknowledgment download and print view, participation persistence and reset, feedback download and dialog dismissal. Viewports include 1440, 390, and 320 pixels. Automated accessibility scans cover visible question states, section endings, participation, and the feedback dialog against WCAG 2 A/AA and WCAG 2.1 AA rule tags. The October 21 run passed with zero automated accessibility violations in the tested states and no browser runtime errors. Selected desktop, narrow-screen, acknowledgment and print layouts were visually inspected. These checks are not accessibility certification.

Manual screen-reader testing, testing on physical mobile devices, and learner feedback remain outstanding. Clinical/source review and publication-readiness tasks are tracked separately. Research surveys and cohort percentiles remain deferred.
