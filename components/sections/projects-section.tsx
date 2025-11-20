'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Card } from '@/components/ui/card'
import { Grid } from '@/components/layout/grid'
import { PROJECTS } from '@/config/projects'

export function ProjectsSection() {
  const t = useTranslations('projects')

  return (
    <section id="projects" className="py-24">
      <motion.div
        className="container mx-auto px-6"
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

        <Grid>
          {PROJECTS.map((project) => (
            <motion.div key={project.id} variants={fadeInUp}>
              <Card
                title={project.title}
                description={project.description}
                videoUrl={project.videoUrl}
                imageUrl={project.imageUrl}
                gridSize={project.gridSize}
                link={project.link}
              />
            </motion.div>
          ))}
        </Grid>
      </motion.div>
    </section>
  )
}

