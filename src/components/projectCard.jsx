import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <div className="card h-100 shadow">
      <img
        src={project.image || project.imageUrl}
        className="card-img-top"
        alt={project.title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text">{project.description}</p>
        <Link to={`/project/${project._id}`} className="mt-auto btn btn-outline-primary">
          عرض المزيد
        </Link>
      </div>
    </div>
  );
}
export default ProjectCard;
