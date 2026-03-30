export function exportToCsv(filename, headers, rows) {
  const escapeCell = (value) => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return '"' + str.replace(/"/g, '""') + '"'
    }
    return str
  }

  const headerRow = headers.map((h) => escapeCell(h)).join(',')
  const dataRows = rows
    .map((row) => headers.map((h) => escapeCell(row[h] ?? '')).join(','))
    .join('\n')

  const csv = `${headerRow}\n${dataRows}`

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
