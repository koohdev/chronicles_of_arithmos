# 4.0 Methodology

## 4.1 Prototyping Model

According to Geeks for Geeks the Prototyping Model is a branch of the SDLC. It is basically making a bare bones version before the final game. This helps when the proponents do not have a super detailed plan at the start. Proponents can just build a simple version to get feedback and fix the code logic before wasting time on final product [6].

![Figure No. 7 : Prototyping Model]()

The proponents went with the Prototyping Model because the math inside Chronicles of Arithmos is just too messy to figure out on paper. Specific numbers like how fast a timer runs or how hard a monster hits have to be tested to make sure they are not too tough for players playing Chronicles of Arithmos. If the proponents used a stiff plan like the Waterfall Model, they could not change those values easily later. Instead, this model lets the proponents fix the balance based on what the students or young learners say while they are actually playing the game.

The following are the phases of the Prototyping Model:

### 4.1.1 Requirements Gathering

In this phase, the proponents looked at the DepEd math lessons for young learners in Grade 4 to 6 to see what math to put in. They looked at basic plus and minus plus the harder PEMDAS too. The proponents also played Prodigy Math to see what their own game should do. By the end they had a list of what the game needs and what math to put in Chronicles of Arithmos.

### 4.1.2 Quick Design

In the next phase, the proponents made flowcharts and drawings to show how the game and buttons would look. These drawings show how a player goes from the menu to a fight. They also made storyboards for the Forest and Desert and other areas to plan where the monsters live and how the maps connect to each other.

### 4.1.3 Building Prototype

The proponents used RPG Maker MZ to make the first or initial version, RPG Maker MZ allows the  to make maps and monster stats. The proponents wrote a custom plugin script in JavaScript so the game can give math problems and check if the player is right. They also added a timer for the fights and used PeerJS so players can invite friends to play together. They finished the first few maps like the Forest to start with.

### 4.1.4 Customer Evaluation of Prototype

The proponents will find 10 students or young learners aged 9 to 12 typically from Grade 4 to 6 to play the game. The proponents will watch them to see if the game is easy or if the math is too hard to read. What the young learners or children say will help the proponents decide what to fix before they make the next version.

### 4.1.5 Refining Prototype

After the young learners play it, the proponents will fix the game and do the whole design and build part all over again. This happens two times. The proponents will change how hard the monsters are if they are too easy or too tough. They will also fix the buttons if they are too small for a phone screen and fix the multiplayer part.

### 4.1.6 Engineer Product

In the last phase, the proponents will make a final version that works on computers assuming the computers have the specific requirements needed, and on modern browsers. The proponents will check one last time to make sure the math and the multiplayer part works. Then they will put the game online and make a file or the .exe file so it can be downloaded and be played.

## 4.2 Requirements Specification

### 4.2.1 Operational Feasibility

#### A. Fishbone Diagram

![Figure No. 8: Fishbone Diagram]()

#### B. Functional Decomposition Diagram

![Figure No. 9: Functional Decomposition Diagram]()

### 4.2.2 Technical Feasibility

#### 4.2.2.1 Compatibility Checking

##### A. Hardware Compatibility

The proponents made the game with RPG Maker MZ. It runs on computers with assuming the computers have 8 GB of RAM and the proponents checked that an Intel Core i3 can handle it. Since there is a web version too, it works on tablets or any computer with a modern browser. This lets players jump into the math battles without downloading any executable files.

##### B. Software Compatibility

Since RPG Maker MZ runs on JavaScript, the math engine was built using that same language. This letss the math logic and the combat mechanics work together without needing any extra fixes or translations or conversion of code to another programming language. For the multiplayer part, the proponents used PeerJS so players can just use room codes to connect. This way, the game allows player to play without needing a server to run everything.

#### 4.2.2.2 Relevance of the Technology

Prodigy and Math Blaster are basically a turn-based RPGs where math is the button the player presses to attack. Players get the answer right, the animation plays, and that’s it. It’s a bit disconnected. Chronicles of Arithmos actually ties your brain speed to the sword swing, in a sense, the player solving math is equivalent to a sword swing. Instead of just "Right = Hit," it uses a Performance-Based Reward system. If a player is really good ath math and accurate too, players can pull off a 2.0x Critical Hit. If the player is slow and stumble, the player might totally miss.

JavaScript (ES6) was chosen because it is the native scripting language of RPG Maker MZ, allowing the proponents to implement the Math Battle Engine and Content-Aware Timer without external dependencies. PeerJS, a WebRTC (Web Real-Time Communication) library, was selected for the multiplayer module as it enables direct Peer-to-Peer connections through room codes without requiring a dedicated server.

The proposed title deploys as a Windows desktop application via NW.js (Node Webkit) and as a web application hosted on Hostinger using HTML5 and Web Graphics Library (WebGL). Desktop is the primary platform because the Math Battle System requires timed numerical input through a physical keyboard, which touchscreens cannot replicate due to the absence of a physical key-press sensation (haptic feedback). The desktop executable can also operate offline using a computer. The web deployment serves as a secondary access point, supported by the Virtual Numeric Keypad module for touch-enabled devices.

### 4.2.3 Schedule Feasibility

#### A. Gantt Chart

##### Table #1 November 2025 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Capstone Orientation | | | | |
| 2.Grouping of Capstone Members | | | | |
| 3.Planning and Brainstorming | | | | |
| 4.Capstone Adviser Selection | | | | |

##### Table #2 December 2025 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Requirements Gathering | | | | |
| 2.Quick Design | | | | |

##### Table #3 January 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Building Initial Prototype | | | | |
| 2.Preparation for Title Defense | | | | |
| 3.Title Defense | | | | |
| 4.Capstone Adviser Consultation | | | | |
| 5.Dean Consultation | | | | |
| 6.Documentation (Chapter 1) | | | | |

##### Table #4 February 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Documentation (Chapter 2) | | | | |
| 2.Documentation (Chapter 3) | | | | |
| 3.Capstone Adviser Consultations | | | | |
| 4.Documentation (Chapter 4) | | | | |

##### Table #5 March 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Building Initial Prototype (Continued) | | | | |
| 2.AI & Plagiarism Checking | | | | |
| 3.AI & Plagiarism Checking | | | | |
| 4.Preparation for Oral Defense | | | | |
| 5.Oral Defense | | | | |

##### Table #6 April 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Customer Evaluation of Prototype | | | | |
| 2.Refining Prototype | | | | |
| 3.Quick Design | | | | |

##### Table #7 May 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Building Prototype | | | | |
| 2.Customer Evaluation of Prototype | | | | |
| 3.Capstone Adviser Consultation | | | | |

##### Table #8 June 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Refining Prototype | | | | |
| 2.Capstone Adviser Consultation | | | | |

##### Table #9 July 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.Unit Testing | | | | |
| 2.Integration Testing | | | | |
| 3.Capstone Adviser Consultation | | | | |

##### Table #10 August 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 1.System Testing | | | | |
| 2.Acceptance Testing | | | | |
| 3.Engineer Product | | | | |
| 4.Implementation Plan | | | | |
| 5.Capstone Adviser Consultation | | | | |

##### Table #11 September 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 6.Engineer Product (Continued) | | | | |
| 7.Final Documentation (Chapter 5) | | | | |
| 8.Capstone Adviser Consultation | | | | |
| 9.Updating, Reviewing, and Revision of the whole document | | | | |

##### Table #12 October 2026 Gantt Chart

| Activities | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| 10.Capstone 2 Defense | | | | |

### 4.2.4 Economic Feasibility

#### 4.2.4.1 Cost and Benefit Analysis

The cost and benefit analysis provides a breakdown of the materials required for development and the specific value each item brings to the study. The proponents have categorized these costs into software and hosting expenses.

##### Table #13 Cost and Benefits Table

| Category | Item | Cost | Benefits |
|---|---|---|---|
| Software | RPG Maker MZ (2 License) | ₱4,600.00 | Allows the proponents to develop and test the game concurrently, and provides a built-in event system, and map editor that can reduce the time needed to build the Active Time Battle (ATB) interface and Math Engine from scratch. |
| Hosting | Hostinger Domain & Web Hosting (5 years) | ₱12,108.00 | Allows students to access the game from home through a web browser without requiring a separate installation or a computer |
| TOTAL | Investment Required | ₱16.708.00 | |

#### 4.2.4.2 Cost Recovery Scheme

The proponents personally fund the total development cost of ₱16,708.00 since the project is part of their academic requirements. Chronicles of Arithmos stays completely free for students and teachers so they can practice their arithmetic without paying for access. To recover the development costs and pay for the Hostinger servers after the five-year plan expires, the proponents plan to set up a voluntary donation page like Patreon or "Buy Me a Coffee" where parents can send financial support if they like the game.

### 4.2.5 Requirements Modeling

#### 4.2.5.1 Object Modelling

##### A. Use Case Diagrams

![Figure No. 10:  Young Learner Use Case Diagrams]()

##### B. Sequence Diagrams

![Figure No. 9:  Auto Quest Sequence Diagram]()
![Figure No. 10:  Enemy Auto-Scaling Sequence Diagram]()
![Figure No. 11:   Level-Based Progression Sequence Diagram]()
![Figure No. 12:  Math Battle System Sequence Diagram]()
![Figure No. 13:  P2P Multiplayer Sequence Diagram]()
![Figure No. 14:  Save Sequence Diagram]()

##### C. Activity Diagrams

![Figure No. 15: Game Loop Chronicles of Arithmos  Activity Diagram]()

### 4.2.6 Risk Assessment/Analysis

Developing Chronicles of Arithmos comes with risks that the proponents have identified and prepared for. The proponents have limited experience with JavaScript and PeerJS, which may cause technical delays in building the Math Battle System and multiplayer features and differences between the desktop, web, and mobile versions may cause inconsistencies. The large project scope may lead to schedule delays, while players or young learners may lose interest if math overshadows the gameplay.

External dependencies such as PeerJS and NW.js may receive breaking updates, and students' computers may lack adequate hardware or internet access. To reduce these risks, the proponents will study online resources and consult the proponents Capstone Adviser for guidance, Mr. Jan Nicole B. Apostol, lock software versions during development, prioritize core features first with remaining items as stretch goals, review early prototypes for gameplay balance, offer an offline single-player option via windows executable application as a fallback when students are not playing via the web application.

## 4.3 Design

### 4.3.1 Output and User-interface Design

The proponents designed the interface for Chronicles of Arithmos using a 2D pixel art style for all game assets and entities. The color scheme uses deep blue (#005385) for menu outlines and for active buttons that are currently pressed. Black (#000000) serves as the background color for all buttons and menu windows. White (#FFFFFF) is used for all text, mathematical equations, and numerical values.

(Hex: #005385) (Hex: #000000) (Hex: #FFFFFF)

![Figure No. 16 : Dark Blue, Black and White]()

The proponents chose the M+ 1m regular font as it is a typeface made for clear reading with uses that range from digital signs and multilingual systems, to computer screens and tools for writing code.

![Figure No. 17: M+ 1m regular Font]()

## REFERENCES

[1] B. Bruckman, "The 'Chocolate-Covered Broccoli' Problem," International Journal of Game-Based Learning, vol. 3, no. 2, pp. 1-15, 2013. [Online]. Available: <https://www.google.com/search?q=https://www.researchgate.net/publication/220968132_The_Chocolate-Covered_Broccoli_Problem>

[2] M. Csikszentmihalyi, Flow: The Psychology of Optimal Experience. New York, NY: Harper & Row, 1990. [Online]. Available: <https://www.HarperCollins.com/products/flow-mihaly-csikszentmihalyi>

[3] F. C. Richardson and R. M. Suinn, "The Mathematics Anxiety Rating Scale: Psychometric data," Journal of Counseling Psychology, vol. 19, no. 6, pp. 551–554, 1972. [Online]. Available: <https://psycnet.apa.org/record/1973-09757-001>

[4] M. H. Ashcraft, "Math anxiety: Personal, educational, and cognitive consequences," Current Directions in Psychological Science, vol. 11, no. 5, pp. 181–185, 2002. [Online]. Available: <https://journals.sagepub.com/doi/10.1111/1467-8721.00196>

[5] J. P. Gee, What Video Games Have to Teach Us About Learning and Literacy. New York, NY: Palgrave Macmillan, 2003. [Online]. Available: <https://link.springer.com/book/10.1007/978-1-137-52660-3>

[6] "Prototyping Model - Software Engineering," GeeksforGeeks, Jul. 11, 2025. [Online]. Available: <https://www.geeksforgeeks.org/software-engineering/software-engineering-prototyping-model/>
