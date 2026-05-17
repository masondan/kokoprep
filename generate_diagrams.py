import os
from PIL import Image, ImageDraw, ImageFont

# Define path configurations based on requirements
MATH_DIR = "static/images/diagrams/mathematics"
QR_DIR = "static/images/diagrams/quantitative-reasoning"

os.makedirs(MATH_DIR, exist_ok=True)
os.makedirs(QR_DIR, exist_ok=True)

def create_base_canvas():
    # Specifications: 500x400 pixels, RGB color mode, crisp white background
    return Image.new("RGB", (500, 400), "white")

def draw_text_fallback(draw, text, position, size=16):
    # Safe generic font rendering
    draw.text(position, text, fill="black")

# -------------------------------------------------------------
# MATHEMATICS DIAGRAMS GENERATION (math_diag_001 to math_diag_010)
# -------------------------------------------------------------

# math_diag_001: Geometry (Triangle with 60, 70, y angles)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.polygon([(100, 320), (400, 320), (280, 100)], outline="black", width=3)
d.text((130, 290), "60°", fill="blue")
d.text((340, 290), "70°", fill="blue")
d.text((270, 130), "y", fill="red")
d.text((20, 20), "math_diag_001: Triangle Geometry", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_001.png"))

# math_diag_002: Circle Properties (Radius 14cm)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.ellipse([(100, 70), (380, 350)], outline="black", width=3)
d.line([(240, 210), (340, 140)], fill="black", width=3)
d.ellipse([(237, 207), (243, 213)], fill="black") # center O
d.text((225, 215), "O", fill="black")
d.text((345, 130), "Q", fill="black")
d.text((280, 155), "14cm", fill="blue")
d.text((20, 20), "math_diag_002: Circle Properties", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_002.png"))

# math_diag_003: Triangle Geometry (Pythagorean 3-4-5)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.polygon([(150, 100), (150, 300), (350, 300)], outline="black", width=3)
d.rectangle([(150, 285), (165, 300)], outline="black", width=2) # right-angle symbol
d.text((120, 190), "3cm", fill="black")
d.text((240, 315), "4cm", fill="black")
d.text((250, 180), "x", fill="red")
d.text((20, 20), "math_diag_003: Right-Angled Triangle", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_003.png"))

# math_diag_004: Quadrilateral Properties (Parallelogram)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.polygon([(150, 120), (400, 120), (320, 280), (70, 280)], outline="black", width=3)
d.text((100, 250), "110°", fill="blue")
d.text((300, 140), "x", fill="red")
d.text((20, 20), "math_diag_004: Parallelogram Geometry", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_004.png"))

# math_diag_005: 3D Cylinder Shape
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.ellipse([(160, 80), (340, 140)], outline="black", width=3)
d.ellipse([(160, 280), (340, 340)], outline="black", width=3)
d.line([(160, 110), (160, 310)], fill="black", width=3)
d.line([(340, 110), (340, 310)], fill="black", width=3)
d.line([(250, 110), (340, 110)], fill="blue", width=2) # radius line
d.text((280, 90), "r = 7cm", fill="blue")
d.text((360, 200), "h = 10cm", fill="black")
d.text((20, 20), "math_diag_005: 3D Cylinder Shape", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_005.png"))

# math_diag_006: Angle Relationships (Vertically Opposite)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.line([(50, 100), (450, 300)], fill="black", width=3)
d.line([(50, 300), (450, 100)], fill="black", width=3)
d.text((140, 190), "125°", fill="blue")
d.text((320, 190), "x", fill="red")
d.text((20, 20), "math_diag_006: Vertically Opposite Angles", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_006.png"))

# math_diag_007: Construction Diagram (Angle Bisector)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.line([(100, 300), (400, 300)], fill="black", width=3) # Base BC
d.line([(100, 300), (300, 100)], fill="black", width=3) # Line BA
d.line([(100, 300), (380, 200)], fill="green", width=2) # Bisector Ray
d.arc([(70, 270), (150, 330)], 300, 360, fill="gray", width=2) # construction arc
d.text((85, 305), "B", fill="black")
d.text((390, 305), "C", fill="black")
d.text((290, 85), "A", fill="black")
d.text((150, 270), "x", fill="red")
d.text((20, 20), "math_diag_007: Construction Angle Bisector", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_007.png"))

# math_diag_008: Coordinate Geometry (Cartesian Point)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.line([(50, 300), (450, 300)], fill="black", width=2) # X-Axis
d.line([(100, 50), (100, 350)], fill="black", width=2) # Y-Axis
d.line([(280, 120), (280, 300)], fill="gray", width=1)
d.line([(100, 120), (280, 120)], fill="gray", width=1)
d.ellipse([(276, 116), (284, 124)], fill="red") # Point P
d.text((290, 110), "P", fill="black")
d.text((275, 310), "3", fill="blue")
d.text((80, 115), "4", fill="blue")
d.text((85, 305), "0", fill="black")
d.text((430, 310), "X", fill="black")
d.text((115, 55), "Y", fill="black")
d.text((20, 20), "math_diag_008: Cartesian Coordinate Geometry", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_008.png"))

# math_diag_009: Graph of Function (Linear Graph)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.line([(50, 320), (450, 320)], fill="black", width=2) # X axis
d.line([(100, 50), (100, 350)], fill="black", width=2) # Y axis
d.line([(80, 335), (380, 80)], fill="blue", width=3) # Plotted Line Graph
d.line([(250, 200), (250, 320)], fill="gray", width=1)
d.line([(100, 200), (250, 200)], fill="gray", width=1)
d.text((245, 330), "2", fill="black")
d.text((80, 195), "4", fill="black")
d.text((20, 20), "math_diag_009: Linear Graph Function Mapping", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_009.png"))

# math_diag_010: Data Representation (Bar Chart)
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.line([(80, 320), (450, 320)], fill="black", width=2) # Horizontal axis
d.line([(80, 80), (80, 320)], fill="black", width=2)  # Vertical axis
# Draw Bars
d.rectangle([(120, 200), (160, 320)], fill="lightblue", outline="black") # Ade (5)
d.rectangle([(200, 110), (240, 320)], fill="orange", outline="black")    # Ngozi (8)
d.rectangle([(280, 230), (320, 320)], fill="lightblue", outline="black") # Olu (4)
d.text((125, 330), "Ade", fill="black")
d.text((202, 330), "Ngozi", fill="black")
d.text((285, 330), "Olu", fill="black")
d.text((60, 105), "8", fill="black")
d.text((60, 195), "5", fill="black")
d.text((60, 225), "4", fill="black")
d.text((20, 20), "math_diag_010: Bar Chart Representation", fill="gray")
img.save(os.path.join(MATH_DIR, "math_diag_010.png"))


# -------------------------------------------------------------
# QUANTITATIVE REASONING DIAGRAMS GENERATION (qr_diag_001 to qr_diag_010)
# -------------------------------------------------------------

# qr_diag_001: Venn Diagram
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.rectangle([(40, 60), (460, 340)], outline="black", width=2) # Universal Set box
d.ellipse([(120, 100), (300, 280)], outline="black", width=2) # Circle A
d.ellipse([(220, 100), (400, 280)], outline="black", width=2) # Circle B
d.text((130, 80), "A", fill="black")
d.text((350, 80), "B", fill="black")
d.text((50, 70), "ξ", fill="black")
d.text((170, 180), "10", fill="blue")
d.text((255, 180), "5", fill="blue")
d.text((330, 180), "7", fill="blue")
d.text((420, 300), "8", fill="red")
d.text((20, 20), "qr_diag_001: Set Operations Venn Diagram", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_001.png"))

# qr_diag_002: Logic Grid Matrix
img = create_base_canvas()
d = ImageDraw.Draw(img)
# Draw a neat 3x3 table grid box
for i in range(4):
    d.line([(130 + i*80, 100), (130 + i*80, 340)], fill="black", width=2)
    d.line([(130, 100 + i*80), (370, 100 + i*80)], fill="black", width=2)
# Row values
d.text((165, 130), "4", fill="black")
d.text((245, 130), "9", fill="black")
d.text((325, 130), "2", fill="black")
d.text((165, 210), "3", fill="black")
d.text((245, 210), "5", fill="black")
d.text((325, 210), "7", fill="black")
d.text((165, 290), "8", fill="black")
d.text((245, 290), "1", fill="black")
d.text((325, 290), "x", fill="red")
d.text((20, 20), "qr_diag_002: Mathematical Logic Matrix", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_002.png"))

# qr_diag_003: Pattern Sequence Diagram
img = create_base_canvas()
d = ImageDraw.Draw(img)
# Render dot group patterns step by step
d.text((60, 250), "Step 1", fill="black")
d.text((60, 265), "(4 dots)", fill="black")
d.text((180, 250), "Step 2", fill="black")
d.text((180, 265), "(7 dots)", fill="black")
d.text((300, 250), "Step 3", fill="black")
d.text((300, 265), "(10 dots)", fill="black")
d.text((410, 250), "Step 4", fill="red")
d.text((410, 265), "(?)", fill="red")
# Drawings for Step 1
d.ellipse([(70, 150), (80, 160)], fill="black")
d.ellipse([(90, 150), (100, 160)], fill="black")
d.ellipse([(70, 170), (80, 180)], fill="black")
d.ellipse([(90, 170), (100, 180)], fill="black")
d.text((20, 20), "qr_diag_003: Pattern and Sequence Diagram", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_003.png"))

# qr_diag_004: Probability Tree Diagram
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.text((50, 200), "Start", fill="black")
d.line([(90, 190), (180, 110)], fill="black", width=2)
d.line([(90, 210), (180, 290)], fill="black", width=2)
d.text((200, 100), "H (1/2)", fill="black")
d.text((200, 290), "T (1/2)", fill="black")
# Level 2 branches
d.line([(240, 100), (320, 60)], fill="black", width=2)
d.line([(240, 110), (320, 150)], fill="black", width=2)
d.text((340, 50), "H (1/2) -> HH", fill="blue")
d.text((340, 145), "T (1/2) -> HT", fill="black")
d.text((20, 20), "qr_diag_004: Independent Probability Tree", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_004.png"))

# qr_diag_005: Quantitative Analytical Shape Samples
img = create_base_canvas()
d = ImageDraw.Draw(img)
# Sample 1 shape structure
d.ellipse([(50, 100), (130, 180)], outline="black", width=2)
d.text((85, 130), "14", fill="black")
d.text((45, 190), "L: 3", fill="black")
d.text((115, 190), "R: 4", fill="black")
# Sample 2 shape structure
d.ellipse([(200, 100), (280, 180)], outline="black", width=2)
d.text((235, 130), "12", fill="black")
d.text((195, 190), "L: 5", fill="black")
d.text((265, 190), "R: 2", fill="black")
# Problem Target Shape structure
d.ellipse([(350, 100), (430, 180)], outline="red", width=2)
d.text((385, 130), "x", fill="red")
d.text((345, 190), "L: 6", fill="black")
d.text((415, 190), "R: 7", fill="black")
d.text((20, 20), "qr_diag_005: Analytical Structure Samples", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_005.png"))

# qr_diag_006: Bar Chart Histogram Data
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.line([(80, 320), (450, 320)], fill="black", width=2)
d.line([(80, 80), (80, 320)], fill="black", width=2)
# Graph data visual plots
d.rectangle([(120, 180), (160, 320)], fill="lightgreen", outline="black") # Mango (12)
d.rectangle([(220, 110), (260, 320)], fill="orange", outline="black")     # Orange (15)
d.rectangle([(320, 220), (360, 320)], fill="yellow", outline="black")     # Banana (9)
d.text((115, 330), "Mango", fill="black")
d.text((215, 330), "Orange", fill="black")
d.text((315, 330), "Banana", fill="black")
d.text((50, 105), "15", fill="black")
d.text((50, 175), "12", fill="black")
d.text((20, 20), "qr_diag_006: Favorite Fruit Bar Histogram", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_006.png"))

# qr_diag_007: Multiple Series Line Graph
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.line([(60, 320), (460, 320)], fill="black", width=2)
d.line([(60, 80), (60, 320)], fill="black", width=2)
# Draw trend lines connecting sequential points
points = [(100, 240), (200, 180), (300, 100), (400, 220)] # Mon, Wed, Fri, Sun
d.line(points, fill="red", width=3)
for pt in points:
    d.ellipse([(pt[0]-4, pt[1]-4), (pt[0]+4, pt[1]+4)], fill="black")
d.text((85, 330), "Mon", fill="black")
d.text((185, 330), "Wed", fill="black")
d.text((285, 330), "Fri", fill="black")
d.text((385, 330), "Sun", fill="black")
d.text((20, 20), "qr_diag_007: Temperature Performance Line Graph", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_007.png"))

# qr_diag_008: Segmented Pie Chart Data
img = create_base_canvas()
d = ImageDraw.Draw(img)
# Draw distinct budget slices inside the pie circle
d.pieslice([(120, 90), (360, 330)], 0, 180, fill="lightgray", outline="black")   # Salaries (50%)
d.pieslice([(120, 90), (360, 330)], 180, 270, fill="lightblue", outline="black") # Facilities (25%)
d.pieslice([(120, 90), (360, 330)], 270, 324, fill="pink", outline="black")      # Books (15%)
d.pieslice([(120, 90), (360, 330)], 324, 360, fill="orange", outline="black")    # Sports (10%)
d.text((300, 240), "Salaries", fill="black")
d.text((300, 255), "50%", fill="black")
d.text((140, 140), "Facilities", fill="black")
d.text((140, 155), "25%", fill="black")
d.text((310, 110), "Sports", fill="red")
d.text((310, 125), "10%", fill="red")
d.text((20, 20), "qr_diag_008: Budget Allocation Pie Chart", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_008.png"))

# qr_diag_009: Flow Chart Logic Diagram
img = create_base_canvas()
d = ImageDraw.Draw(img)
d.rectangle([(50, 160), (120, 220)], outline="black", width=2)
d.text((60, 180), "Input N", fill="black")
d.line([(120, 190), (170, 190)], fill="black", width=2)
# Conditional decision polygon diamond
d.polygon([(220, 140), (270, 190), (220, 240), (170, 190)], outline="black", width=2)
d.text((190, 180), "Is N Even?", fill="black")
d.line([(220, 240), (220, 280)], fill="black", width=2) # No branch down
d.text((230, 250), "No", fill="black")
d.rectangle([(170, 280), (270, 330)], outline="black", width=2)
d.text((195, 295), "Do: 3N + 1", fill="blue")
d.text((20, 20), "qr_diag_009: Flow Chart Decision Tree", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_009.png"))

# qr_diag_010: Geometric Ratio / Scaling Diagram
img = create_base_canvas()
d = ImageDraw.Draw(img)
# Render small initial reference shape
d.polygon([(50, 250), (50, 150), (120, 250)], outline="black", width=2)
d.text((30, 190), "4", fill="black")
d.text((75, 260), "3", fill="black")
# Render larger scaled structural shape
d.polygon([(220, 250), (220, 50), (360, 250)], outline="black", width=2)
d.text((195, 140), "h", fill="red")
d.text((280, 260), "6", fill="black")
d.text((20, 20), "qr_diag_010: Proportional Geometric Scaling", fill="gray")
img.save(os.path.join(QR_DIR, "qr_diag_010.png"))

print("SUCCESS: Programmatically drew and saved all 20 diagram PNG assets cleanly!")
