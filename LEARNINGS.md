Spell Bound Project Learnings
=============================

Planning and Scope
------------------
- Early phase list lacked explicit acceptance criteria for edge cases (empty categories, mobile layout).
- Skipped phase created later ambiguity (Gemini integration deferred) impacting cohesion of data abstraction.
- Adding a late phase increased coupling risk; refactor cost modest due to modular scripts.
- Clearer definition of storage schema up front would reduce defensive fallbacks.

Data and Domain Modeling
------------------------
- Normalization step simplified handling of inconsistent keys (part_of_speech variants).
- Central constant `QUIZ_WORD_COUNT` avoided magic numbers and eased later tuning.
- Missing explicit category selection default led to zero-word bug; resolved via dual fallback (home + practice layers).
- Age group to categories derivation justified pre-computation or caching for performance if dataset grows.

UI and Interaction
------------------
- Single primary button (Submit -> Next) reduced user mis-clicks vs separate next button.
- Mobile on-screen keyboard required readonly override; clarified necessity of dispatching synthetic input events.
- Preventing line wrap of control buttons required balancing label brevity vs accessibility (kept aria-labels).
- Early removal of unused progress bar simplified mental model.

Accessibility
-------------
- aria-live for feedback enabled screen reader parity with visual state changes.
- Inline validation (age group) improved form reliability vs silent failure.
- Keyboard focus management simplified by reusing one button element.
- Maintaining speech buttons after submission matched auditory reinforcement goals.

State and Persistence
---------------------
- LocalStorage sufficient for non-auth single-user context; naming consistency reduced retrieval errors.
- Defensive reconstruction of categories supports backward compatibility with legacy criteria objects.
- History aggregation separated from attempt detail kept storage size constrained.

Random Selection Logic
----------------------
- Difficulty filter shrinkage required fallback to unfiltered pool to avoid too-small quiz sets.
- Shuffle then slice provided uniform sampling; small dataset size did not justify reservoir or weighted strategies.

Deployment and Static Hosting
-----------------------------
- GitHub Pages root path required explicit `index.html` redirect; missing early requirement caused manual patch.
- Tailwind build artifact committed ensured predictable styling without runtime build in Pages environment.
- Clear script naming in `package.json` would streamline future automated build workflow (e.g., CI action).

Bug Root Causes and Preventive Measures
--------------------------------------
- Empty categories bug: missing specification for default selection when user picks only age. Prevention: acceptance test scenario in phase definition.
- Deprecated next button residual: scope creep; prevention via UI component audit checklist at phase end.
- Potential race on category fetch not an issue now but could surface; prevention: promise gating or load state indicator spec.

Refinements and Iteration
-------------------------
- Introducing fallback at both input (home) and consumption (practice) layers increased resilience.
- Shortened button labels improved layout without sacrificing semantics via aria-labels.
- Consolidated keyboard styles into Tailwind input source removed duplication and reduced CSS drift risk.

What Worked Well
----------------
- Modular separation (`common`, `data`, `practice`, `home`, `results`) limited cross-file edits per change.
- Progressive enhancement approach (mobile keyboard only under breakpoint) preserved baseline functionality.
- Early abstraction of selection + stats simplified later UI additions.

Opportunities for Future Improvement
------------------------------------
- Define explicit non-functional requirements (time to first interaction, mobile tap targets) early.
- Introduce lightweight unit tests for selection logic, fallback behavior, stats aggregation.
- Add lint + format step to reduce style variance and catch dead elements sooner.
- Implement feature flags for experimental modes (Gemini) to isolate risk.

Process Adjustments
-------------------
- Add a Definition of Done per phase: tests updated, residual elements removed, accessibility pass complete.
- Maintain a CHANGELOG to track why fallbacks introduced (rationale transparency).
- Tag backlog items with risk to prioritize validation (e.g., data assumptions, external APIs).

Deferred / Skipped Phase Impact
-------------------------------
- Gemini integration deferral avoided premature complexity in storage schema.
- Clear placeholder state (flag in criteria) prevented runtime errors despite absence of implementation.

Key Takeaways
-------------
- Explicit defaults prevent empty-state bugs.
- Dual-layer validation (input + consumption) increases robustness.
- Concise modular architecture simplifies late adjustments.
- Accessibility integrated early is cheaper than retrofitting.
- Static site constraints influence routing and build artifact decisions.
