# English Question Library Expansion Task

## Objective

Expand the English question library from its current state to exactly **125 questions**, with a specific breakdown across three subcategories:

1. **Comprehension (25 questions)**
   - 5 reading passages
   - 5 questions per passage
   - IDs: `eng_comp_001` through `eng_comp_025`

2. **Lexis & Structure (80 questions)**
   - Vocabulary, synonyms, antonyms
   - Grammar, sentence structure, punctuation
   - Idiomatic expressions, word usage
   - IDs: `eng_lex_001` through `eng_lex_080`

3. **Phonetics (20 questions)**
   - Sound identification and classification
   - Stress and intonation patterns
   - Phonetic transcription
   - Word pronunciation
   - IDs: `eng_phon_001` through `eng_phon_020`

## Current Status & What to Do

1. **Keep all existing valid questions** - Do not modify or delete any complete questions with full content
2. **Replace placeholder entries** - Find all `[PLACEHOLDER]` entries and replace with real, complete questions
3. **Expand each section** - Add new questions until each section reaches its target:
   - Comprehension: 25 questions (5 passages × 5 questions)
   - Lexis & Structure: 80 questions
   - Phonetics: 20 questions
4. **Return the completed file** - Ready for direct placement in `src/lib/data/questions/english.json`

## JSON Format - Comprehension Questions

Each comprehension question includes a passage. Questions 1-5 of each passage set share the same passage and `passageId`:

```json
{
  "id": "eng_comp_###",
  "category": "english",
  "subcategory": "comprehension",
  "passageId": "passage_###",
  "passage": "Full text of the reading passage (80–150 words for primary/secondary level). This SAME passage must be repeated for all 5 questions in the set. For example, if these are eng_comp_001 through eng_comp_005, they all use passage_goats. If eng_comp_006 through eng_comp_010, they all use passage_placeholder_002.",
  "question": "Your comprehension question about the passage above. Ends with a question mark?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Clear explanation referencing specific parts of the passage and why the answer is correct.",
  "extraKokoFact": null
}
```

**Comprehension Question Mapping:**
- **Passage 1** (passage_goats): `eng_comp_001` – `eng_comp_005` ✓ ALREADY COMPLETE
- **Passage 2** (passage_###): `eng_comp_006` – `eng_comp_010` (new passage required)
- **Passage 3** (passage_###): `eng_comp_011` – `eng_comp_015` (new passage required)
- **Passage 4** (passage_###): `eng_comp_016` – `eng_comp_020` (new passage required)
- **Passage 5** (passage_###): `eng_comp_021` – `eng_comp_025` (new passage required)

## JSON Format - Lexis & Structure Questions

Lexis & Structure questions focus on vocabulary, grammar, and sentence construction:

```json
{
  "id": "eng_lex_###",
  "category": "english",
  "subcategory": "lexis-structure",
  "question": "Your question about vocabulary, grammar, or sentence structure. Ends with a question mark?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Clear explanation of the correct answer choice and why other options are incorrect.",
  "extraKokoFact": null
}
```

**Lexis & Structure Question Types (distribute across 80 questions):**
- Synonyms and antonyms (20 questions)
- Grammar and sentence structure (25 questions)
- Cloze tests and word usage (15 questions)
- Idiomatic expressions and phrases (10 questions)
- Punctuation and capitalization (10 questions)

## JSON Format - Phonetics Questions

Phonetics questions test sound recognition, stress patterns, and pronunciation:

```json
{
  "id": "eng_phon_###",
  "category": "english",
  "subcategory": "phonetics",
  "question": "Your question about pronunciation, stress, or sound patterns. Ends with a question mark?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Clear explanation of phonetic patterns, pronunciation rules, or stress patterns.",
  "extraKokoFact": null
}
```

**Phonetics Question Types (distribute across 20 questions):**
- Vowel and consonant identification (5 questions)
- Word stress and syllable emphasis (5 questions)
- Pronunciation of similar-sounding words (5 questions)
- Phonetic transcription and symbols (5 questions)

## ID Naming Convention

Maintain strict ID numbering and format:

### Comprehension Questions
- IDs: `eng_comp_001` through `eng_comp_025` (25 questions total)
- Format: `eng_comp_###` where ### is a 3-digit number
- Passages: Each set of 5 questions uses one passage with unique `passageId`

### Lexis & Structure Questions
- IDs: `eng_lex_001` through `eng_lex_080` (80 questions total)
- Format: `eng_lex_###` where ### is a 3-digit number

### Phonetics Questions
- IDs: `eng_phon_001` through `eng_phon_020` (20 questions total)
- Format: `eng_phon_###` where ### is a 3-digit number

## Content Guidelines

### Comprehension (25 questions from 5 passages)

Each passage should be **80–150 words** and include:
- Clear narrative or informational structure
- Vocabulary appropriate for primary/secondary level
- Rich content for 5 diverse questions

**Passage Selection Guidelines:**
- Passage 1: ✓ ALREADY COMPLETE (The Two Goats Fable)
- Passage 2: A narrative about achievement or effort (adventure story, biography, or personal account)
- Passage 3: An informational passage about nature, science, or culture
- Passage 4: A passage about relationships, community, or social values
- Passage 5: A passage about education, discovery, or problem-solving

**Question Types for Each Passage Set (5 questions):**
1. **Literal comprehension** - Direct fact from the passage
2. **Inference & interpretation** - What can we infer from the passage?
3. **Vocabulary in context** - What does a word mean in the passage?
4. **Main idea/theme** - What is the overall message or title?
5. **Application/analysis** - How does the passage relate to real life?

**Comprehension Passages Should Include:**
- Nigerian context and relatable examples where possible
- Positive moral lessons or educational content
- Diverse topics (culture, history, environment, achievement)
- Clear, grammatically correct English
- Appropriate reading level for primary/secondary students

### Lexis & Structure (80 questions)

Distribute questions across these categories:

**Synonyms & Antonyms (20 questions)**
- "Choose the word NEAREST in meaning to..."
- "Choose the word OPPOSITE in meaning to..."
- Example: "DOUBTFUL is most nearly the same as... (a) uncertain (b) sure (c) confused (d) afraid"

**Grammar & Sentence Structure (25 questions)**
- Subject-verb agreement
- Tense usage (past, present, future, perfect)
- Pronoun reference and agreement
- Active and passive voice
- Conditional statements
- Example: "Which sentence is correct? (a) He go to school. (b) He goes to school. (c) He going to school. (d) He are going."

**Cloze Tests & Word Usage (15 questions)**
- Fill-in-the-blank with correct word
- Contextual word choice
- Example: "The weather is very ___. We need to stay indoors. (a) bright (b) harsh (c) calm (d) mild"

**Idiomatic Expressions (10 questions)**
- Common Nigerian English phrases
- British English idioms
- "To let the cat out of the bag" means...
- Example: "To 'break the ice' means to... (a) cause trouble (b) start a conversation (c) fail (d) freeze"

**Punctuation & Capitalization (10 questions)**
- Correct use of commas, periods, quotation marks
- Capitalization rules
- Apostrophes and contractions
- Example: "Which sentence is punctuated correctly? (a) "Hello," said Mary. (b) "Hello said Mary. (c) Hello said Mary." (d) "hello," said mary."

### Phonetics (20 questions)

**Vowel & Consonant Sounds (5 questions)**
- Identify the vowel sound in a word
- Consonant clusters and digraphs
- Example: "Which word has a different vowel sound from the others? (a) cat (b) bag (c) hot (d) map"

**Word Stress & Syllable Emphasis (5 questions)**
- Stress patterns in words
- How stress changes meaning
- Example: "Which word has the stress on the FIRST syllable? (a) record (b) present (c) import (d) permit"

**Pronunciation of Similar Words (5 questions)**
- Commonly mispronounced words
- Homophones and homonyms
- British vs. American pronunciation
- Example: "Which word is pronounced 'nolij'? (a) nowledge (b) knowledge (c) nowlege (d) nolage"

**Phonetic Transcription (5 questions)**
- Basic IPA symbols (optional for advanced level)
- Identifying which transcription matches a word
- Example: "The word 'phone' is pronounced as... (a) /foʊn/ (b) /fəʊn/ (c) /fone/ (d) /fɔːn/"

## Quality Requirements

✓ All questions must align with Nigerian JAMB/WAEC/NECO examination standards  
✓ Comprehension passages must be engaging, age-appropriate, and culturally relevant  
✓ Vocabulary should be at appropriate level (not too simple, not overly complex)  
✓ All 4 options must be plausible and realistic  
✓ Explanations must be clear, detailed, and reference the passage/context  
✓ Each question must be unique (no duplicates)  
✓ Include at least 20% of questions adapted from past JAMB/WAEC examination papers  
✓ Use proper British or Nigerian English spelling and grammar  
✓ Comprehension passages should promote critical thinking and moral development  
✓ Phonetics questions should follow standard pronunciation rules (preferably British RP or Nigerian English standard)

## Validation Checklist

Before submitting, verify:

- [ ] Exactly 125 questions total:
  - [ ] 25 comprehension questions (eng_comp_001 to eng_comp_025)
  - [ ] 80 lexis & structure questions (eng_lex_001 to eng_lex_080)
  - [ ] 20 phonetics questions (eng_phon_001 to eng_phon_020)

- [ ] All IDs are unique and follow the naming convention

- [ ] All questions have exactly 4 options

- [ ] All `correctIndex` values are 0–3

- [ ] **Comprehension section verified:**
  - [ ] 5 passages with unique `passageId`s
  - [ ] Each passage has exactly 5 questions
  - [ ] All 5 questions in a passage set use the SAME passage text
  - [ ] All 5 questions in a passage set have the SAME `passageId`
  - [ ] Question 1 of each set is direct comprehension
  - [ ] Question 2–5 test different skills (inference, vocabulary, theme, application)

- [ ] **Lexis & Structure section verified:**
  - [ ] ~20 questions on synonyms/antonyms
  - [ ] ~25 questions on grammar/sentence structure
  - [ ] ~15 questions on cloze/word usage
  - [ ] ~10 questions on idioms
  - [ ] ~10 questions on punctuation

- [ ] **Phonetics section verified:**
  - [ ] ~5 questions on vowel/consonant sounds
  - [ ] ~5 questions on word stress
  - [ ] ~5 questions on pronunciation of similar words
  - [ ] ~5 questions on phonetic transcription

- [ ] No `[PLACEHOLDER]` text remains anywhere

- [ ] JSON is valid and well-formed

- [ ] All explanations are clear and complete

- [ ] All passages are 80–150 words

- [ ] At least 20% of questions sourced from/adapted from past examination papers

- [ ] Comprehension passages are engaging and age-appropriate

## Output

Provide **one completed output**:

**Completed english.json file** - Ready for direct placement in `src/lib/data/questions/english.json`

The JSON must be valid, properly formatted, with all 125 questions structured exactly as specified above and ready for immediate application in the KokoPrep platform.
