'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { ArchitecturalCard } from '@/components/ui/architectural-card'
import { PROJECTS } from '@/config/projects'

export function ProjectsSection() {
  const t = useTranslations('projects')

  return (
    <section id="projects" className="py-24">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={fadeInUp}
          className="mb-12 text-center font-mono text-3xl font-bold md:text-4xl"
        >
          {t('title')}
        </motion.h2>

        {/* Industrial List Layout */}
        <div className="max-w-6xl mx-auto space-y-0 px-6">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <ArchitecturalCard
                id={project.id}
                title={project.title}
                category={project.category}
                description={project.description}
                tech={project.tech}
                algorithm={project.algorithm}
                database={project.database}
                status={project.status}
                metrics={project.metrics}
                link={project.link}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

