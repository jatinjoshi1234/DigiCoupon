from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

src = "/mnt/data/Jatin_Joshi_ATS_Resume.docx"
out = "/mnt/data/Jatin_Joshi_ATS_Resume_Updated.docx"

doc = Document(src)

# Clear existing content and rebuild a clean ATS-friendly one-page resume.
body = doc._element.body
for child in list(body):
    body.remove(child)

sec = doc.sections[0]
sec.top_margin = Inches(0.45)
sec.bottom_margin = Inches(0.45)
sec.left_margin = Inches(0.55)
sec.right_margin = Inches(0.55)

styles = doc.styles
styles["Normal"].font.name = "Arial"
styles["Normal"].font.size = Pt(9)
styles["Normal"].paragraph_format.space_after = Pt(2)

def add_p(text="", bold=False, size=9, align=None, space_before=0, space_after=2):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    if align:
        p.alignment = align
    r = p.add_run(text)
    r.bold = bold
    r.font.name = "Arial"
    r.font.size = Pt(size)
    return p

def heading(text):
    p = add_p(text, bold=True, size=10, space_before=5, space_after=2)
    p.paragraph_format.keep_with_next = True
    return p

def bullet(text):
    p = add_p("• " + text, size=8.7, space_after=1)
    p.paragraph_format.left_indent = Inches(0.12)
    p.paragraph_format.first_line_indent = Inches(-0.12)
    return p

# Header
add_p("JATIN JOSHI", bold=True, size=17, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
add_p("FULL-STACK .NET & ANGULAR DEVELOPER | 6+ YEARS EXPERIENCE", bold=True, size=9.5,
      align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)
add_p("Khambhaliya, Gujarat, India | +91 9558137289 | jjdb04121997@gmail.com", size=8.5,
      align=WD_ALIGN_PARAGRAPH.CENTER, space_after=1)
add_p("Portfolio: http://jatin-joshi.vercel.app/ | LinkedIn: http://linkedin.com/in/joshi-jatin-12b32b198 | GitHub: https://github.com/jatinjoshi1234",
      size=8.2, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)

heading("PROFESSIONAL SUMMARY")
add_p(
    "Full-Stack .NET Developer with 6+ years of experience building production web applications and enterprise software using C#, .NET, ASP.NET MVC, Web API, Angular, Blazor Server, and SQL Server. Experienced in REST API development, database design, authentication and authorization, third-party API integration, responsive UI development, and end-to-end application delivery.",
    size=8.7, space_after=2
)

heading("TECHNICAL SKILLS")
skills = [
    ("Backend", "C#, .NET Core, ASP.NET Core, ASP.NET MVC, Web API, REST APIs"),
    ("Frontend", "Angular, TypeScript, JavaScript, Blazor Server, HTML5, CSS3, jQuery"),
    ("Database", "SQL Server, T-SQL, Stored Procedures, Entity Framework Core, Entity Framework, LINQ"),
    ("Security & APIs", "JWT Authentication, OAuth, REST API Integration"),
    ("Integrations", "WhatsApp API, Flywire, Zoho CRM, Payment Gateways"),
]
for k, v in skills:
    p = add_p(size=8.5, space_after=1)
    r = p.add_run(k + ": ")
    r.bold = True
    r.font.name = "Arial"; r.font.size = Pt(8.5)
    r2 = p.add_run(v)
    r2.font.name = "Arial"; r2.font.size = Pt(8.5)

heading("PROFESSIONAL EXPERIENCE")
add_p(" .NET / Blazor / Angular Developer — Connectus Infoway Pvt Ltd | 2022 – Present", bold=True, size=9, space_after=0)
add_p("Rajkot, Gujarat", size=8.2, space_after=1)
for x in [
    "Engineered full-stack enterprise applications using C#, .NET, Angular, Blazor Server, and SQL Server.",
    "Designed and developed RESTful APIs supporting business logic and third-party platform communications.",
    "Built modular Angular components and responsive web interfaces for business workflows.",
    "Implemented role-based security, OAuth/JWT authentication, and workflow automation.",
    "Optimized database operations using Entity Framework Core, LINQ, stored procedures, and T-SQL."
]:
    bullet(x)

add_p("Junior .NET & Angular Developer — Mehta Websolutions | 2020 – 2022", bold=True, size=9, space_before=2, space_after=0)
add_p("Jamnagar, Gujarat", size=8.2, space_after=1)
for x in [
    "Developed web applications, services, and database workflows using .NET Framework, C#, Angular, and SQL Server.",
    "Built custom data tables, administrative dashboards, reporting features, and CRUD workflows.",
    "Maintained data-layer efficiency using Entity Framework and optimized SQL queries.",
]:
    bullet(x)

heading("SELECTED PROJECTS")
projects = [
    ("Raats Motorsports Platform", ".NET 9, Angular 21, EF Core 10",
     "Operations platform for tyre services, quotations, scheduling, logistics, and multi-tier user access."),
    ("Villa Management ERP", "Blazor Server, .NET 9, SQL Server, Flywire, Zoho CRM",
     "Property management suite handling reservations, multi-currency payments, quotations, and CRM integrations."),
    ("Prognosis Finance ERP", ".NET Core, JavaScript, jQuery, SQL Server, EF Core",
     "Migrated legacy desktop workflows to a web application; implemented API services and WhatsApp API messaging."),
    ("Horizon Health Insurance Platform", ".NET Core 5, Angular 13+, SQL Server",
     "Healthcare platform covering Underwriting, PBM, Claims Processing, Sales, and Financial Operations."),
    ("Law Management System", ".NET 10, ASP.NET MVC, SQL Server, Bootstrap",
     "Law-firm case management system covering cases, parties, hearings, orders, documents, advocates, fees, payments, and configurable reports."),
    ("Matrimonial Platform — Mehta Websolutions", ".NET MVC 4.8, C#, Entity Framework, jQuery, REST API",
     "Working professional matrimonial web application; contributed to frontend UI, backend APIs, business workflows, CRUD operations, profiles, preferences, and related features."),
    ("Matrimonial Mobile Application — Mehta Websolutions", "Ionic, Angular 13, .NET Framework 4.8, C#, REST API, SignalR, OneSignal",
     "Cross-platform matrimonial mobile application integrated with .NET APIs, real-time chat, and push notifications.")
]
for name, tech, desc in projects:
    p = add_p(size=8.5, space_after=0)
    r = p.add_run(name + " | ")
    r.bold = True; r.font.name = "Arial"; r.font.size = Pt(8.5)
    r2 = p.add_run(tech)
    r2.italic = True; r2.font.name = "Arial"; r2.font.size = Pt(8.3)
    add_p(desc, size=8.2, space_after=1)

heading("EDUCATION")
add_p("Bachelor of Computer Applications (BCA) — Saurashtra University | CGPA: 6.99", bold=True, size=8.7, space_after=1)
add_p("12th — Gujarat Secondary and Higher Secondary Education Board (GSEB) | 67.67%", size=8.7, space_after=2)

# Remove blank trailing paragraph if any and set document core properties.
doc.core_properties.title = "Jatin Joshi - ATS Resume"
doc.core_properties.subject = "Full-Stack .NET & Angular Developer Resume"
doc.save(out)

print(out)
