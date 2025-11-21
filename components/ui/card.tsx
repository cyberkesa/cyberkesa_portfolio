'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { useState } from 'react'
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
  const [hasVideoError, setHasVideoError] = useState(false)
  const [hasImageError, setHasImageError] = useState(false)

  const gridSizes = {
    small: 'col-span-1 row-span-1 min-h-[300px]',
    medium: 'col-span-1 md:col-span-2 row-span-1 min-h-[300px]',
    large: 'col-span-1 md:col-span-2 row-span-2 min-h-[300px] md:min-h-[624px]',
  }

  const content = (
    <motion.div
      role="article"
      aria-label={`Project: ${title}`}
      tabIndex={link ? 0 : -1}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-accent bg-accent/50 backdrop-blur-sm',
        'flex flex-col',
        'transition-all duration-300',
        link && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-glow focus:ring-offset-2 focus:ring-offset-background',
        !link && 'cursor-default',
        gridSizes[gridSize],
        className
      )}
      variants={hoverGlow}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={link ? { scale: 0.98 } : {}}
      onKeyDown={(e) => {
        if (link && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          window.open(link, '_blank', 'noopener,noreferrer')
        }
      }}
      {...props}
    >
      {/* Media */}
      <div className="group/media relative h-full w-full flex-shrink-0">
        {videoUrl && !hasVideoError ? (
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
            onError={() => {
              // Video failed to load, show fallback
              setHasVideoError(true)
            }}
          />
        ) : imageUrl && !hasImageError && !hasVideoError ? (
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
              setHasImageError(true)
            }}
          />
        ) : (
          <div className="media-fallback flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/40 via-accent/20 to-accent/10 relative overflow-hidden">
            {/* Animated grid pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Content */}
            <div className="text-center relative z-10">
              <div className="mb-4 text-6xl font-mono text-foreground/30 select-none">
                {'{ }'}
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-xs text-foreground/50 uppercase tracking-widest">
                  Project Preview
                </span>
                <span className="block font-mono text-xs text-foreground/30">
                  Visual content coming soon
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100" />
        
        {/* Link indicator */}
        {link && (
          <div className="absolute top-4 right-4 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
            <div className="rounded-full bg-glow/20 backdrop-blur-sm border border-glow/30 px-3 py-1.5">
              <span className="font-mono text-xs text-glow">View →</span>
            </div>
          </div>
        )}

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
                  className="rounded border border-foreground/10 bg-foreground/5 px-2.5 py-1 font-mono text-xs text-foreground/70 hover:text-foreground transition-colors"
                  aria-label={`Technology: ${techItem}`}
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
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={`View project: ${title} (opens in new tab)`}
        className="block focus:outline-none"
      >
        {content}
      </a>
    )
  }

  return content
}

