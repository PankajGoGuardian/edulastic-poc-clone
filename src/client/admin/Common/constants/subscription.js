export const SUBSCRIPTION_TYPES = {
  free: {
    subType: 'free',
    label: 'Free',
  },
  premium: {
    subType: 'premium',
    label: 'Premium',
  },
  partialPremium: {
    subType: 'partial_premium',
    label: 'Partial Premium',
  },
  enterprise: {
    subType: 'enterprise',
    label: 'Enterprise',
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
]

export const ADDITIONAL_SUBSCRIPTION_TYPES = {
  TUTORME: 'tutorme',
  DATA_WAREHOUSE_REPORTS: 'data_warehouse_reports',
}

export const DATA_STUDIO_LABEL = 'Data Studio'

export const SUBSCRIPTION_STATUS = {
  ARCHIVED: 0,
  ACTIVE: 1,
}
