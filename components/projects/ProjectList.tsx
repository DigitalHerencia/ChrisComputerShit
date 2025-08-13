import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: { id: string; name: string }[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {projects.map(p => (
        <ProjectCard key={p.id} name={p.name} />
      ))}
    </div>
  );
}
