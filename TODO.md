# TODO List for Fixing Form Submission Error

- [x] Edit student.html: Remove the duplicate `<script src="student.js"></script>` from the head section.
- [x] Edit student.js: Remove ES6 import statements and use `const db = window.db;` instead.
- [x] Edit student.js: Update `validateForm` function to match actual form field IDs: ["usn", "name", "branch", "gender", "phone", "email", "bloodGroup", "emergencyContact", "meal1", "meal2", "meal3", "special"].
- [x] Edit student.js: Update data collection in form submission to include all fields: usn, name, branch, gender, phone, email, bloodGroup, emergencyContact, meal1, meal2, meal3, special, createdAt.
- [x] Edit student.js: Update UI enhancements to use correct IDs: change "purpose" to "special" and "charCounter" to "charCount".
- [x] Test the form by opening student.html in a browser and submitting to verify no errors and data saves to Firestore.
