# Code Review: Найденные ошибки и исправления

## 🔴 Ошибка #1: Memory Leak в LenisProvider
**Файл:** `components/providers/lenis-provider.tsx`
**Проблема:** `requestAnimationFrame` не останавливается в cleanup, продолжает работать после unmount
**Исправление:** Сохранить rafId и отменить его в cleanup

## 🔴 Ошибка #2: Performance Issue в MagneticChip
**Файл:** `components/ui/magnetic-chip.tsx`
**Проблема:** `getBoundingClientRect()` вызывается на каждый кадр при движении мыши (60+ раз в секунду)
**Исправление:** Использовать `requestAnimationFrame` для throttling

## 🔴 Ошибка #3: SSR Error в StackSection
**Файл:** `components/sections/stack-section.tsx`
**Проблема:** `window.innerWidth` используется без проверки на SSR
**Исправление:** Добавить проверку `typeof window !== 'undefined'`

## 🔴 Ошибка #4: Memory Leak в useDeviceOrientation
**Файл:** `hooks/use-device-orientation.ts`
**Проблема:** Если permission granted, listener добавляется асинхронно, но cleanup может выполниться до этого
**Исправление:** Сохранить флаг и правильно очищать listener

## 🔴 Ошибка #5: Network Error Handling в ContactForm
**Файл:** `components/ui/contact-form.tsx`
**Проблема:** Нет обработки network errors (fetch может упасть с ошибкой сети)
**Исправление:** Добавить try-catch для network errors

## 🟡 Дополнительные улучшения:
- CustomCursor: handleMouseOut может вызывать мерцание
- BudgetFilter: useEffect с mediumTap в зависимостях может вызывать лишние срабатывания
- StatusIndicator: interval пересоздается при каждом изменении currentStatus

