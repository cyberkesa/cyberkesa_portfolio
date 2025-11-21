'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { hoverGlow, fadeInUp } from '@/lib/animations'
import Image from 'next/image'

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  title: string
  description: string
  tech?: string[]
  videoUrl?: string
  imageUrl?: string
  gridSize?: 'small' | 'medium' | 'large'
  link?: string
}

export function Card({
  title,
  description,
  tech = [],
  videoUrl,
  imageUrl,
  gridSize = 'medium',
  link,
  className,
  ...props
}: CardProps) {
  const gridSizes = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 row-span-2',
  }

  const content = (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-accent bg-accent/50 backdrop-blur-sm',
        gridSizes[gridSize],
        className
      )}
      variants={hoverGlow}
      initial="rest"
      whileHover="hover"
      {...props}
    >
      {/* Media */}
      <div className="group/media relative h-full w-full">
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover transition-all duration-500 group-hover/media:scale-110"
            onMouseEnter={(e) => {
              // Speed up on hover
              e.currentTarget.playbackRate = 1.5
            }}
            onMouseLeave={(e) => {
              // Reset speed
              e.currentTarget.playbackRate = 1
            }}
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.currentTarget
              target.style.display = 'none'
              const fallback = target.parentElement?.querySelector('.media-fallback')
              if (fallback) {
                ;(fallback as HTMLElement).style.display = 'flex'
              }
            }}
          />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-all duration-500 group-hover/media:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onError={() => {
              // Image error handled by Next.js Image component
            }}
          />
        ) : null}
        
        {/* Fallback for missing media */}
        {!videoUrl && !imageUrl && (
          <div className="media-fallback flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/30 to-accent/10">
            <div className="text-center">
              <div className="mb-2 text-4xl font-mono text-foreground/20">[ ]</div>
              <span className="font-mono text-xs text-foreground/40">No media</span>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.h3
            className="mb-2 text-xl font-bold text-foreground"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="mb-3 text-sm text-foreground/70"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {description}
          </motion.p>
          
          {/* Tech Stack */}
          {tech.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {tech.map((techItem: string) => (
                <span
                  key={techItem}
                  className="rounded border border-foreground/10 bg-foreground/5 px-2 py-0.5 font-mono text-xs text-foreground/60"
                >
                  {techItem}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}

