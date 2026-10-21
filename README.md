# Laboratory Medicine: Health Equity, Ethics & Leadership

An interactive, evidence-grounded health equity curriculum for pathology residents and fellows, connecting diagnostic access, assay design, interpretation, stewardship, quality improvement, and informatics with laboratory medicine.

## Why this project?

Laboratory medicine sits at the intersection of diagnostic science, healthcare systems, and the communities they serve. Yet questions of equity, ethics, access, and structural context are not always explicitly integrated into laboratory medicine training.

This project was developed from the perspective of a pathology trainee seeking to better understand these issues and make them more approachable for other learners. It is **not intended to represent expert consensus, clinical guidance, or a definitive account of the literature**. Instead, its goal is to provide trainees with frameworks, evidence, cases, and questions that can help them think more critically about how laboratory systems affect—and are affected by—health inequities, and where laboratory professionals may have opportunities to investigate, partner, and improve practice.

The literature presented here is assembled through iterative literature discovery, source review, and educational synthesis, including AI-assisted tools. AI-assisted tools are used to support discovery, organization, and curriculum development; they are not treated as primary evidence. References are provided so learners can examine the underlying evidence themselves. Inclusion of a source does not imply endorsement of every conclusion in that source, and this resource is not a systematic review.

**This curriculum is as much about evidence literacy as it is about health equity.** Learners are encouraged to distinguish observation from explanation, population evidence from individual inference, published evidence from local evidence, and established principles from emerging or contested interpretations.

### A curriculum for getting curious

Many questions at the intersection of laboratory medicine, health equity, and ethics do not have a single uncomplicated answer. Evidence may be incomplete, terminology may differ across disciplines, findings may not translate perfectly between populations or institutions, and reasonable interpretations may differ.

This curriculum is therefore not intended to tell learners what to think. It is intended to provide **tools for thinking**: how to recognize a potential problem, interrogate the evidence, identify what remains unknown, examine local data and context, consider competing explanations, and determine what additional information might be needed before acting.

As pathologists and laboratory professionals, we are trained to question unexpected results, investigate discrepancies, understand limitations, and resist conclusions that exceed the available evidence. This curriculum asks us to bring that same mindset to questions of equity, ethics, and the diagnostic systems we help lead.

> **The goal is not certainty. It is curiosity with rigor.**

Learners should examine the evidence directly, challenge interpretations presented here, and continue their own inquiry.

## Curriculum philosophy

This project is designed to be:

- **Laboratory-centered:** focused on testing and reporting choices, patient access, and interdisciplinary collaboration.
- **Evidence-grounded:** separating established guidance, evidence-supported applications, emerging questions, and case-based reasoning.
- **Inquiry-driven:** rewarding careful questions and evidence-based reasoning rather than guessing the author's preferred conclusion.
- **Case-based rather than textbook-like:** short lessons anchored in realistic laboratory and clinical problems.
- **Context-aware:** recognizing that academic medical centers, community hospitals, reference laboratories, public-health laboratories, and resource-constrained settings may require different solutions.
- **Transparent about uncertainty:** preserving meaningful nuance, disagreement, limitations, and open questions rather than flattening them into false certainty.
- **Iterative:** sections will be built, reviewed, and revised one at a time before the full curriculum is finalized.

## Current learner draft and preview

- [Learner draft](curriculum/health-equity-learner-draft.md): current educational content, with 23 multiple-choice questions, concept matching, optional reflections, evidence notes, and further reading.
- [Interactive preview](preview/index.html): download and open in a browser. GitHub's file viewer displays the HTML source; it does not run the preview.

The preview is a self-contained HTML file. It has a section menu, staged cases, feedback after answering, and expandable supporting material. No timer or required passing score is used. Progress, selected answers, explanations, and revealed stages are saved locally in the browser when storage is available. A closing learning summary reports the latest submitted MCQ answers, percent correct among answered items, and unanswered count. It is a practice summary, not a validated assessment or a percentile comparison; matching and reflections are unscored. No answers are sent to a server. A reset control clears saved progress. If browser storage is blocked, progress remains available for the current visit.

## Curriculum map

| Section | Focus |
|---|---|
| 1 | Foundations: health disparities and health equity |
| 2 | Who becomes visible in laboratory data? |
| 3 | Access to diagnostic characterization and its timing |
| 4 | Bias before the specimen: who is considered for testing? |
| 5 | Reference populations, validation, and representation |
| 6 | Test suitability in a particular setting |
| 7 | Diagnostic stewardship through an equity lens |
| 8 | Quality improvement and laboratory action |
| 9 | Informatics, AI data, and laboratory reporting |
| 10 | Closing application exercise and further reading |

Older Section 1 scripts, storyboards, and evidence maps are retained as editorial history. They are not a second required foundations section; the editable `site/sections/*.html` files are the current content source. The linked learner draft is exported from those files so it includes the complete live cases and references.

## Evidence framework

Each lesson should distinguish among:

1. **Established principle** — supported by guidelines, consensus statements, systematic reviews, regulation, or a substantial evidence base.
2. **Evidence-supported application** — supported by literature but dependent on local context and implementation.
3. **Emerging or contested question** — an area with relevant literature but no single settled answer.
4. **Case-based reasoning** — an educational scenario used to apply established concepts; not presented as published evidence.

Typical lessons will end with a concise evidence base rather than an exhaustive bibliography.

## Repeating learning structure

Most lessons will aim to follow a short, consistent rhythm:

**Case → Question → Explanation → Takeaway → Expandable evidence**, with optional reflections and further reading.

Connected questions reveal additional information in stages. Assessment feedback follows each answer.

## Development standard

For curriculum development, the intended workflow is:

**Literature discovery → source verification → evidence classification → educational synthesis → case/interaction development → reference QA**

The curriculum should not reward guessing an author's opinion. Assessments should preferentially ask learners to determine what a finding supports, identify assumptions, recognize uncertainty, distinguish among plausible mechanisms, decide what additional evidence is needed, and consider what a laboratory professional can reasonably investigate or influence.

## Editing and checking the module

Edit the section HTML in `site/sections/`; section labels and order are defined in `site/sections.json`. Shared progress behavior lives in `site/progress.js`, and the outer navigation and storage logic live in `site/runtime.js`. The original self-contained delivery format is retained.

```sh
python scripts/build.py
python scripts/export_draft.py
```

The build writes identical `docs/index.html` (GitHub Pages) and `preview/index.html` (downloadable) files. Exporting refreshes the learner draft from the same section sources.

DOM interaction checks require Node.js and `jsdom`:

```sh
NODE_PATH=/path/to/node_modules node scripts/check.js
```

## Current status

The [educational beta is published on GitHub Pages](https://inimed25.github.io/laboratory-medicine-health-equity-ethics/). The October 14, 2026 revision strengthens distractors and next-step reasoning, adds an HCV process/outcome/balancing-measure question and closing exercise, moves answer citations and scope notes into expandable evidence panels, and adds a public feedback route and browser-local progress/reset.

JavaScript compilation and DOM interaction checks pass for all 23 questions, concept matching, skipping, restored answers and stages, outer section navigation, reset/cancel, stale-save protection, and blocked-storage fallback. These checks do not replace full browser rendering, mobile usability, or assistive-technology review. A local browser download was unavailable, so visual browser QA remains outstanding.

## Publication preparation and reviewer feedback — October 21, 2026

The TB case now supplies assay-specific requirements and a concrete fictional transport delay, distinguishing community specimen collection from laboratory processing. The closing section adds a transparent browser-local practice score with unanswered counts and section links.

- [Publication readiness audit and plan](curriculum/audits/publication-readiness-2026-10-21.md): scope, findings, targeted source checks, unresolved checks, and proposed expert review and learner evaluation.
- [Question review register](curriculum/audits/question-register.md): all 23 items, keys, explanation references, and pending independent review.

Rebuild, export, and run structural/interaction checks:

```sh
python scripts/build.py
python scripts/export_draft.py
NODE_PATH=/path/to/node_modules node scripts/audit_content.js
NODE_PATH=/path/to/node_modules node scripts/check.js
```

These changes do not establish educational effectiveness, formal content validity, or publication acceptance. Browser rendering and assistive-technology review remain outstanding; the current environment could not install a usable browser binary.
