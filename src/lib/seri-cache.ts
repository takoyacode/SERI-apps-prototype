import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

const paths = ['/', '/rutinitas', '/explore', '/profil', '/check-in', '/progres', '/tanya']
function invalidate() {
  try {
    revalidateTag('seri-content', { expire: 0 })
    for (const path of paths) revalidatePath(path)
  } catch (error) {
    // CLI seeds have no Next request store; Admin writes do, and invalidate immediately.
    if (
      error instanceof Error &&
      /static generation store|incremental cache|request scope/i.test(error.message)
    ) {
      console.warn('SERI: CLI content write completed outside Next; the next build will read it.')
    } else {
      throw error
    }
  }
}
export const contentChanged: CollectionAfterChangeHook = ({ doc }) => {
  invalidate()
  return doc
}
export const contentDeleted: CollectionAfterDeleteHook = ({ doc }) => {
  invalidate()
  return doc
}
export const settingsChanged: GlobalAfterChangeHook = ({ doc }) => {
  invalidate()
  return doc
}
