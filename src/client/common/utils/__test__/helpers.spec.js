import { isDistrictPolicyAllowed } from '../helpers'

describe('testing helperUtils', () => {
  describe('testing isDistrictPolicyAllowed function for atlasSignOn and schoologySignOn', () => {
    // testing atlasSignOn
    it('testing atlasSignOn when the field is undefined', () => {
      const result = isDistrictPolicyAllowed(
        'https://app.edulastic.com/district/test',
        {},
        'atlasSignOn'
      )
      expect(result).toBe(false)
    })

    it('testing atlasSignOn when the field is false', () => {
      const result = isDistrictPolicyAllowed(
        'https://app.edulastic.com/district/test',
        { atlasSignOn: false },
        'atlasSignOn'
      )
      expect(result).toBe(false)
    })

    it('testing atlasSignOn when the field is true', () => {
      const result = isDistrictPolicyAllowed(
        'https://app.edulastic.com/district/test',
        { atlasSignOn: true },
        'atlasSignOn'
      )
      expect(result).toBe(true)
    })

    // testing schoologySignOn
    it('testing schoologySignOn when the field is undefined', () => {
      const result = isDistrictPolicyAllowed(
        'https://app.edulastic.com/district/test',
        {},
        'schoologySignOn'
      )
      expect(result).toBe(false)
    })

    it('testing schoologySignOn when the field is false', () => {
      const result = isDistrictPolicyAllowed(
        'https://app.edulastic.com/district/test',
        { schoologySignOn: false },
        'schoologySignOn'
      )
      expect(result).toBe(false)
    })

    it('testing schoologySignOn when the field is true', () => {
      const result = isDistrictPolicyAllowed(
        'https://app.edulastic.com/district/test',
        { schoologySignOn: true },
        'schoologySignOn'
      )
      expect(result).toBe(true)
    })
  })
})
