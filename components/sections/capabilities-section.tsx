'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { CAPABILITIES } from '@/config/capabilities'
import type { CapabilityBlock } from '@/config/capabilities'

function AssetBrowser({ block }: { block: CapabilityBlock }) {
  const t = useTranslations('capabilities')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="border border-white/10 bg-black font-mono text-xs uppercase tracking-widest">
      {/* Header */}
      <div className="border-b border-white/10 p-4 text-foreground/50 flex justify-between items-center">
        <span>DIRECTORY: /ROOT/{block.id.toUpperCase()}</span>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cyan-400"
        >
          ● REC
        </motion.span>
      </div>

      {/* List */}
      <div className="divide-y divide-white/10">
        {block.items.map((item, i) => (
          <motion.div
            key={item.id}
            initial="initial"
            whileHover="hover"
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative p-6 group cursor-crosshair overflow-hidden"
          >
            {/* Background Hover Effect (Scanline) */}
            <motion.div
              variants={{
                initial: { x: '-100%' },
                hover: { x: '0%' },
              }}
              transition={{ type: 'tween', ease: 'circOut', duration: 0.5 }}
              className="absolute inset-0 bg-white/5 z-0"
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-foreground/40 group-hover:text-foreground transition-colors duration-300">
                {`0${i + 1}__${item.name}`}
              </span>

              {/* Arrow Reveal */}
              <motion.span
                variants={{
                  initial: { opacity: 0, x: -10 },
                  hover: { opacity: 1, x: 0 },
                }}
                className="text-cyan-400"
              >
                [EXECUTE]
              </motion.span>
            </div>

            {/* Description on hover */}
            <AnimatePresence>
              {hoveredIndex === i && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 mt-3 pt-3 border-t border-white/10"
                >
                  <p className="text-foreground/60 text-[10px] leading-relaxed normal-case">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer with tools */}
      {block.tools && (
        <div className="border-t border-white/10 p-4 text-foreground/30 text-[10px]">
          <div className="mb-2">TOOLS:</div>
          <div className="flex flex-wrap gap-2">
            {block.tools.map((tool) => (
              <span key={tool} className="px-2 py-1 border border-white/10">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SchematicBlueprint({ block }: { block: CapabilityBlock }) {
  const t = useTranslations('capabilities')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const coreNodes = block.items.map((item) => ({
    id: item.id,
    name: item.name.split('_').slice(0, 2).join('_'),
    fullName: item.name,
    description: item.description,
  }))

  return (
    <div className="border border-white/10 bg-black font-mono text-xs uppercase tracking-widest relative overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-4 text-foreground/50 flex justify-between items-center">
        <span>SCHEMATIC: {block.title}</span>
        <span className="text-cyan-400 animate-pulse">● ACTIVE</span>
      </div>

      {/* Mobile: Horizontal Marquee */}
      <div className="md:hidden py-8 overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-foreground/40 whitespace-nowrap"
        >
          <span className="mr-8">
            import {'{'} {coreNodes.map((n) => n.name).join(', ')} {'}'} from
            &apos;cyberkesa_stack&apos;;
          </span>
        </motion.div>
      </div>

      {/* Desktop: Interactive Schematic */}
      <div className="hidden md:block p-8 min-h-[400px] relative">
        {/* Central CORE node */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <div className="w-24 h-24 border-2 border-cyan-400 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-cyan-400 text-[10px] font-bold">CORE</span>
          </div>
        </motion.div>

        {/* Connection lines and nodes */}
        {coreNodes.map((node, i) => {
          const angle = (i / coreNodes.length) * Math.PI * 2
          const radius = 150
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const centerX = 50
          const centerY = 50

          return (
            <div key={node.id} className="absolute inset-0">
              {/* Connection line */}
              <motion.div
                className="absolute origin-top-left"
                style={{
                  left: `${centerX}%`,
                  top: `${centerY}%`,
                  width: `${radius}px`,
                  height: '1px',
                  transformOrigin: '0 0',
                  transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              >
                <div className="h-full bg-white/10" />
              </motion.div>

              {/* Node */}
              <motion.div
                className="absolute cursor-pointer"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.2, zIndex: 30 }}
                onHoverStart={() => setSelectedNode(node.id)}
                onHoverEnd={() => setSelectedNode(null)}
                onClick={() => setSelectedNode(node.id)}
              >
                <div className="w-16 h-16 border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center group">
                  <span className="text-foreground/60 group-hover:text-cyan-400 text-[8px] text-center px-1 transition-colors">
                    {node.name.split('_')[0]}
                  </span>
                </div>
              </motion.div>
            </div>
          )
        })}

        {/* Selected node info */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 p-4 border border-white/10 bg-black/80 backdrop-blur-sm z-40"
            >
              <p className="text-foreground/70 text-[10px] leading-relaxed normal-case">
                {coreNodes.find((n) => n.id === selectedNode)?.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {block.tools && (
        <div className="border-t border-white/10 p-4 text-foreground/30 text-[10px]">
          <div className="mb-2">STACK:</div>
          <div className="flex flex-wrap gap-2">
            {block.tools.map((tool) => (
              <span key={tool} className="px-2 py-1 border border-white/10">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NeuralActivity({ block }: { block: CapabilityBlock }) {
  const t = useTranslations('capabilities')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const encryptedText = (text: string) => {
    return text
      .split('')
      .map((char) => {
        if (char === '_') return '_'
        if (char === ' ') return ' '
        const symbols = ['X', '#', '@', '$', '%', '&', '*']
        return symbols[Math.floor(Math.random() * symbols.length)]
      })
      .join('')
  }

  return (
    <div className="border border-white/10 bg-black font-mono text-xs uppercase tracking-widest relative overflow-hidden">
      {/* Pulsing background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 p-4 text-foreground/50 flex justify-between items-center">
        <span>NEURAL_ACTIVITY: {block.title}</span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-cyan-400"
        >
          ● LIVE
        </motion.span>
      </div>

      {/* Items with decryption effect */}
      <div className="relative z-10 divide-y divide-white/10">
        {block.items.map((item, i) => {
          const isHovered = hoveredIndex === i
          return (
            <motion.div
              key={item.id}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative p-6 group cursor-crosshair overflow-hidden"
            >
              <motion.div
                animate={{
                  opacity: isHovered ? 1 : 0.4,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <motion.span
                  key={isHovered ? 'decrypted' : 'encrypted'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-foreground/40 group-hover:text-cyan-400 transition-colors duration-300"
                >
                  {isHovered ? item.name : encryptedText(item.name)}
                </motion.span>

                <motion.span
                  variants={{
                    initial: { opacity: 0, x: -10 },
                    hover: { opacity: 1, x: 0 },
                  }}
                  initial="initial"
                  animate={isHovered ? 'hover' : 'initial'}
                  className="text-cyan-400 text-[10px]"
                >
                  [DECRYPTED]
                </motion.span>
              </motion.div>

              {/* Description */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <p className="text-foreground/60 text-[10px] leading-relaxed normal-case">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      {block.focus && (
        <div className="relative z-10 border-t border-white/10 p-4 text-foreground/30 text-[10px]">
          <div className="mb-2">FOCUS:</div>
          <div className="normal-case">{block.focus}</div>
        </div>
      )}
    </div>
  )
}

export function CapabilitiesSection() {
  const t = useTranslations('capabilities')

  const renderBlock = (block: CapabilityBlock) => {
    switch (block.id) {
      case 'visual':
        return <AssetBrowser block={block} />
      case 'code':
        return <SchematicBlueprint block={block} />
      case 'intelligence':
        return <NeuralActivity block={block} />
      default:
        return <AssetBrowser block={block} />
    }
  }

  return (
    <section id="capabilities" className="py-24">
      <motion.div
        className="container mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp} className="mb-12 text-center">
          <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
            {t('title')}
          </h2>
          <p className="font-mono text-sm text-foreground/70">{t('subtitle')}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {CAPABILITIES.map((block, index) => (
            <motion.div key={block.id} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
              <div className="mb-2 font-mono text-sm text-foreground/50">
                {block.title}
              </div>
              <div className="mb-4 font-mono text-xs text-foreground/30">
                {block.subtitle}
              </div>
              {renderBlock(block)}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

