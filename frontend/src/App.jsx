import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch students
  const getStudents = async () => {
    try {
      const response = await API.get("students/");
      setStudents(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Unable to fetch students. Check backend server.");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add and update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`students/${editId}/`, form);
        alert("Student updated successfully");
      } else {
        await API.post("students/", form);
        alert("Student added successfully");
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
      });

      setEditId(null);
      getStudents();

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Check student details.");
    }
  };

  // Edit student
  const editStudent = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
    });

    setEditId(student.id);
  };

  // Delete student
  const deleteStudent = async (id) => {
    if (window.confirm("Do you want to delete this student?")) {
      try {
        await API.delete(`students/${id}/`);
        getStudents();
        alert("Student deleted successfully");
      } catch (error) {
        console.error(error);
        alert("Unable to delete student");
      }
    }
  };

  // Search student
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <header>
        <h1>StudentPortal</h1>
        <p>Student Management Dashboard</p>
      </header>

      <div className="form-box">

        <h2>{editId ? "Update Student" : "Add New Student"}</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editId ? "Update Student" : "Add Student"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel"
              onClick={() => {
                setEditId(null);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  course: "",
                });
              }}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      <div className="table-box">

        <h2>Student Records</h2>

        <input
          className="search"
          type="text"
          placeholder="Search by student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>

                  <td>
                    <button
                      className="edit"
                      onClick={() => editStudent(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;