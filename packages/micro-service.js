export const loadPage = async (name) => {
  const manifest = await import('/microApps.json')
  const staticEntryPath = `/${manifest[name].entry}/entry.js`
  const { mount } = await import(staticEntryPath)
  mount(manifest[name].container)
}
