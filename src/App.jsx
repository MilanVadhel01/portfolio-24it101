import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";

function App() {
  const studentName = "Milan Vadhel";

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Git",
    "GitHub",
  ];

  return (
    <div>
      <Header name={studentName} />
      <About />
      <Skills skillList={skills} />
      <Footer />
    </div>
  );
}

export default App;