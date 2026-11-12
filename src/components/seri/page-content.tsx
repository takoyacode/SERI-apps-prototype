import { getSeriContent } from '@/lib/seri-content'
import type { ScreenName } from '@/lib/seri-types'
import { SeriScreen } from './screens'

export async function PageContent({ screen }: { screen: ScreenName }) {
  const content = await getSeriContent()
  return <SeriScreen screen={screen} content={content} />
}
