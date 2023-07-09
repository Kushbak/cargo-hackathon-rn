export const dataToSelect = (data: Record<string, any>[]) => {
  return data.map(item => ({
    value: item.id,
    label: item.title || item.name
  }))
}
