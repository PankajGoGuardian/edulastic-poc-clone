import { useState } from 'react'

const useSaveFormData = ({ formType }) => {
  const [formData, setFormData] = useState({ formType })

  const handleFieldDataChange = (field, value) => {
    console.log('field', field)
    console.log('value', value)
    // TODO clear data when fields get hidden
    setFormData({ ...formData, [field]: value })
  }

  return { formData, handleFieldDataChange }
}

export default useSaveFormData
