# Publication readiness audit — October 21, 2026

## Judgment

This is a promising educational beta suitable for a mentor discussion about a manuscript. It is not yet a validated curriculum or assessment, and this audit does not establish journal acceptance or educational effectiveness. The strongest proposed route is a paper describing development, expert review, implementation, and learner evaluation of a case-based laboratory medicine curriculum. A perspective or educational framework article is another possibility if evaluation data are not collected; its claims should match that scope.

Baseline reviewed: repository main at `f286f6a6aa67c056340d3a0e5916c4e0cbf757c5`. This revision addresses reviewer feedback about the TB case and end-of-module feedback. No new learner data were collected. The review covered learner text across all sections, item structure, selected high-impact source checks, and automated interaction behavior. It was not an exhaustive literature search, complete claim verification, independent peer review, psychometric validation, or accessibility certification.

## Revisions made

- Section 6: distinguish community collection from laboratory processing. Supply known TST, direct-draw QFT-Plus, and T-SPOT.TB handling requirements; replace a vague limitation with a fictional 20-hour route that exceeds the direct-draw QFT-Plus 16-hour pre-incubation limit. Explain supported alternative collection routes rather than suggesting that lack of a clinic incubator rules out collection. Add manufacturer references.
- Closing section: add a browser-local summary of the latest submitted MCQ outcomes, percent correct among answered questions, and unanswered count, with section links. Matching and reflections are excluded. Re-answering after feedback counts; the summary is not a first-attempt assessment, competency threshold, reference interval, or peer percentile.
- Section 3: replace wording implying that the study measured availability of molecular characterization with wording about receipt of NGS testing.
- Section 1: correct the obsolete statement that progress lasts only while the page is open.
- Progress restoration: keep the last submitted answer separate from an edited but unsubmitted selection. Fingerprint section content so that old positional visibility snapshots are not applied after content changes. Older saved views may need their stages reopened; existing controls and submitted responses remain available.

## Findings and next steps

| Domain | Evidence from current module | Remaining work |
|---|---|---|
| Audience and objectives | Welcome identifies residents/fellows and four broad objectives. | Map each item to a measurable objective; ensure assessment breadth matches the intended claims. |
| Evidence transparency | Fictional examples, observed associations, and limits of inference are usually clearly identified. | Finish a claim-level ledger for every empirical and clinical assertion, including non-assessed text; verify full text, tables, supplements, corrections, dates and scope. |
| MCQ structure | 23 four-option MCQs; all have explanations and evidence notes. Keys A=5, B=7, C=6, D=5. | Independent reviewers should assess one-best-answer defensibility, ambiguity, cueing and distractor plausibility. Balance alone does not establish item quality. |
| Reasoning demands | Cases ask about missing denominators, causal limits, population versus individual inference, operational barriers and balancing measures. | Several incorrect options are categorical, while correct options contain more nuanced caveats. Pilot for ceiling effects and review whether learners can answer by tone rather than content. |
| Case specificity | TB case now supplies the needed workflow facts. | Review every case for unintended background-knowledge demands unrelated to its learning objective. Avoid adding so much technical detail that the equity reasoning is obscured. |
| Scoring | Transparent practice summary; unanswered items separated; no invented comparison dataset. | For research, use a separately specified first-attempt assessment. Immediate feedback and revision inflate this practice score; it cannot demonstrate learning gains by itself. |
| Independent content review | Dina provided specific qualitative feedback. | Document review by laboratory subject experts and someone with health equity/medical education expertise. Record comments, adjudications and reviewer contributions. Do not describe one informal review as formal content validation. |
| Learner evaluation | No learner dataset or evaluation report is present in the repository. | Conduct usability/think-aloud review, revise, then evaluate with a defined target population and prespecified outcomes. Report recruitment, denominators, completion, missing data and limitations. |
| Usability/accessibility | Programmatic checks cover answer feedback, skip, persistence and reset. | Complete desktop/mobile rendering, keyboard-only use, zoom, screen-reader and contrast review. Browser installation failed in this environment; visual QA remains outstanding. |
| Reproducibility | Editable sections, deterministic build and exported learner text are available. | Tag a stable reviewed release, document update ownership and review dates, and archive the version used for evaluation/manuscript. |
| Permissions and reuse | Public repository and cited sources. No top-level license was found in the reviewed tree. | Author should choose an appropriate reuse license; check rights for any reproduced figures, tables or borrowed items. Citations do not automatically grant reproduction rights. |
| AI transparency | Welcome/README disclose AI assistance. | Manuscript should accurately describe AI-supported drafting, coding and source discovery; human authors must verify and take responsibility for content. Follow the selected journal's current policy. |
| Novelty and journal fit | The project integrates laboratory cases with equity reasoning. | Search existing curricula and educational literature before making novelty claims. Ask Dina which article type and journal fit the actual contribution. Do not claim this is the first curriculum without a defensible search. |

## Targeted source checks

These are limited checks, not a completed evidence audit. Some full-text retrieval was blocked; indexed primary-source extracts were used where stated. A second human reviewer should verify the complete source and precise passage before final sign-off.

| Section / claim | Primary source and location | Check result |
|---|---|---|
| 2 / 25.35% released before STI results; post-release treatment unknown | [Wolf et al., 2024](https://wwwnc.cdc.gov/eid/article/30/13/23-0712_article), Results → Treatment for Positive Results | Full webpage checked. Preserve the distinction between unknown treatment and no treatment; no community comparison is established. |
| 3 / NGS 36.6% vs 29.7% before first-line; 54.7% vs 43.8% at any time | [Bruno et al., 2022, PubMed abstract](https://pubmed.ncbi.nlm.nih.gov/35737912/) | Primary abstract supports rates in nonsquamous NSCLC. This is testing receipt, not proof that reports were available before treatment. Full-text methods/table verification remains open. |
| 4 / universal prenatal/preconception hemoglobinopathy testing offer when prior results unavailable | [ACOG 2022 advisory](https://www.acog.org/clinical/clinical-guidance/practice-advisory/articles/2022/08/hemoglobinopathies-in-pregnancy) | Official indexed text supports the stated reproductive context; no universal rule for all tests follows. |
| 5 / Duffy-null ANC interval 1,210–5,390/µL | [Merz et al., JAMA 2023](https://jamanetwork.com/journals/jama/fullarticle/2806162), Results | Primary indexed text confirms the central 95% interval. Full-text extraction was blocked on PMC; recheck selection criteria and 120-participant description before sign-off. It is not a universal safety threshold. |
| 5 / 289 trials, 71 regimens, 76.5% trial restrictions | [Hibbs et al., 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2823538), corrected Results | Indexed primary text confirms 221/289 trials and 71 regimens. December 19, 2024 correction concerns sensitivity-analysis text and supplementary figures; verify corrected supplement when finalizing. |
| 5 / CYP2C9 Tier 1 alleles | [AMP/CAP recommendation](https://pmc.ncbi.nlm.nih.gov/articles/PMC7057225/), Tier 1 CYP2C9 Variant Alleles | Retrieved primary text supports *2, *3, *5, *6, *8 and *11. Distinguish recommendations from accreditation requirements. |
| 6 / QFT-Plus direct draw handling | [QIAGEN US IFU Rev. 12, March 2026](https://www.qiagen.com/en-us/resources/download/kithandbookandprotocol/hb_3304_012_r12_qftb_goldplus_bct_0326_us), pp. 7–11 | Current US PDF checked: 0.8–1.2 mL range, 17–25°C before incubation, start as soon as possible within 16 h, incubate upright at 37°C ±1°C for 16–24 h. Alternative single-heparin routes have separate limits. |
| 6 / TST reading and BCG; IGRA use | [CDC IGRA guidance](https://www.cdc.gov/tb/hcp/testing-diagnosis/interferon-gamma-release-assay.html); [CDC TST guidance](https://www.cdc.gov/tb/hcp/testing-diagnosis/tuberculin-skin-test.html) | Official text supports 48–72 h reading and IGRA preference in BCG-vaccinated people / those unlikely to return. |
| 6 / T-SPOT.TB 8 h / supported 32 h workflow | [US V13 insert](https://www.tspot.com/wp-content/uploads/2023/12/TB-PI-US-0001-V13.pdf); [US V9 insert](https://www.tspot.com/wp-content/uploads/2021/04/TB-PI-US-0001-V9.pdf); CDC IGRA comparison | CDC supports 8–32 h; accessible V9 manufacturer text describes lithium heparin, 18–25°C and T-Cell Xtend up to 32 h. V13 retrieval was blocked. Confirm latest US insert with laboratory/manufacturer before final clinical sign-off. |
| 7 / newborn testing 7.3% vs 1.9%, cohort 26,366 births | [Schoneich et al., 2023](https://pubmed.ncbi.nlm.nih.gov/36884249/) | Primary abstract/indexed article supports the reported rates among births without prenatal urine drug testing, 207/2,870 vs 335/17,564. Maintain that denominator qualifier. |

Not fully reverified in this pass: foundational definition sources, the home-sampling studies and FDA authorization details, HCV guidance and all surrounding assertions, AI testing study methods, gender-diversity guidance and analyte-specific recommendations, confidentiality sources, and further-reading summaries. The question register captures citation presence but does not resolve these open checks.

## Publication plan for discussion with Dina

1. Agree on the contribution and article format before expanding the module. Ask whether a curriculum development/evaluation paper, educational framework, or perspective is most suitable. Verify current author instructions directly; CCLM describes interest in teaching/training methods, but detailed current author-instruction retrieval was blocked in this audit. Clinica Chimica Acta's guide also could not be retrieved.
2. Complete and document source checks and independent item review using the question register. Add a claim-level ledger with claim, exact passage/table, source version, correction check, scope, reviewer and resolution. Obtain a subject expert's sign-off on clinically technical examples.
3. Run a small usability pilot with intended learners, using think-aloud feedback to identify confusing stems, navigation issues and unintended knowledge demands. Revise before evaluating learning.
4. With a medical educator, specify an evaluation question, primary outcome, instruments, recruitment and sample-size rationale. Separate usability, perceived usefulness and confidence from knowledge or transfer. A single-group pre/post design can describe change but cannot establish causal effectiveness; consider matched or parallel assessments and delayed retention if feasible.
5. Ask the institutional education/IRB office for the appropriate determination before collecting learner data for research. Do not assume that an educational project is automatically exempt or that publication alone makes it research. Protect voluntariness and learner privacy. See [OHRP's discussion of publication intent and research determination](https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/quality-improvement-activities/index.html); local educational-study determination remains necessary.
6. Freeze and archive the evaluated version. Prepare a manuscript with educational need and objectives, development and source-review methods, reviewer/pilot revisions, intervention description, evaluation methods/results if available, limitations, availability, authorship, conflicts, funding, AI disclosure and ethics determination.

No manuscript should report educational effectiveness, item reliability, learner percentiles or formal validation without supporting data. Percentiles would require a defined comparison cohort, comparable version and administration conditions, a transparent tie rule, sample size and sampling limitations. A self-selected practice cohort is not a population norm. A reference interval is a different concept and would not be an appropriate name for an arbitrary score band.

## Review request to share with colleagues

For each assigned case: Is the clinical premise accurate? Does the cited source support the exact statement and population? Is there one defensible best answer? Could another option be reasonably correct? Does the explanation exceed the evidence? Does wording make unsupported assumptions about a group? Is the laboratory's role realistic? What specific change is needed? Record reviewer identity, date, conflict disclosures if relevant, recommendation and resolution; invite meaningful contributors to discuss authorship based on actual contributions.

## Validation completed for this revision

- Build regenerates identical GitHub Pages and downloadable HTML.
- All 23 questions pass automated feedback, skip, and restore checks; matching and outer navigation/reset/storage-failure behavior also pass.
- Added checks verify 23-item scoring denominator, partial completion, unanswered counts, summary visibility, score reset, and preservation of the latest submitted outcome after an unsubmitted edit and reload.
- Structural audit verifies four unique A–D options per item, valid keys, explanations/evidence notes, and unique IDs within each section.
- Full browser render, mobile interaction, keyboard/screen-reader review, complete external link checking, and independent clinical review remain open.
