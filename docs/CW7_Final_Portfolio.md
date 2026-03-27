# CW7 — Final Portfolio

## 1. Deliverables Directory & Changelog

All previous deliverables have been revised based on feedback received throughout the 13-week seminar and project cycle.

*   [CW1: Project Charter](./CW1_Project_Charter.md)
    *   *Changelog:* Refined target user descriptions to explicitly include "Application Administrators" instead of merging them with General Users.
*   [CW2: Product Backlog](./CW2_Product_Backlog.md)
    *   *Changelog:* Added MoSCoW prioritization clearly under subheadings. Rewrote "Epic-Splitting" example to explicitly map to INVEST criteria.
*   [CW3: Requirements Document](./CW3_Requirements_Document.md)
    *   *Changelog:* Cleaned up Context Diagram actors to accurately reflect the interactions with an external Authentication Provider instead of attempting to build auth entirely in-house.
*   [CW4: UML Behavioural Suite](./CW4_UML_Behavioural_Suite.md)
    *   *Changelog:* Fixed the Activity Diagram swimlanes to logically separate the Client UI from the Backend API. Refined actor names mapping to CW3 perfectly.
*   [CW5: Design Document](./CW5_Design_Document.md)
    *   *Changelog:* Swapped out original MVC-Monolith logic for an explicit Layered Architecture utilizing a Node.js REST API.
*   [CW6: Project Management Plan](./CW6_Project_Management_Plan.md)
    *   *Changelog:* Added the quantitative Effort Estimate via Use-Case Points calculation, formally documenting the academic timeline constraints.

## 2. Maintenance Plan

Once FitJourney MVP v1.0 is released, we anticipate the following maintenance requirements:

**A. Corrective Maintenance**
*   *Definition:* Fixing observed system failures where the software does not work as specified.
*   *Application Example:* Users report that submitting a workout with trailing spaces in the "Exercise Name" causes a blank interface on the dashboard. A reactive bug fix (`trim()` input) is deployed to correct the defect immediately.

**B. Adaptive Maintenance**
*   *Definition:* Modifying the software to adapt to environmental changes (OS updates, API deprecations, new laws).
*   *Application Example:* The external Authentication Provider upgrades from OAuth 2.0 to a new standard and deprecates the old endpoint. We must refactor our auth service to remain operational, despite no new functionality being added.

**C. Perfective Maintenance**
*   *Definition:* Improving the quality or maintainability of the codebase proactively, without altering the external functionality.
*   *Application Example:* Refactoring the Workout Logging controllers into smaller, more modular services to make it easier for new developers to understand the structure, and adding database indexes to speed up the dashboard analytics queries.

## 3. Evolution Roadmap (v2.0) & Lehman's Laws

**Feature 1: Advanced Nutrition Macronutrient Tracking & Recipe Integration**
*   *Justification via Lehman's Law 1 (Continuing Change):* A software system must continuously adapt to real-world user needs or become progressively less satisfactory. Our users continuously request granular nutritional data scanning. Implementing this feature satisfies the law of continuing adaptation to user needs.

**Feature 2: Wearable Device (Apple Health/FitBit) Automatic Syncing**
*   *Justification via Lehman's Law 6 (Continuing Growth):* The functional content of systems must be continually increased to maintain user satisfaction over their lifetime. A modern fitness app that requires manual entry will quickly lose users to competitors that sync automatically. We must increase the functional content of the app regarding integrations.

**Feature 3: Complete UI Component Library Overhaul**
*   *Justification via Lehman's Law 2 (Increasing Complexity):* As an evolving program changes, its structure becomes more complex unless active efforts are made to avoid this phenomenon. Over the last 12 weeks, our CSS and UI states have become incredibly messy. A strict V2 component library will proactively reduce the complexity accreted during the rapid MVP development phase.

## 4. Reflection Note

If we were to rebuild FitJourney from scratch, the single most impactful change we would make is to enforce a **Test-Driven Development (TDD)** approach alongside our Scrum agile methodology. 

During our Sprint 2 & 3 integrations, we consistently ran into situations where frontend dashboard components completely failed to render because the backend API adjusted a JSON property name (e.g., `exerciseId` to `exercise_id`). Since we didn't have automated integration tests running on a CI/CD pipeline, we didn't discover these regressions until manual QA testing just days before the milestone submission. 

Overall, the project allowed us to realize how critical structured planning is before writing code. Drafting the UML diagrams in CW3 and CW4 forced us to uncover edge-cases (like the email verification loop) before we had written any Javascript. While the UML felt dense to produce initially, it ultimately saved us likely dozens of hours of blind structural refactoring.
