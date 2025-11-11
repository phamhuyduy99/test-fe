import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Thêm matchers từ jest-dom
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

expect.extend(matchers)

// Hoặc cách đơn giản hơn:
// import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})