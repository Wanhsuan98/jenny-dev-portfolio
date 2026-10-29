/**
 * Sitemap 動態路由來源: 透過 Firestore REST API 列出公開的專案與報告。
 */
interface FirestoreListResponse {
  documents?: { name: string; fields?: Record<string, { booleanValue?: boolean }> }[]
}

export default defineSitemapEventHandler(async () => {
  const { firebaseProjectId, firebaseApiKey } = useRuntimeConfig().public
  if (!firebaseProjectId) return []

  const baseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents`

  const listDocs = (collection: string, fields: string[] = []) =>
    $fetch<FirestoreListResponse>(`${baseUrl}/${collection}`, {
      query: { key: firebaseApiKey, pageSize: 300, 'mask.fieldPaths': fields },
    })
      .then((res) => res.documents ?? [])
      .catch((err) => {
        console.error(`[sitemap] 無法讀取 ${collection}`, err)
        return []
      })

  const getId = (name: string) => name.split('/').pop()

  const [projects, reports] = await Promise.all([
    listDocs('projects', ['isLab']),
    listDocs('reports'),
  ])

  return [
    ...projects.map((doc) => ({
      loc: doc.fields?.isLab?.booleanValue
        ? `/lab/${getId(doc.name)}`
        : `/projects/${getId(doc.name)}`,
    })),
    ...reports.map((doc) => ({ loc: `/reports/${getId(doc.name)}` })),
  ]
})
