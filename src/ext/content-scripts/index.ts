import 'chrome-extension-async';
import '../../shared/lib/logger';
import logger from '../../shared/lib/logger';

declare global {
  interface Window {
    latestTarget: EventTarget
  }
}

async function main() {
  let skip = false
  const frames: Window[] = [window]

  window.latestTarget = null

  const overListener = ({ target }: MouseEvent) => {
    if (skip) {
      skip = false
      return
    }

    window.latestTarget = target
  }

  const downListener = (ev: MouseEvent) => {
    if (ev.button === 2) {
      skip = true
    }
  }

  const addListener = (el: Window) => {
    el.addEventListener('mouseover', overListener)
    el.addEventListener('mousedown', downListener)
  }

  addListener(window)

  // This section is for a personal solution where the components I wanted to
  // inspect are contained in iframes
  setInterval(() => {
    frames.forEach((f) => {
      let ifs: NodeListOf<HTMLIFrameElement>
      try {
        ifs = f.document.querySelectorAll('iframe')
      } catch (err) {
        return
      }

      ifs.forEach(({ contentWindow }) => {
        if (frames.indexOf(contentWindow) === -1) {
          try {
            contentWindow.document
            addListener(contentWindow)
            frames.push(contentWindow)
          } catch (err) {
            logger.debug('Could not read iframe: ', err)
          }
        }
      })

    })
  }, 400)

}
main()
