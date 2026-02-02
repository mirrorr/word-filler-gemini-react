
Task
Implement a small web application that fills the placeholders of a Word template (.docx) downloaded by the user.
The following pages contain images of an example solution.

Functionalities
1. File input: The user can input a Word file (.docx) into the application, which
has placeholder entries in the format {{PLACEHOLDER}}. You will receive an example template for testing.
2. Placeholder recognition and UI generation: The application recognizes the template's placeholders and
generates the corresponding fields in the user interface (label + text field).
3. Document generation: The user fills in the values ​​in the application UI and presses the Generate button, after which the application generates a downloadable .docx file with the placeholders replaced with the given values.

Requirements

Placeholders must be dynamically identified from the loaded template document.
The user interface must be dynamically generated based on the placeholders found.
The generated Word file:
o is in accordance with the original template (structure preserved)
o contains all replaced values
You may use and it is recommended to use AI tools to complete the task.

Technology Stack
Frontend only app, no backend
React with TypeScript for the UI
Vite for fast development and building
Tailwind CSS for styling
docxtemplater library for .docx manipulation
pizzip for handling .docx file format
file-saver for downloading generated files

