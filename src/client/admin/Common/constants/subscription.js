export const SUBSCRIPTION_TYPES = {
  free: {
    subType: 'free',
    label: 'Free',
  },
  dataStudio: {
    subType: 'dataStudio',
    label: 'Data Studio',
  },
  premium: {
    subType: 'premium',
    label: 'Premium',
  },
  partialPremium: {
    subType: 'partial_premium',
    label: 'Partial Premium',
  },
  premiumPlusDataStudio: {
    subType: 'premiumPlusDataStudio',
    label: 'Premium + Data Studio',
  },
  enterprise: {
    subType: 'enterprise',
    label: 'Enterprise',
  },
  enterprisePlusDataStudio: {
    subType: 'enterprisePlusDataStudio',
    label: 'Enterprise + Data Studio',
  },
}

export const DISTRICT_SUBSCRIPTION_OPTIONS = [
  {
    key: SUBSCRIPTION_TYPES.free.subType,
    value: SUBSCRIPTION_TYPES.free.subType,
    label: SUBSCRIPTION_TYPES.free.label,
  },
  {
    key: SUBSCRIPTION_TYPES.enterprise.subType,
    value: SUBSCRIPTION_TYPES.enterprise.subType,
    label: SUBSCRIPTION_TYPES.enterprise.label,
  },
  {
    key: SUBSCRIPTION_TYPES.dataStudio.subType,
    value: SUBSCRIPTION_TYPES.dataStudio.subType,
    label: SUBSCRIPTION_TYPES.dataStudio.label,
  },
  {
    key: SUBSCRIPTION_TYPES.enterprisePlusDataStudio.subType,
    value: SUBSCRIPTION_TYPES.enterprisePlusDataStudio.subType,
    label: SUBSCRIPTION_TYPES.enterprisePlusDataStudio.label,
  },
]

export const ADDITIONAL_SUBSCRIPTION_TYPES = {
  TUTORME: 'tutorme',
}

export const SUBSCRIPTION_STATUS = {
  ARCHIVED: 0,
  ACTIVE: 1,
}
