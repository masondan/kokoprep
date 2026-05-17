# Mathematics Question Library Expansion Task

## Objective

Expand the Mathematics question library from its current state to exactly **100 questions**, with a specific breakdown:
- **80 text-based questions** (no diagrams)
- **20 diagram-based questions**:
  - 10 Mathematics diagram questions
  - 10 Quantitative Reasoning diagram questions

## Current Status & What to Do

1. **Keep all existing text-based questions** - Do not modify or delete any complete, non-placeholder text questions
2. **Replace or expand** placeholder entries with real questions
3. **Create new text-based questions** until text-based total reaches 80
4. **Create 20 diagram-based questions** with corresponding diagram files
5. **Return the completed file** ready for direct placement in `src/lib/data/questions/mathematics.json`

## JSON Format for Text-Based Questions

Each text-based question must follow this exact structure:

```json
{
  "id": "math_###",
  "category": "mathematics",
  "difficulty": "easy|medium|hard",
  "question": "Your question text ending with a question mark?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Clear explanation of why the answer is correct and why other options are incorrect.",
  "extraKokoFact": "Optional interesting related mathematical fact, or null"
}
```

## JSON Format for Diagram-Based Questions

Diagram-based questions follow the same structure but include a `diagramFile` field:

### Mathematics Diagram Questions
```json
{
  "id": "math_diag_###",
  "category": "mathematics",
  "difficulty": "easy|medium|hard",
  "diagramFile": "static/images/diagrams/mathematics/math_diag_###.png",
  "question": "Your question text referring to the diagram above. Ends with a question mark?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Clear explanation referencing the diagram and why the answer is correct.",
  "extraKokoFact": null
}
```

### Quantitative Reasoning Diagram Questions
```json
{
  "id": "qr_diag_###",
  "category": "mathematics",
  "subcategory": "quantitative-reasoning",
  "difficulty": "easy|medium|hard",
  "diagramFile": "static/images/diagrams/quantitative-reasoning/qr_diag_###.png",
  "question": "Your question text referring to the diagram above. Ends with a question mark?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Clear explanation referencing the diagram and why the answer is correct.",
  "extraKokoFact": null
}
```

## ID Naming Convention

Maintain strict ID numbering:

### Text-Based Questions
- IDs: `math_001` through `math_080` (80 questions total)
- Format: `math_###` where ### is a 3-digit number

### Mathematics Diagram-Based Questions
- IDs: `math_diag_001` through `math_diag_010` (10 questions total)
- Format: `math_diag_###` where ### is a 3-digit number
- Diagram files: `static/images/diagrams/mathematics/math_diag_001.png` through `static/images/diagrams/mathematics/math_diag_010.png`

### Quantitative Reasoning Diagram-Based Questions
- IDs: `qr_diag_001` through `qr_diag_010` (10 questions total)
- Format: `qr_diag_###` where ### is a 3-digit number
- Diagram files: `static/images/diagrams/quantitative-reasoning/qr_diag_001.png` through `static/images/diagrams/quantitative-reasoning/qr_diag_010.png`

## Diagram Requirements

### Mathematics Diagrams (10 total)
Create diagrams for these topics and save with exact filenames:
- `math_diag_001.png` - Geometry (angles, shapes, or polygons)
- `math_diag_002.png` - Circle properties (radius, diameter, tangent, or arc)
- `math_diag_003.png` - Triangle geometry (altitude, median, or special triangles)
- `math_diag_004.png` - Quadrilateral properties (parallelogram, trapezoid, rhombus)
- `math_diag_005.png` - 3D shapes (cube, cuboid, prism, pyramid, cylinder)
- `math_diag_006.png` - Angle relationships (vertically opposite, adjacent, supplementary)
- `math_diag_007.png` - Construction diagram (perpendicular bisector, angle bisector)
- `math_diag_008.png` - Coordinate geometry (points on Cartesian plane)
- `math_diag_009.png` - Graph of mathematical function (linear, quadratic, or trigonometric)
- `math_diag_010.png` - Data representation (chart, graph, or statistical diagram)

**Diagram specifications:**
- Format: PNG, JPEG, or SVG
- Dimensions: 500×400 pixels (minimum: 400×300)
- Resolution: 96 DPI
- Color mode: RGB
- Background: White or transparent
- Content: Clear, professional diagrams with labeled parts
- Text size: Readable at 500px width

### Quantitative Reasoning Diagrams (10 total)
Create diagrams for logical reasoning and data interpretation:
- `qr_diag_001.png` - Venn diagram (set operations)
- `qr_diag_002.png` - Logic diagram or truth table visualization
- `qr_diag_003.png` - Pattern or sequence diagram
- `qr_diag_004.png` - Probability tree or probability diagram
- `qr_diag_005.png` - Matrix or table with data
- `qr_diag_006.png` - Bar chart or histogram with data
- `qr_diag_007.png` - Line graph with multiple data series
- `qr_diag_008.png` - Pie chart with segments
- `qr_diag_009.png` - Flow chart or decision tree
- `qr_diag_010.png` - Comparison diagram (ratio, proportion, or scaling)

**Diagram specifications:** Same as mathematics diagrams above.

## Content Guidelines

### Text-Based Questions (80 total)
Cover these Nigerian curriculum topics:

**Arithmetic & Number Theory (12 questions)**
- Whole numbers, place value, rounding
- Prime numbers, factors, multiples, HCF, LCM
- Fractions, decimals, percentages
- Ratio and proportion
- Number bases and conversions

**Geometry (15 questions)**
- Points, lines, angles, and angle relationships
- Plane shapes: triangles, quadrilaterals, circles
- Perimeter and area calculations
- Properties of 2D shapes
- 3D shapes: cubes, cuboids, prisms, pyramids, cylinders, cones

**Mensuration (10 questions)**
- Length, mass, capacity, temperature conversions
- Area and perimeter formulas
- Volume and surface area of 3D shapes
- Scale drawings

**Algebra (15 questions)**
- Variables and expressions
- Equations and inequalities
- Linear equations (one and two variables)
- Sequences and series
- Algebraic manipulation and factorization

**Statistics & Probability (8 questions)**
- Data collection and representation
- Mean, median, mode, range
- Frequency distributions
- Probability of events
- Independent and dependent events

**Trigonometry & Functions (10 questions)**
- Trigonometric ratios (sin, cos, tan)
- Graph plotting and interpretation
- Function notation and evaluation
- Transformation of graphs

**Set Theory & Logic (10 questions)**
- Set notation and operations
- Venn diagrams
- Logical statements and reasoning
- Truth values

### Diagram-Based Questions (20 total)
- 10 Mathematics diagrams requiring geometric or spatial reasoning
- 10 Quantitative Reasoning diagrams requiring data interpretation and logical deduction
- All diagrams must be clear, labeled, and understandable
- Questions should test interpretation skills, not just recall

## Quality Requirements

✓ All questions must align with Nigerian JAMB/WAEC/NECO curriculum standards  
✓ Questions should test understanding and application, not just memorization  
✓ All 4 options must be plausible and realistic  
✓ Explanations must be clear, detailed, and educational  
✓ Use Nigerian context and examples where relevant  
✓ Difficulty distribution: ~25% easy, ~50% medium, ~25% hard  
✓ Each question must be unique (no duplicates)  
✓ Include at least 20% of questions adapted from past JAMB/WAEC examination papers  
✓ Diagram-based questions must require the diagram to solve correctly  
✓ All extraKokoFact fields should contain interesting, age-appropriate mathematical facts where possible

## Validation Checklist

Before submitting, verify:

- [ ] Exactly 100 questions total:
  - [ ] 80 text-based questions (math_001 to math_080)
  - [ ] 10 mathematics diagram questions (math_diag_001 to math_diag_010)
  - [ ] 10 quantitative reasoning diagram questions (qr_diag_001 to qr_diag_010)

- [ ] All IDs are unique and follow the naming convention

- [ ] All questions have exactly 4 options

- [ ] All `correctIndex` values are 0–3

- [ ] All text-based questions have `"difficulty": "easy"|"medium"|"hard"`

- [ ] All diagram questions have `"diagramFile"` pointing to correct file paths:
  - `static/images/diagrams/mathematics/math_diag_###.png`
  - `static/images/diagrams/quantitative-reasoning/qr_diag_###.png`

- [ ] No `[PLACEHOLDER]` text remains anywhere

- [ ] JSON is valid and well-formed

- [ ] No duplicate questions

- [ ] All explanations reference diagrams for diagram-based questions

- [ ] Diagram files are created and saved with exact filenames in correct folders

- [ ] At least 20% of questions sourced from/adapted from past examination papers

## Output

Provide **two outputs**:

1. **Completed mathematics.json file** - Ready for direct placement in `src/lib/data/questions/`

2. **Diagram image files** - 20 PNG/JPEG/SVG files ready for placement:
   - 10 files in `static/images/diagrams/mathematics/` (named math_diag_001.png through math_diag_010.png)
   - 10 files in `static/images/diagrams/quantitative-reasoning/` (named qr_diag_001.png through qr_diag_010.png)

The JSON must be valid, properly formatted, and ready for immediate use in the application.
