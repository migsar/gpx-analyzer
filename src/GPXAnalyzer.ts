import { SAXParser } from 'https://unpkg.com/sax-ts@1.2.8/src/sax.ts';

interface ParserInterface {
  write: Function;
  close: Function;
  ontext: Function;
  onprocessinginstruction: Function;
  onsgmldeclaration: Function;
  ondoctype: Function;
  oncomment: Function;
  onopentagstart: Function;
  onattribute: Function;
  onopentag: Function;
  onclosetag: Function;
  onopencdata: Function;
  oncdata: Function;
  onclosecdata: Function;
  onerror: Function;
  onend: Function;
  onready: Function;
  onscript: Function;
  onopennamespace: Function;
  onclosenamespace: Function;
}

interface TagNode {
  name: string;
  attributes: Record<string,string>;
  isSelfClosing: boolean;
}

const LIMIT = 10;
let it = 0;

class GPXAnalyzer {
  parser: ParserInterface | null = null;
  // RootTag is used as flag
  rootTag: TagNode | null = null;
  tagQueue: string[] = [];
  documentNode = {};

  constructor() {
    // Why options is needed even if it is empty?
    const parser = new SAXParser(true /*strict*/, {} /*options*/);

    this.parser = parser;
    this.init();
  }

  init(): void {
    const { parser } = this;

    if (!parser) {
      return;
    }

    parser.ondoctype = this.logEvent.bind(this);
    parser.onerror = this.logEvent.bind(this);
    // parser.ontext = this.logEvent.bind(this);
    parser.onopentag = this.opentagHandler.bind(this);
    parser.onclosetag = this.closetagHandler.bind(this);
    // parser.onattribute = this.logEvent.bind(this);
    parser.onend = this.logEvent.bind(this);
  }

  logEvent(u: unknown) {
    console.debug(u);
  }

  errorHandler(e: any) {
    console.error(e);
  }

  textHandler(t: string) {
    // got some text.  t is the string of text.
    console.log('onText: ', t)
  }

  opentagHandler(node: TagNode) {
    if (++it > LIMIT) {
      return;
    }

    if (this.rootTag === null) {
      this.rootTag = node;
    }

    const { name, isSelfClosing } = node;

    this.tagQueue.push(name);

    console.log('onOpenTag: ', node)
  }

  closetagHandler(tagName: string) {
    if (++it > LIMIT) {
      return;
    }

    console.log('onCloseTag: ', tagName)
  }

  attributeHandler(attr: any) {
    // an attribute.  attr has "name" and "value"
    console.log('onAttribute: ', attr)
  }

  endHandler() {
    // parser stream is done, and ready to have more stuff written to it.
    console.warn('end of XML')
  }

  analyze(content: string): void {
    if (!this.parser) {
      return;
    }

    this.parser
      .write(content)
      .close();
  }
}

export default GPXAnalyzer;
