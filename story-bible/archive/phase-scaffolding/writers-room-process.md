# TETHER Writers Room Process
## How This Development System Works

---

## OVERVIEW

This story bible is developed using a simulated writers room structure that mirrors professional screenwriting hierarchies. The system is designed to:

1. **Generate diverse creative options** through parallel ideation
2. **Filter and refine** through managerial curation
3. **Preserve creative authority** with the Executive Producer (you)
4. **Maintain documentation** for context and future reference

---

## THE CHAIN OF COMMAND

### Executive Producer (You)
- Makes all major creative decisions
- Presented with curated options (2-4 choices per decision point)
- Can approve, reject, or send back to the drawing board
- Final authority on story direction

### Writing Manager (Claude)
- Coordinates the development process
- Synthesizes pitches from story agents into coherent options
- Writes approved content into formal documents
- Maintains continuity and tracks decisions

### Story Agents (Specialized Sub-processes)
- Generate rapid creative pitches
- Explore different angles on each problem
- Work in parallel for efficiency
- Each agent brings a different perspective or approach

---

## THE WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    DECISION POINT                           │
│         (e.g., "What is the conspiracy?")                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AGENT IDEATION                           │
│    Multiple agents pitch different approaches in parallel   │
│    Each generates 2-3 quick concepts with rationale         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  MANAGER CURATION                           │
│    - Reviews all pitches                                    │
│    - Selects strongest 2-4 options                          │
│    - Writes them up clearly with pros/cons                  │
│    - Documents in appropriate phase folder                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               EXECUTIVE PRODUCER DECISION                   │
│    - Presented with curated options                         │
│    - Selects preferred direction OR                         │
│    - Requests new approaches OR                             │
│    - Provides guidance for revision                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FORMAL WRITE-UP                          │
│    - Approved direction written into canon document         │
│    - Decision logged in decision-log.md                     │
│    - Work logged in work-log.md                             │
└─────────────────────────────────────────────────────────────┘
```

---

## FOLDER STRUCTURE

```
story-bible/
├── _system/                    # Process documentation
│   ├── writers-room-process.md # This file
│   ├── decision-log.md         # All EP decisions, with reasoning
│   └── work-log.md             # Chronological work record
│
├── phase-0-foundation/         # Load-bearing decisions
│   ├── conspiracy/
│   │   ├── pitches/            # Agent pitches (kept for reference)
│   │   └── conspiracy.md       # APPROVED conspiracy definition
│   ├── inciting-incident/
│   │   ├── pitches/
│   │   └── inciting-incident.md
│   └── ending/
│       ├── pitches/
│       └── ending-manifesto.md
│
├── phase-1-characters/
│   ├── kael-vasaro/
│   ├── marcus-oyelaran/
│   ├── supporting-cast/
│   └── antagonists/
│
├── phase-2-world/
│   ├── earth-2147/
│   ├── space-margin/
│   └── historical-timeline/
│
├── phase-3-plot/
│   ├── beat-sheet/
│   ├── scene-outline/
│   └── investigation-thread/
│
├── phase-4-narrative/
│   ├── key-scenes/
│   ├── dialogue-samples/
│   └── found-text/
│
├── phase-5-player-experience/
│   ├── choice-architecture/
│   ├── dialogue-system/
│   └── exploration-rewards/
│
├── phase-6-integration/
│   ├── continuity-bible/
│   ├── tone-guide/
│   └── master-story-bible/
│
└── phase-7-validation/
    ├── stress-testing/
    └── expansion-planning/
```

---

## DOCUMENT TYPES

### Pitch Documents (in `/pitches/` folders)
- Quick, informal
- Multiple options per file
- Include rationale for each
- Preserved even after decisions made (for future reference)

### Canon Documents (approved content)
- Formal, polished
- Single source of truth
- Updated only through EP approval
- Version controlled

### Log Documents
- `decision-log.md`: What was decided, when, and why
- `work-log.md`: What work was done, in what order

---

## DECISION PRESENTATION FORMAT

When presenting options to the Executive Producer:

```markdown
## DECISION REQUIRED: [Topic]

### Context
[Brief summary of what needs to be decided and why it matters]

### Option A: [Name]
**Summary:** [2-3 sentences]
**Strengths:** [Bullet points]
**Risks:** [Bullet points]
**Implications:** [What this means for other story elements]

### Option B: [Name]
[Same structure]

### Option C: [Name] (if applicable)
[Same structure]

### Recommendation
[Manager's assessment of which option best serves the story, with reasoning]
```

---

## PRINCIPLES

1. **Preserve Creative Authority**: The EP makes all meaningful creative choices. The system generates options and provides analysis, never makes final calls.

2. **Document Everything**: Rejected ideas may become valuable later. Keep pitches. Log decisions with reasoning.

3. **Limit Context by Folder**: Each phase has its own space. Cross-reference by linking, not duplicating.

4. **Build on Locked Foundations**: Phase 0 must be complete before Phase 1 begins. Each phase builds on the previous.

5. **Quality over Speed**: Better to present 3 strong options than 6 mediocre ones.

6. **Honesty over Agreement**: If an option has problems, say so. The EP benefits from clear analysis, not flattery.

---

## GETTING STARTED

Phase 0 begins with three critical decisions:
1. **The Conspiracy** - What did Marcus discover?
2. **The Inciting Incident** - What makes Kael look Marcus up?
3. **The Ending** - What does victory look like?

Everything else is built on these pillars.

---

*"Someone has to."*
