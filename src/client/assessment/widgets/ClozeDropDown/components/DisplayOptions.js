import React from 'react'

const DisplayOptions = ({ options = {}, responseIds = [] }) => {
  const userOptions = responseIds.map((item) => options[item.id])

  return (
    <div>
      <h3 style={{ fontWeight: 700 }}> Options: </h3>
      {userOptions.map((item, index) => (
        <div>
          <span style={{ fontWeight: 700 }}> {index + 1}.) </span>{' '}
          {item.join(', ')}
        </div>
      ))}
    </div>
  )
}

export default DisplayOptions
