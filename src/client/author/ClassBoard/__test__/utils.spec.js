import { cleanup } from '@testing-library/react'
// import { capitalize, toUpper } from 'lodash'

describe('Testing the utils functions', () => {
  afterEach(() => {
    cleanup()
  })
  describe('Test #getAtlasSyncProviderName method', () => {
    // it('Verify schoology provider name', () => {
    //   expect(getAtlasSyncProviderName('Schoology', toUpper)).toBe('SCHOOLOGY')
    // })
    // it('Verify classlink provider name', () => {
    //   expect(getAtlasSyncProviderName('classlink', capitalize)).toBe(
    //     'Classlink'
    //   )
    // })
    // it('Verify clever provider name', () => {
    //   expect(getAtlasSyncProviderName('CLEVER', capitalize)).toBe('Clever')
    // })
    // it('Verify default case provider name', () => {
    //   expect(getAtlasSyncProviderName('xx', toUpper)).toBe('')
    // })
  })
})
