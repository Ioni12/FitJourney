# CW2 — Product Backlog

This document captures the prioritized User Stories for the FitJourney MVP, adhering to MoSCoW prioritization and INVEST principles.

## MUST HAVE

**US-01:** As a new user, I want to create an account using my email and password, so that my personal fitness data is saved securely.
* AC1: The registration form validates that the email follows a standard format and the password is at least 8 characters long.
* AC2: A verification email is sent immediately upon successful registration.

**US-02:** As a returning user, I want to log in to my account, so that I can access my personalized dashboard.
* AC1: Incorrect credentials display a clear, non-specific error message ("Invalid email or password").
* AC2: Upon successful login, the user is immediately redirected to the main dashboard.

**US-03:** As a user, I want to log a strength training session with sets, reps, and weights, so that I can track my progressive overload over time.
* AC1: Only positive numbers can be entered for sets, reps, and weights.
* AC2: The logged session appears in the recent activity feed within 1 second of saving.

**US-04:** As a user, I want to view a dashboard with a chart of my weight progression, so that I can easily see if I am moving towards my goals.
* AC1: The chart correctly scales its Y-axis based on the minimum and maximum recorded weights.
* AC2: The user can toggle between 1-month, 3-month, and All-Time views.

## SHOULD HAVE

**US-05:** As a user, I want to log the duration and distance of cardio workouts, so that I can track my endurance improvements.
**US-06:** As a personal trainer, I want to view my clients' recent workout logs, so that I can provide actionable feedback during our sessions.
**US-07:** As a user, I want to log my daily food intake (calories, protein, carbs, fat), so that I can monitor my nutritional goals alongside my physical activity.

## COULD HAVE

**US-08:** As a user, I want to create and save custom workout templates, so that I can log recurring routines with a single click.
**US-09:** As an administrator, I want to view a dashboard of daily active users, so that I can monitor system adoption rates.
**US-10:** As a user, I want to receive a weekly email summary of my workouts, so that I stay motivated even on off-days.

## WON'T HAVE (This Release)

**US-11:** As a user, I want to connect my Apple Watch / Fitbit to the app, so that my steps and calories are imported automatically.
**US-12:** As a user, I want to add friends and view their public workouts in a social feed, so that we can encourage each other.

---

### Epic-Splitting Example & INVEST Review
*Original Epic:* "As a user, I want to manage my physical profile."
*Split into user stories:*
* -> US-13: As a user, I want to update my current weight in my profile, so that the dashboard reflects my latest progress.
* -> US-14: As a user, I want to change my height and age in my settings, so that my BMI and calorie estimates remain accurate.
* -> US-15: As a user, I want to set a target weight goal, so that the dashboard can display a progress bar towards completion.

**INVEST Check for US-13:**
* **Independent:** Can be developed without US-14 or US-15.
* **Negotiable:** The exact UI for updating the weight isn't strictly defined, leaving room for developer input.
* **Valuable:** It's essential for users to keep their tracking up to date.
* **Estimable:** Updating a single database field is straightforward; it can be sized easily (Small).
* **Small:** Very contained piece of work.
* **Testable:** AC could be written to verify that the value saves and reflects immediately on the chart.
