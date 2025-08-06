const express = require("express");
const ProjectsController = require("../controllers/projectsController");
const { authenticateToken, requireAdmin, requireEngineerOrAdmin } = require("../middleware/auth");
const router = express.Router();

// Public routes
router.get("/", ProjectsController.getAllActiveProjects);
router.get("/:id", ProjectsController.getProjectById);

// Admin/Engineer routes
router.get("/all", authenticateToken, requireEngineerOrAdmin, ProjectsController.getAllProjects);
router.post("/", authenticateToken, requireEngineerOrAdmin, ProjectsController.createProject);
router.put("/:id", authenticateToken, requireEngineerOrAdmin, ProjectsController.updateProject);
router.delete("/:id", authenticateToken, requireAdmin, ProjectsController.deleteProject);
router.patch("/:id/toggle", authenticateToken, requireAdmin, ProjectsController.toggleProjectStatus);

module.exports = router;
