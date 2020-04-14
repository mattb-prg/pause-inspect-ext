import Message from './types';

export function inspectElement(tabId: number) {
  return {
    tabId,
    type: Message.INSPECT_ELEMENT as const,
  }
}
