function ProjectCard({ project }) {
  return (
    <div className="card h-100 shadow">
      <img
        src={project.image}
        className="card-img-top"
        alt={project.title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text">{project.description}</p>
        <a href="#" className="mt-auto btn btn-outline-primary">
          عرض المزيد
        </a>
      </div>
    </div>
  );
}

export default ProjectCard;
