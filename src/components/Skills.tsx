import React from 'react';
import SkillBar from '../SkillBar';

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Skills
        </h2>

        {/* Frontend Skills */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Frontend
          </h3>
          <SkillBar skill="HTML5" percentage={95} />
          <SkillBar skill="CSS3" percentage={90} />
          <SkillBar skill="JavaScript" percentage={85} />
          <SkillBar skill="React.js" percentage={85} />
          <SkillBar skill="Tailwind CSS" percentage={90} />
          <SkillBar skill="Bootstrap" percentage={80} />
        </div>

        {/* Backend Skills */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Backend
          </h3>
          <SkillBar skill="Node.js" percentage={75} />
          <SkillBar skill="Express.js" percentage={70} />
        </div>

        {/* Database Skills */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Database
          </h3>
          <SkillBar skill="MongoDB" percentage={70} />
          <SkillBar skill="MySQL" percentage={65} />
        </div>

        {/* Programming Languages */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Programming Languages
          </h3>
          <SkillBar skill="C" percentage={90} />
          <SkillBar skill="C++" percentage={85} />
          <SkillBar skill="Java" percentage={80} />
          <SkillBar skill="Python (Basics)" percentage={60} />
          <SkillBar skill="MATLAB" percentage={60} />
        </div>

        {/* Tools & Platforms */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Tools & Platforms
          </h3>
          <SkillBar skill="Git & GitHub" percentage={85} />
          <SkillBar skill="Bitbucket / GitLab" percentage={70} />
          <SkillBar skill="VS Code" percentage={90} />
          <SkillBar skill="Render (Deployment)" percentage={75} />
          <SkillBar skill="Postman" percentage={70} />
        </div>

        {/* Computer Science Concepts */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Computer Science Concepts
          </h3>
          <SkillBar skill="Data Structures & Algorithms (DSA)" percentage={90} />
          <SkillBar skill="OOP Concepts" percentage={85} />
        </div>
      </div>
    </section>
  );
};

export default Skills;
