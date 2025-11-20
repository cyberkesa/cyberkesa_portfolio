# Code Review Fixes - Round 2 (10 Bugs)

This document outlines 10 additional bugs identified during the second code review and their respective fixes.

---

## 1. Memory Leak in `useDeviceOrientation` (isListenerAdded variable)

**Problem:** The `isListenerAdded` variable was declared as a local `let` variable inside the `useEffect` hook. When the permission promise resolves after the component unmounts, the cleanup function might reference a stale closure where `isListenerAdded` was never set to `true`, leading to a memory leak where the event listener is never removed.

**Location:** `hooks/use-device-orientation.ts`

**Fix:**
Changed `isListenerAdded` from a local variable to a `useRef` so it persists across renders and can be correctly checked in the cleanup function, even if the permission promise resolves after unmount.

```typescript
// hooks/use-device-orientation.ts
const isListenerAddedRef = useRef(false)

// In useEffect:
isListenerAddedRef.current = true

// In cleanup:
if (isListenerAddedRef.current) {
  window.removeEventListener('deviceorientation', handleOrientation, true)
  isListenerAddedRef.current = false
}
```

---

## 2. Memory Leak in `EasterEgg` (setTimeout not cleaned up)

**Problem:** The `setTimeout` that resets the `isTriggered` state after 3 seconds was not stored or cleaned up. If the component unmounts before the timeout fires, React will try to update state on an unmounted component, causing a memory leak and potential errors.

**Location:** `components/ui/easter-egg.tsx`

**Fix:**
Stored the timeout ID in a `useRef` and added cleanup in a `useEffect` to ensure it's cancelled on unmount.

```typescript
// components/ui/easter-egg.tsx
const timeoutRef = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
}, [])

// In handleTrigger:
timeoutRef.current = setTimeout(() => {
  setIsTriggered(false)
  timeoutRef.current = null
}, 3000)
```

---

## 3. Memory Leak and Poor UX in `ContactForm` (setTimeout + alert)

**Problem:** 
- The `setTimeout` for resetting the form after submission was not cleaned up on unmount.
- Error handling used `alert()`, which is a poor user experience and not accessible.

**Location:** `components/ui/contact-form.tsx`

**Fix:**
- Added `timeoutRef` with cleanup to prevent memory leaks.
- Replaced `alert()` with a proper error state and UI component that displays errors inline.

```typescript
// components/ui/contact-form.tsx
const [error, setError] = useState<string | null>(null)
const timeoutRef = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
}, [])

// In handleSubmit:
setError(null) // Clear previous errors
// ... error handling
setError(errorMessage) // Set error state instead of alert()

// In JSX:
{error && (
  <motion.div className="mb-4 flex items-center gap-2 font-mono text-xs text-red-500">
    <X className="h-4 w-4" />
    <span>{error}</span>
  </motion.div>
)}
```

---

## 4. Memory Leak in `HeroSection` (nested setTimeout)

**Problem:** The nested `setTimeout` that delays setting `isDeleting` to `true` was not stored or cleaned up. This could lead to state updates on unmounted components and memory leaks.

**Location:** `components/sections/hero-section.tsx`

**Fix:**
Stored the nested timeout in a `useRef` and ensured it's cleared in the cleanup function.

```typescript
// components/sections/hero-section.tsx
const nestedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
  // Clear nested timeout on unmount or dependency change
  if (nestedTimeoutRef.current) {
    clearTimeout(nestedTimeoutRef.current)
    nestedTimeoutRef.current = null
  }

  // ... timeout logic
  nestedTimeoutRef.current = setTimeout(() => setIsDeleting(true), 2000)

  return () => {
    clearTimeout(timeout)
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current)
      nestedTimeoutRef.current = null
    }
  }
}, [displayText, currentIndex, isDeleting])
```

---

## 5. SSR Error in `CustomCursor` (window.innerWidth access)

**Problem:** The `checkDesktop()` function was called immediately in the `useEffect` without checking if `window` is available, which could cause SSR errors.

**Location:** `components/ui/custom-cursor.tsx`

**Fix:**
Added `typeof window === 'undefined'` check at the start of the `useEffect` before accessing `window.innerWidth`.

```typescript
// components/ui/custom-cursor.tsx
useEffect(() => {
  if (typeof window === 'undefined') return

  const checkDesktop = () => {
    setIsDesktop(window.innerWidth >= 768)
  }
  // ... rest of code
}, [])
```

---

## 6. SSR Error and Division by Zero in `useScrollProgress`

**Problem:**
- `document.documentElement` was accessed without checking if `document` is available (SSR error).
- No check for division by zero if `winHeightPx` is 0.
- No clamping of scroll progress value (could be negative or > 1).

**Location:** `hooks/use-scroll-progress.ts`

**Fix:**
Added SSR checks, division by zero protection, and value clamping.

```typescript
// hooks/use-scroll-progress.ts
useEffect(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const updateScrollProgress = () => {
    const scrollPx = document.documentElement.scrollTop
    const winHeightPx =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const scrolled = winHeightPx > 0 ? scrollPx / winHeightPx : 0
    setScrollProgress(Math.min(Math.max(scrolled, 0), 1)) // Clamp between 0 and 1
  }
  // ... rest of code
}, [])
```

---

## 7. Missing Dependency in `BudgetFilter` useEffect

**Problem:** The `mediumTap` function was used in the `useEffect` dependency array, but it was excluded with an eslint-disable comment. While this might work, it can lead to stale closures if `mediumTap` changes.

**Location:** `components/ui/budget-filter.tsx`

**Fix:**
Added `mediumTap` to the dependency array to ensure the effect uses the latest version of the function.

```typescript
// components/ui/budget-filter.tsx
useEffect(() => {
  if (isHighBudget && value >= HIGH_THRESHOLD) {
    mediumTap()
  }
}, [isHighBudget, value, mediumTap]) // Added mediumTap to dependencies
```

---

## 8. Potential Undefined in `StatusIndicator` (non-null assertion)

**Problem:** The `statusMessages.find()` could potentially return `undefined` if no matching status is found, but a non-null assertion operator (`!`) was used, which could cause a runtime error.

**Location:** `components/ui/status-indicator.tsx`

**Fix:**
Added a fallback to the first status message if no match is found, instead of using a non-null assertion.

```typescript
// components/ui/status-indicator.tsx
const status = statusMessages.find((s) => s.status === currentStatus) || statusMessages[0]
```

---

## 9. Missing Null Check in `FluidBackground` (material access)

**Problem:** The code accessed `mesh.current.material` and `material.uniforms` without checking if `material` exists, which could cause runtime errors if the material hasn't been initialized yet.

**Location:** `components/visuals/fluid-background.tsx`

**Fix:**
Added proper null checks before accessing material properties.

```typescript
// components/visuals/fluid-background.tsx
useEffect(() => {
  if (mesh.current && mesh.current.material) {
    const material = mesh.current.material as THREE.ShaderMaterial
    if (material && material.uniforms) {
      // ... update uniforms
    }
  }
}, [theme])
```

---

## 10. Missing Validation and XSS Protection in Contact API Route

**Problem:**
- No email format validation.
- No input sanitization (potential XSS vulnerability in email HTML).
- No bounds checking for budget value.
- Inputs not truncated to prevent abuse.

**Location:** `app/api/contact/route.ts`

**Fix:**
Added email validation, input sanitization, bounds checking, and length limits.

```typescript
// app/api/contact/route.ts
// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  return NextResponse.json(
    { error: 'Invalid email format' },
    { status: 400 }
  )
}

// Sanitize inputs (basic XSS prevention)
const sanitizedName = String(name).trim().substring(0, 200)
const sanitizedEmail = String(email).trim().substring(0, 200)
const sanitizedMessage = String(message).trim().substring(0, 5000)
const sanitizedBudget = Math.max(0, Math.min(Number(budget) || 0, 1000000))

// Use sanitized values in email HTML (escape HTML)
<p><strong>Name:</strong> ${sanitizedName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
```

---

## Summary

All 10 bugs have been fixed:
1. ✅ Memory leak in `useDeviceOrientation` (useRef for isListenerAdded)
2. ✅ Memory leak in `EasterEgg` (setTimeout cleanup)
3. ✅ Memory leak and poor UX in `ContactForm` (setTimeout cleanup + replace alert)
4. ✅ Memory leak in `HeroSection` (nested setTimeout cleanup)
5. ✅ SSR error in `CustomCursor` (window check)
6. ✅ SSR error and division by zero in `useScrollProgress` (document check + clamping)
7. ✅ Missing dependency in `BudgetFilter` (add mediumTap to deps)
8. ✅ Potential undefined in `StatusIndicator` (fallback value)
9. ✅ Missing null check in `FluidBackground` (material existence check)
10. ✅ Missing validation and XSS protection in Contact API route (email validation + sanitization)

