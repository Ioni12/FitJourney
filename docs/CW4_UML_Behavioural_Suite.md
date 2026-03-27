# CW4 — UML Behavioural Suite

## 1. Refined Use Case Diagram

### Changes from CW3
Based on peer feedback and a more robust architectural review, the following refinements were made to the Use Case diagram:
1. **System Boundary**: Formally defined the `FitJourney_App` boundary to exclude external actors.
2. **Modularization**: Grouped use cases into logical packages (`User Administration` and `Core Tracking`) to reflect the 3-tier architecture.
3. **Actor Precision**: Distinguished between the `User` and `SystemAdmin` roles more clearly, refining the associations to ensure Principle of Least Privilege.
4. **Relationship Cleanup**: Refined the `<<include>>` and `<<extend>>` relationships to avoid diagram congestion.

```mermaid
graph LR
    User((User))
    SystemAdmin((System Admin))
    
    subgraph FitJourney_App [FitJourney App]
        subgraph User_Administration [User Administration]
            UC_Auth([Authenticate User])
            UC_Reg([Register Profile])
            UC_Admin([Manage Users])
        end
        
        subgraph Core_Tracking [Core Tracking]
            UC_Dash([View Dashboard])
            UC_Ana([Query Analytics])
            UC_Work([Log Workout])
            UC_Share([Share Workout])
        end
        
        %% Relationships
        UC_Reg -.->|"<<include>>"| UC_Auth
        UC_Dash -.->|"<<include>>"| UC_Auth
        UC_Work -.->|"<<include>>"| UC_Auth
        
        UC_Dash -.->|"<<include>>"| UC_Ana
        UC_Share -.->|"<<extend>>"| UC_Work
    end
    
    User --- UC_Reg
    User --- UC_Dash
    User --- UC_Work
    
    SystemAdmin --- UC_Admin
```

## 2. Activity Diagram: "Log New Workout"

A swimlane Activity Diagram illustrating the parallel interactions between the client UI, the backend server API, and the database.

```mermaid
graph TD
    subgraph User_Actor [User]
        Start([Start]) --> ClickAdd["Clicks Add Workout"]
        Submit["Submits details"]
    end
    
    subgraph Frontend_App [Frontend App]
        ShowForm["Displays Workout Form"]
        HandleSubmit["POST /api/workouts"]
        ShowSuccess["Success Toast & Redirect"]
    end
    
    subgraph Backend_API [Backend API]
        Validate{Validate Payload}
        InsertDB["INSERT into Workouts"]
        TriggerAnalytics["Trigger Analytics"]
    end
    
    subgraph Database_Layer [Database]
        WriteDB[("Commit Transaction")]
    end

    %% Flow
    Start --> ClickAdd
    ClickAdd --> ShowForm
    ShowForm --> Submit
    Submit --> HandleSubmit
    HandleSubmit --> Validate
    
    Validate -- "is Valid" --> InsertDB
    Validate -- "is Invalid" --> ShowForm
    
    InsertDB --> WriteDB
    WriteDB --> TriggerAnalytics
    TriggerAnalytics --> ShowSuccess
    ShowSuccess --> End([End])
```

## 3. Sequence Diagrams

### Simple Sequence: View Dashboard
Demonstrating a straightforward 3-object read interaction.

```mermaid
sequenceDiagram
    actor User
    participant ReactApp
    participant API
    participant DB

    User->>ReactApp: Navigate to /dashboard
    activate ReactApp
    ReactApp->>API: GET /api/user/analytics
    activate API
    API->>DB: Query Aggregated Metrics
    activate DB
    DB-->>API: Metric Data (JSON)
    deactivate DB
    API-->>ReactApp: 200 OK (Data)
    deactivate API
    ReactApp-->>User: Render Charts & Feed
    deactivate ReactApp
```

### Complex Sequence: Registration with Email Verification Loop
Demonstrating loops, conditions, and external services.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthController
    participant UserDB
    participant EmailService

    User->>Frontend: Submit Registration Form
    Frontend->>AuthController: POST /auth/register
    
    AuthController->>UserDB: Query if Email Exists
    UserDB-->>AuthController: Returns Null (Not Found)
    
    alt Email Found
        AuthController-->>Frontend: 409 Conflict
    else Email Unique
        AuthController->>AuthController: Hash Password
        AuthController->>UserDB: Insert User (unverified)
        UserDB-->>AuthController: OK
        
        loop Retries (Max 3)
            AuthController->>EmailService: Send Verification Token
            alt Email Sent
                EmailService-->>AuthController: Success
            else SMTP Error
                EmailService-->>AuthController: Fail, Retry Next Item
            end
        end
        
        AuthController-->>Frontend: 201 Created (Token)
        Frontend-->>User: "Please check your email"
    end
```

## 4. Communication Diagram

Derived from the "Simple Sequence: View Dashboard" diagram to emphasize the organizational relationships between objects rather than the strict chronological sequence.

**Text-Notation Model:**
```
  [User (Browser)] 
         │ 
         │ 1: navigateDashboard()
         │ 4: renderView()
         ▼ 
  [ReactApp (Frontend)] ─────────► [API (Backend Service)]
                          2: getAnalytics() │
                          3: returnJson()   │
                                            │ 2.1: queryMetrics()
                                            │ 2.2: returnData()
                                            ▼
                                   [DB (PostgreSQL)]
```

## 5. Diagram Rationale
We selected the **"Log Workout"** flow for the Activity Diagram because it is the core intellectual transform of the system (taking raw user data and making it persistent) and involves a clear decision fork (validation success vs. failure). We chose **Registration** for the complex Sequence Diagram because it demonstrates an external service interaction (EmailService) and a potential loop (retry logic for sending emails), which accurately reflects common enterprise application concerns.
