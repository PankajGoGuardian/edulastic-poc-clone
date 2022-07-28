import { cleanup } from '@testing-library/react'
import { convertStringToFile } from '../helpers'

jest.mock('../Firebase')

describe('Testing the helpers', () => {
  afterEach(() => {
    cleanup()
  })
  describe('Testing convertStringToFile in helpers', () => {
    it('verify convert file with file name', () => {
      const result = convertStringToFile({ name: 'dummy' }, 'temp.txt')
      expect(result.name).toBe('temp.txt')
    })
    it('verify convert file with out file name', () => {
      const result = convertStringToFile({ name: 'dummy' })
      expect(result.name).toContain('scratchpad')
    })
  })
})
