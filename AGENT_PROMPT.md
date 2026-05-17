# Question Library Expansion Task

## Objective
Expand each of the 7 question JSON files to contain **exactly 100 questions** per category. You will receive the existing JSON files from the project.

## Categories & Files
1. `agriculture-science.json` - Agriculture Science
2. `basic-science.json` - Basic Science  
3. `basic-technology.json` - Basic Technology
4. `social-studies.json` - Social Studies
5. `civic-education.json` - Civic Education
6. `christian-religious-studies.json` - Christian Religious Studies
7. `computer-studies.json` - Computer Studies

## What to Do

For each file:

1. **Keep all existing real questions** - Do not modify or delete any questions that are complete (have proper text, options, correctIndex, and explanation)

2. **Replace [PLACEHOLDER] entries** - Find all questions with `[PLACEHOLDER]` text and replace them with real, complete questions following the format below

3. **Add new questions** - Create additional new questions until the total reaches exactly 100 per file

4. **Return the completed file** - Each file should be valid JSON with exactly 100 questions

## JSON Format

Each question must follow this exact structure:

```json
{
  "id": "prefix_###",
  "category": "category-name-with-hyphens",
  "question": "Your question text ending with a question mark?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Clear explanation of why the answer is correct and why other options are wrong.",
  "extraKokoFact": "Optional interesting related fact, or null"
}
```

## ID Naming Convention

Each question ID should use the category prefix and a 3-digit number:

- **agriculture-science**: `agric_001` to `agric_100`
- **basic-science**: `bsci_001` to `bsci_100`
- **basic-technology**: `btech_001` to `btech_100`
- **social-studies**: `sstu_001` to `sstu_100`
- **civic-education**: `cived_001` to `cived_100`
- **christian-religious-studies**: `crs_001` to `crs_100`
- **computer-studies**: `cstud_001` to `cstud_100`

## Quality Requirements

✓ Questions should test understanding, not just memorization  
✓ All 4 options must be plausible (avoid obviously wrong answers)  
✓ Explanations should be clear and educational  
✓ Use Nigerian context and examples where relevant  
✓ Align with Nigerian primary/secondary school curriculum  
✓ Cover diverse topics within each subject area  
✓ Each question must be unique (no duplicates)  

## Validation Checklist

Before submitting each file, verify:
- [ ] Exactly 100 questions total
- [ ] All IDs are unique and follow the naming convention
- [ ] All questions have exactly 4 options
- [ ] All `correctIndex` values are 0-3
- [ ] No `[PLACEHOLDER]` text remains anywhere
- [ ] JSON is valid and well-formed
- [ ] No duplicate questions
- [ ] All explanations are clear and complete

## Output

Return all 7 completed JSON files. Each file should be ready to be placed directly in `src/lib/data/questions/` to replace the existing file.
