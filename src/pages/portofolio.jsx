import ProjectCard from "./components/ProjectCard";

const projects = [
  {
    title: "تصميم فيلا سكنية",
    image: "https://via.placeholder.com/600x400?text=Villa+Design",
    description: "فيلا فاخرة مكونة من طابقين بتصميم عصري في التجمع الخامس.",
  },
  {
    title: "تصميم كافيه خارجي",
    image: "https://via.placeholder.com/600x400?text=Cafe+Design",
    description: "كافيه مفتوح بمساحات خضراء وإضاءة ليلية جذابة.",
  },
  {
    title: "تصميم مكتب إداري",
    image: "https://via.placeholder.com/600x400?text=Office+Design",
    description: "تصميم داخلي وخارجي لمكتب شركة تقنية حديثة.",
  },
];

function Portfolio() {
  return (
    <div>
      <h2 className="mb-4 text-center">📂 أعمالي</h2>
      <div className="row">
        {projects.map((project, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
