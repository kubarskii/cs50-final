import { useEffect, useRef, useState } from 'react';
import WidgetsRegistry from '../core/widgets-registry/widgets-registry';
import MessagesStore from '../core/messages-store/messages-store';
import isEqual from '../utils/isEqual';

let wr;
let ms;

/**
 * React hook that encapsulates messagesStore
 * logic and creates subscription to messages changes
 *
 * @param props.initialMessages = [] - Initial messages to be shown, check Array<Message>
 * @param props.widgets = {} - Widgets to be registered in WidgetsRegistry,
 * will be used to get ReactNode based on widget name
 * */
export default function useChatbot(props) {
  const {
    initialMessages,
    widgets,
  } = props;
  const registryRef = useRef(wr || (wr = new WidgetsRegistry(widgets)));
  const messagesStoreRef = useRef(ms
      || (ms = new MessagesStore(initialMessages)));
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const msMessages = messagesStoreRef.current.getMessages();
    if (!isEqual(messages, msMessages) && msMessages.length) {
      setMessages(messagesStoreRef.current.getMessages());
    }
    const unsubscribe = messagesStoreRef.current
      .subscribe((v) => {
        setMessages(() => v);
      });
    return () => unsubscribe();
  }, []);

  return {
    registry: registryRef.current,
    messages,
    messagesStore: messagesStoreRef.current,
  };
}
