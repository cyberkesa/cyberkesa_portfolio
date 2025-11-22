'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useHapticFeedback } from '@/hooks/use-haptic-feedback'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { CAPABILITIES } from '@/config/capabilities'
import type { CapabilityBlock } from '@/config/capabilities'

// Mobile Scan Line Item Component
function MobileScanItem({
  item,
  index,
  onScan,
}: {
  item: { id: string; name: string; description: string }
  index: number
  onScan: () => void
}) {
  const ref = useRef(null)
  const { lightTap } = useHapticFeedback()
  const hasScanned = useRef(false)
  
  // Triggers when element is in center of viewport (-40% margin from top and bottom for better mobile detection)
  const isInView = useInView(ref, { 
    margin: '-40% 0px -40% 0px', 
    once: false,
    amount: 0.3 // At least 30% of element must be visible
  })

  useEffect(() => {
    if (isInView && !hasScanned.current) {
      lightTap()
      onScan()
      hasScanned.current = true
    } else if (!isInView) {
      hasScanned.current = false
    }
  }, [isInView, lightTap, onScan])

  return (
    <motion.div
      ref={ref}
      className={`relative py-8 border-b border-foreground/10 transition-colors duration-500 ${
        isInView ? 'bg-foreground/5' : 'bg-transparent'
      }`}
    >
      {/* Text */}
      <div className="relative z-20 flex justify-between items-center px-4">
        <span
          className={`font-mono text-sm transition-colors duration-300 ${
            isInView ? 'text-cyan-400' : 'text-foreground/40'
          }`}
        >
          {`0${index + 1} // ${item.name}`}
        </span>

        {/* Status Indicator */}
        <motion.div
          animate={{ opacity: isInView ? 1 : 0 }}
          className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>

      {/* Description Preview (appears when in view) */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 mt-4 px-4"
          >
            <p className="text-foreground/60 text-[10px] leading-relaxed normal-case">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          opacity: isInView ? 0.1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}

function AssetBrowser({ block }: { block: CapabilityBlock }) {
  const t = useTranslations('capabilities')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [scannedItems, setScannedItems] = useState<Set<number>>(new Set())

  const handleScan = (index: number) => {
    setScannedItems((prev) => new Set([...prev, index]))
  }

  return (
    <div className="border border-foreground/10 bg-accent/50 font-mono text-xs uppercase tracking-widest">
      {/* Header */}
      <div className="border-b border-foreground/10 p-4 text-foreground/50 flex justify-between items-center gap-2">
        <span className="text-[10px] break-words flex-1 min-w-0">
          DIRECTORY: /ROOT/{block.id.toUpperCase()}
        </span>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cyan-400 flex-shrink-0"
        >
          ● REC
        </motion.span>
      </div>

      {/* Mobile: Scan Line List */}
      <div className="md:hidden">
        {block.items.map((item, i) => (
          <MobileScanItem
            key={item.id}
            item={item}
            index={i}
            onScan={() => handleScan(i)}
          />
        ))}
      </div>

      {/* Desktop: Hover List */}
      <div className="hidden md:block divide-y divide-foreground/10">
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
              className="absolute inset-0 bg-foreground/5 z-0"
            />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="text-foreground/40 group-hover:text-foreground transition-colors duration-300 text-[10px] break-words flex-1 min-w-0">
                {`0${i + 1}__${item.name}`}
              </span>

              {/* Arrow Reveal */}
              <motion.span
                variants={{
                  initial: { opacity: 0, x: -10 },
                  hover: { opacity: 1, x: 0 },
                }}
                className="text-cyan-400 text-[10px] flex-shrink-0"
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
                  className="relative z-10 mt-3 pt-3 border-t border-foreground/10"
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
        <div className="border-t border-foreground/10 p-4 text-foreground/30 text-[10px]">
          <div className="mb-2">TOOLS:</div>
          <div className="flex flex-wrap gap-2">
            {block.tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-1 border border-foreground/10 break-words text-[9px]"
              >
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
    <div className="border border-foreground/10 bg-accent/50 font-mono text-xs uppercase tracking-widest relative overflow-hidden">
      {/* Header */}
      <div className="border-b border-foreground/10 p-4 text-foreground/50 flex justify-between items-center gap-2">
        <span className="text-[10px] break-words flex-1 min-w-0">
          SCHEMATIC: {block.title}
        </span>
        <span className="text-cyan-400 animate-pulse text-[10px] flex-shrink-0">
          ● ACTIVE
        </span>
      </div>

      {/* Mobile: Horizontal Marquee */}
      <div className="md:hidden py-8 overflow-hidden relative">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-foreground/40 whitespace-nowrap text-[10px]"
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
          <div className="w-24 h-24 border-2 border-cyan-400 bg-background/80 backdrop-blur-sm flex items-center justify-center">
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
                <div className="h-full bg-foreground/10" />
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
                <div className="w-16 h-16 border border-foreground/20 bg-background/60 backdrop-blur-sm flex items-center justify-center group">
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
              className="absolute bottom-4 left-4 right-4 p-4 border border-foreground/10 bg-background/80 backdrop-blur-sm z-40"
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
        <div className="border-t border-foreground/10 p-4 text-foreground/30 text-[10px]">
          <div className="mb-2">STACK:</div>
          <div className="flex flex-wrap gap-2">
            {block.tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-1 border border-foreground/10 break-words text-[9px]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Mobile Neural Scan Item Component
function MobileNeuralScanItem({
  item,
  index,
  decryptedItems,
  setDecryptedItems,
  encryptedText,
}: {
  item: { id: string; name: string; description: string }
  index: number
  decryptedItems: Set<number>
  setDecryptedItems: React.Dispatch<React.SetStateAction<Set<number>>>
  encryptedText: (text: string) => string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    margin: '-40% 0px -40% 0px', 
    once: false,
    amount: 0.3
  })
  const { lightTap } = useHapticFeedback()
  const isDecrypted = decryptedItems.has(index) || isInView
  const hasDecryptedRef = useRef(false)

  useEffect(() => {
    if (isInView && !hasDecryptedRef.current) {
      lightTap()
      setDecryptedItems((prev) => new Set([...prev, index]))
      hasDecryptedRef.current = true
    } else if (!isInView) {
      hasDecryptedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, lightTap])

  return (
    <motion.div
      ref={ref}
      className={`relative py-8 border-b border-foreground/10 transition-colors duration-500 ${
        isInView ? 'bg-foreground/5' : 'bg-transparent'
      }`}
    >
      <div className="relative z-20 flex justify-between items-center px-4">
        <motion.span
          className={`font-mono text-sm transition-colors duration-300 ${
            isInView ? 'text-cyan-400' : 'text-foreground/40'
          }`}
          key={isDecrypted ? 'decrypted' : 'encrypted'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDecrypted ? item.name : encryptedText(item.name)}
        </motion.span>

        <motion.div
          animate={{ opacity: isInView ? 1 : 0 }}
          className="flex items-center gap-2"
        >
          {isDecrypted && (
            <span className="text-cyan-400 text-[10px]">[DECRYPTED]</span>
          )}
          <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isInView && isDecrypted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 mt-4 px-4"
          >
            <p className="text-foreground/60 text-[10px] leading-relaxed normal-case">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          opacity: isInView ? 0.1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}

function NeuralActivity({ block }: { block: CapabilityBlock }) {
  const t = useTranslations('capabilities')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [decryptedItems, setDecryptedItems] = useState<Set<number>>(new Set())

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
    <div className="border border-foreground/10 bg-accent/50 font-mono text-xs uppercase tracking-widest relative overflow-hidden">
      {/* Pulsing background */}
      <motion.div
        className="absolute inset-0 opacity-10 bg-cyan-400/10 dark:bg-cyan-400/30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.1, 0.03],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          background: 'radial-gradient(circle, currentColor 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 border-b border-foreground/10 p-4 text-foreground/50 flex justify-between items-center gap-2">
        <span className="text-[10px] break-words flex-1 min-w-0">
          NEURAL_ACTIVITY: {block.title}
        </span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-cyan-400 text-[10px] flex-shrink-0"
        >
          ● LIVE
        </motion.span>
      </div>

      {/* Mobile: Scan Line List with Decryption */}
      <div className="md:hidden relative z-10">
        {block.items.map((item, i) => (
          <MobileNeuralScanItem
            key={item.id}
            item={item}
            index={i}
            decryptedItems={decryptedItems}
            setDecryptedItems={setDecryptedItems}
            encryptedText={encryptedText}
          />
        ))}
      </div>

      {/* Desktop: Hover List */}
      <div className="hidden md:block relative z-10 divide-y divide-foreground/10">
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
                className="flex items-center justify-between gap-2"
              >
                <motion.span
                  key={isHovered ? 'decrypted' : 'encrypted'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-foreground/40 group-hover:text-cyan-400 transition-colors duration-300 text-[10px] break-words flex-1 min-w-0"
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
                  className="text-cyan-400 text-[10px] flex-shrink-0"
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
                    className="mt-3 pt-3 border-t border-foreground/10"
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
        <div className="relative z-10 border-t border-foreground/10 p-4 text-foreground/30 text-[10px]">
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
    <section id="capabilities" className="py-24 relative">
      {/* Mobile: Scan Line Indicator (visible line in center) - Hidden, only logic works */}
      {/* <div className="fixed left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-cyan-400/20 z-[9999] pointer-events-none md:hidden" /> */}

      <motion.div
        className="container mx-auto px-6 max-w-6xl"
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

        {/* Mobile: Single column with scan line */}
        <div className="md:hidden space-y-12">
          {CAPABILITIES.map((block, index) => (
            <motion.div
              key={block.id}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="min-w-0"
            >
              <div className="mb-2 font-mono text-sm text-foreground/50 break-words">
                {block.title}
              </div>
              <div className="mb-4 font-mono text-xs text-foreground/30 break-words">
                {block.subtitle}
              </div>
              {renderBlock(block)}
            </motion.div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {CAPABILITIES.map((block, index) => (
            <motion.div
              key={block.id}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="min-w-0"
            >
              <div className="mb-2 font-mono text-sm text-foreground/50 break-words">
                {block.title}
              </div>
              <div className="mb-4 font-mono text-xs text-foreground/30 break-words">
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
