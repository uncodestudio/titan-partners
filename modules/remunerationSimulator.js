const debug = false

export function init() {
  const separator = ' _/_ '

  const query = (group, key, context) =>
    Array.from((context || document).querySelectorAll(`[cd-${group}="${key}"]`))
  const queryOne = (group, key, context) => (context || document).querySelector(`[cd-${group}="${key}"]`)
  const text = (group, key, context) => queryOne(group, key, context)?.textContent ?? ''

  const rowTemplate = queryOne('template', 'seniority_row')
  const pathRows = query('wrap', 'paths')
  const specialityInputs = query('input', 'speciality')
  const typologyInputs = query('input', 'typology')
  const jobInputs = query('input', 'job')

  if (!rowTemplate || !pathRows.length || !specialityInputs.length || !typologyInputs.length || !jobInputs.length) {
    return
  }

  const rowsContainer = rowTemplate.parentElement

  const getKey = (speciality, typology) => [speciality, typology].join(separator)
  const getVal = (selects) => selects[0]?.value ?? ''
  const setVal = (selects, value) => selects.forEach((select) => { select.value = value })

  const specialities = new Set()
  const typologies = new Set()
  const jobs = new Set()
  const orderByJob = {}
  const paths = {}

  pathRows.forEach((row) => {
    const speciality = text('text', 'speciality', row)
    const typology = text('text', 'typology', row)
    const job = text('text', 'job', row)
    const seniority = text('text', 'seniority', row)
    const jobOrder = Number(text('text', 'job_order', row))
    const result = text('text', 'result', row)

    specialities.add(speciality)
    typologies.add(typology)
    jobs.add(job)
    orderByJob[job] = jobOrder

    const key = getKey(speciality, typology)
    if (!paths[key]) paths[key] = {}
    paths[key][seniority] = result
  })

  if (debug) {
    console.log('paths', paths)
    console.log('specialities', specialities)
    console.log('typologies', typologies)
    console.log('jobs', jobs)
    console.log('orderByJob', orderByJob)
  }

  const initSelects = (selects, values) => {
    selects.forEach((select) => {
      Array.from(select.children).slice(1).forEach((option) => option.remove())
      values.filter(Boolean).forEach((value) => {
        const option = document.createElement('option')
        option.value = value
        option.textContent = value
        select.appendChild(option)
      })
    })

    selects.forEach((select) => {
      select.addEventListener('input', (event) => {
        selects.forEach((other) => { if (other !== event.target) other.value = event.target.value })
      })
    })
  }

  initSelects(specialityInputs, Array.from(specialities))
  initSelects(typologyInputs, Array.from(typologies))
  initSelects(jobInputs, Array.from(jobs).sort((a, b) => orderByJob[a] - orderByJob[b]))

  const updateAllowedTypologies = () => {
    const job = getVal(jobInputs)
    const speciality = getVal(specialityInputs)

    const allowedTypologies = Object.keys(paths)
      .filter((key) => !speciality || key.startsWith(speciality + separator))
      .map((key) => key.split(separator)[1])
      .filter((typology) => !(['Directeur', 'Manager', 'Senior Manager'].includes(job) && typology !== 'Big'))
      .filter((typology) => !(speciality === 'Arbitrage international' && ['Big', 'Cabinet Français en région'].includes(typology)))
      .filter((typology) => !(speciality === 'Droit public des affaires' && ['Américain', 'Anglosaxon'].includes(typology)))
      .filter((typology) => !(speciality === 'White collar' && ['Big', 'Cabinet Français à Paris'].includes(typology)))

    typologyInputs.forEach((select) => {
      Array.from(select.children).forEach((option) => {
        if (!option.value) return
        option.disabled = !allowedTypologies.includes(option.value)
      })
    })

    const typology = getVal(typologyInputs)
    if (!typology || !allowedTypologies.includes(typology)) {
      setVal(typologyInputs, '')
    }
  }

  specialityInputs.forEach((select) => select.addEventListener('input', updateAllowedTypologies))
  jobInputs.forEach((select) => select.addEventListener('input', updateAllowedTypologies))

  const updateResult = () => {
    const speciality = getVal(specialityInputs)
    const typology = getVal(typologyInputs)

    rowsContainer.innerHTML = ''

    if (!speciality || !typology) return

    const key = getKey(speciality, typology)
    const path = paths[key]

    if (!path) {
      console.warn(`Path ${key} not found`)
      return
    }

    Object.entries(path)
      .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
      .forEach(([seniority, result]) => {
        const clone = rowTemplate.cloneNode(true)
        queryOne('text', 'seniority', clone).textContent = seniority
        queryOne('text', 'result', clone).textContent = result
        rowsContainer.appendChild(clone)
      })
  }

  specialityInputs.forEach((select) => select.addEventListener('input', updateResult))
  typologyInputs.forEach((select) => select.addEventListener('input', updateResult))
  jobInputs.forEach((select) => select.addEventListener('input', updateResult))

  const submitButton = queryOne('button', 'submit')
  const resultTexts = query('text', 'result').filter((el) => !el.closest('[cd-wrap="paths"]'))

  submitButton?.addEventListener('click', () => {
    const speciality = getVal(specialityInputs)
    const typology = getVal(typologyInputs)
    const key = getKey(speciality, typology)
    const result = paths[key]

    if (!result) {
      console.warn(`Path ${key} not found`)
      return
    }

    if (debug) console.log('submit', key, '=>', result)

    const summary = Object.entries(result)
      .map(([seniority, value]) => `${seniority} : ${value}`)
      .join(' — ')

    resultTexts.forEach((el) => { el.textContent = summary })
  })
}
