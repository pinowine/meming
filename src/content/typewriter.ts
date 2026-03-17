// typewriter renderer specifically for content script and shadow dom
// reference: matches the TypewriterCore interface in `src/lib/playTyping.ts`

// I have done oop language (c#) before, so class is not a new concept for me. And I also have used a lot of p5 classes before.
// But anyway, this is the reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class

export class DOMTypewriter {
  private container: HTMLElement;
  private queue: Array<() => Promise<void>> = [];
  private textContent: string = "";

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // execute a standard typing animation char-by-char
  typeString(text: string): this {
    this.queue.push(async () => {
      // basic typing animation delay loop
      for (const char of text) {
        this.textContent += char;
        this.container.textContent = this.textContent;
        await this.delay(30); // 30ms per char
      }
    });
    return this;
  }

  pauseFor(ms: number): this {
    this.queue.push(async () => {
      await this.delay(ms);
    });
    return this;
  }

  // visually delete characters from the end of the text
  deleteChars(count: number): this {
    this.queue.push(async () => {
      for (let i = 0; i < count; i++) {
        if (this.textContent.length > 0) {
          this.textContent = this.textContent.slice(0, -1);
          this.container.textContent = this.textContent;
          await this.delay(20); // slightly faster deletion
        }
      }
    });
    return this;
  }

  // clear all texts in the container immediately
  deleteAll(): this {
    this.queue.push(async () => {
      this.textContent = "";
      this.container.textContent = this.textContent;
      await this.delay(50);
    });
    return this;
  }

  callFunction(cb: () => void): this {
    this.queue.push(async () => {
      cb();
    });
    return this;
  }

  async start(): Promise<void> {
    for (const task of this.queue) {
      await task();
    }
    // clear queue after finishing all tasks
    this.queue = [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
