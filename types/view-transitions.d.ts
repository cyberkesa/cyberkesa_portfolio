/**
 * View Transitions API type definitions
 * Extends Document interface to support startViewTransition
 */

interface ViewTransition {
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  finished: Promise<void>
  skipTransition: () => void
}

interface Document {
  startViewTransition?: (callback?: () => void | Promise<void>) => ViewTransition
}

interface ViewTransitionOptions {
  duration?: number
  easing?: string
  pseudoElement?: string
}

interface Element {
  animate(
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions | ViewTransitionOptions
  ): Animation
}

