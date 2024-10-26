import * as React from 'react';
import type { JSX as SolidJSX } from 'solid-js';
import type { JSX as PreactJSX } from 'preact';

// Interfaccia per le props specifiche del componente
export interface MyOwnSelectProps extends React.HTMLAttributes<HTMLElement> {

}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'my-own-select': React.DetailedHTMLProps<MyOwnSelectProps, HTMLElement>;
    }
  }
}
declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      'my-own-select': SolidJSX.HTMLAttributes<any> & { children: Element[]; "on:selection": (event: CustomEvent<any>) => void; };
    }
  }
}
declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      'my-own-select': PreactJSX.DetailedHTMLProps<any> ;
    }
  }
}
export class MyOwnSelect extends HTMLElement {
  //select wrapper element
  select: HTMLButtonElement | null = null
  //detect is browser is safari or firefox
  isFirefoxOrSafari =
    navigator.userAgent.toLowerCase().includes('firefox') ||
    (window as any).safari !== undefined

  /**
   * patchForOtherBrowser
   * @description if browser is different from Chrome apply this patch
   * for items container rendering in right position
   */
  patchForOtherBrowser() {
    let rects =
      this.shadowRoot!.getElementById('select')!.getBoundingClientRect()
    let select = this.shadowRoot!.getElementById('select')
    let list: any = select!.children[1]
    list.style.width = rects.width + 'px'
    list.style.left = rects.left + 'px'
    if (window.innerHeight - rects.top > list.clientHeight) {
      list.style.top = rects.height + rects.y + 'px'
    } else {
      list.style.top = rects.y - list.clientHeight + 'px'
    }
  }
  /**
   * getItemValue
   * @param {HTMLElement} el
   * @returns {{value:string, html:string}}
   * @description get value and innerText of selected element
   */
  getItemValue(el: HTMLElement) {
    const item = this.searchAItem(el)
    return {
      value: item.children[0].getAttribute('option-value'),
      html: (item.children[0] as HTMLElement).innerText,
    }
  }
  /**
   * searchAItem
   * @param {HTMLElement} item
   * @returns {HTMLElement}
   * @description search A tag
   */
  searchAItem(item: HTMLElement): HTMLElement {
    if (item.tagName === 'A') return item
    if (item.parentElement!.tagName === 'A')
      return item.parentElement as HTMLElement
    return this.searchAItem(item.parentElement as HTMLElement)
  }
  /**
   * clickItem
   * @param {Event} event
   * @description handle click event on select items
   */
  clickItem(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    let item = this.getItemValue(this.searchAItem(event.target as HTMLElement))
    this.select!.children[0]!.innerHTML = item.html
    ;(this.select!.previousElementSibling as HTMLElement).focus()
    this.select!.blur()
    if (item.value) {
      this.setAttribute('value', item.value)
    } else {
      this.removeAttribute('value')
    }
    this.emit('selection', { value: item.value??item.html })
  }
  /**
   * selectElement
   * @param {Event} event
   * @description select an item when cursor is on it
   */
  selectElement(event: Event) {
    let items = Array.prototype.slice.call(
      this.searchAItem(event.target as HTMLElement).parentElement!.children
    )
    let selectedElementIndex = items.findIndex(
      (e) =>
        e.hasAttribute('part') && e.getAttribute('part') === 'item-selected'
    )
    if (selectedElementIndex !== -1) {
      items.forEach((el) => {
        const element = this.searchAItem(el)
        if (
          !element.hasAttribute('part') ||
          element.getAttribute('part') !== 'item'
        ) {
          element.setAttribute('part', 'item')
        }
      })
    }
    this.searchAItem(event.target as HTMLElement).setAttribute(
      'part',
      'item-selected'
    )
  }
  /**
   * focusSelect
   * @param {KeyboardEvent} event
   * @description handle focus event
   */
  focusSelect(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.select!.focus()
    }
  }
  /**
   * keyup
   * @param {KeyboardEvent} event
   * @description handle keyup event
   */
  keyup(event: KeyboardEvent) {
    let items = Array.prototype.slice.call(
      (event.target as HTMLElement)!.children[1].children
    )
    let domElements = (event.target as HTMLElement)!.children[1].children
    let selectedElementIndex = items.findIndex(
      (e) =>
        e.hasAttribute('part') && e.getAttribute('part') === 'item-selected'
    )
    if (event.key === 'Enter') {
      if (selectedElementIndex !== -1) {
        let itemValue = this.getItemValue(items[selectedElementIndex])
        ;(event.target as HTMLElement)!.children[0].innerHTML = itemValue.html
        ;(
          (event.target as HTMLElement)!.previousElementSibling as HTMLElement
        ).focus()
        ;(event.target as HTMLElement)!.blur()
        if (itemValue.value) {
          this.setAttribute('value', itemValue.value)
        } else {
          this.removeAttribute('value')
        }
        this.emit('selection', { value: itemValue.value??itemValue.html })
      }
    }
    if (event.key === 'ArrowDown') {
      items.forEach((el: HTMLElement) => {
        if (!el.hasAttribute('part') || el.getAttribute('part') !== 'item') {
          el.setAttribute('part', 'item')
        }
      })
      if (selectedElementIndex === -1) {
        domElements[0].setAttribute('part', 'item-selected')
        domElements[0].scrollIntoView({ block: 'end' })
        let itemValue = this.getItemValue(items[0])
        this.emit('selection', {value : itemValue.value??itemValue.html})
      } else {
        domElements[selectedElementIndex].removeAttribute('part')
        domElements[selectedElementIndex].setAttribute('part', 'item')
        if (domElements[selectedElementIndex + 1]) {
          domElements[selectedElementIndex + 1].setAttribute(
            'part',
            'item-selected'
          )
          domElements[selectedElementIndex + 1].scrollIntoView({
            block: 'end',
          })
          let itemValue = this.getItemValue(items[selectedElementIndex + 1])
          ;(event.target as HTMLElement)!.children[0].innerHTML = itemValue.html
          if (itemValue.value) {
            this.setAttribute('value', itemValue.value)
          } else {
            this.removeAttribute('value')
          }
        this.emit('selection', {value : itemValue.value??itemValue.html})

        } else {
          domElements[0].removeAttribute('part')
          domElements[0].setAttribute('part', 'item-selected')
          domElements[0].scrollIntoView({ block: 'start' })
          let itemValue = this.getItemValue(items[0])
          ;(event.target as HTMLElement)!.children[0].innerHTML = itemValue.html
          if (itemValue.value) {
            this.setAttribute('value', itemValue.value)
          } else {
            this.removeAttribute('value')
          }
          this.emit('selection', {value: itemValue.value??itemValue.html})
        }
      }
    }
    if (event.key === 'ArrowUp') {
      items.forEach((el: HTMLElement) => {
        if (!el.hasAttribute('part') || el.getAttribute('part') !== 'item') {
          el.setAttribute('part', 'item')
        }
      })
      if (selectedElementIndex === -1) {
        domElements[domElements.length - 1].setAttribute(
          'part',
          'item-selected'
        )
        domElements[domElements.length - 1].scrollIntoView({ block: 'start' })
        let itemValue = this.getItemValue(items[domElements.length - 1])
        this.emit('selection', {value: itemValue.value??itemValue.html})

      } else {
        domElements[selectedElementIndex].removeAttribute('part')
        domElements[selectedElementIndex].setAttribute('part', 'item')
        if (domElements[selectedElementIndex - 1]) {
          domElements[selectedElementIndex - 1].removeAttribute('part')
          domElements[selectedElementIndex - 1].setAttribute(
            'part',
            'item-selected'
          )
          domElements[selectedElementIndex - 1].scrollIntoView({
            block: 'start',
          })
          let itemValue = this.getItemValue(items[selectedElementIndex - 1])
          ;(event.target as HTMLElement)!.children[0].innerHTML = itemValue.html
          if (itemValue.value) {
            this.setAttribute('value', itemValue.value)
          } else {
            this.removeAttribute('value')
          }
          this.emit('selection', {value: itemValue.value??itemValue.html})
        } else {
          domElements[domElements.length - 1].removeAttribute('part')
          domElements[domElements.length - 1].setAttribute(
            'part',
            'item-selected'
          )
          domElements[domElements.length - 1].scrollIntoView({ block: 'end' })
          let itemValue = this.getItemValue(items[domElements.length - 1]);
          (event.target as HTMLElement)!.children[0].innerHTML = itemValue.html
          if (itemValue.value) {
            this.setAttribute('value', itemValue.value)
          } else {
            this.removeAttribute('value')
          }
          this.emit('selection', {value: itemValue.value??itemValue.html})
        }
      }
    }
  }
  /**
   * loadOptionsContainer
   * @description load options container in right position
   */
  loadOptionsContainer() {
    if (this.isFirefoxOrSafari) {
      this.patchForOtherBrowser()
    } else {
      let list: any = this.shadowRoot!.getElementById('list')
      if (!this.isElementInViewport(list)) {
        if (list.style.bottom.includes('top')) {
          list.style.top = 'calc(anchor(bottom))'
          list.style.bottom = 'unset'
        } else {
          list.style.bottom = `calc(anchor(top))`
          list.style.top = 'unset'
        }
      }
    }
  }
  /**
   *
   * @param {HTMLElement} el
   * @param {boolean} partiallyVisible
   * @returns {boolean}
   * @description check if an element is visible or partial visible in the window
   */
  isElementInViewport = (el: HTMLElement, partiallyVisible = false) => {
    const rects = el.getBoundingClientRect()
    return partiallyVisible
      ? ((rects.top > 0 && rects.top < window.innerHeight) ||
          (rects.bottom > 0 && rects.bottom < window.innerHeight)) &&
          ((rects.left > 0 && rects.left < window.innerWidth) ||
            (rects.right > 0 && rects.right < window.innerWidth))
      : rects.top >= 0 &&
          rects.left >= 0 &&
          rects.bottom <= window.innerHeight &&
          rects.right <= window.innerWidth
  }
  /**
   * distributeChildren
   * @description distribute children and replace slot content
   */
  distributeChildren() {
    const slot: any = this.shadowRoot!.querySelector('slot')
    slot.addEventListener('slotchange', () => {
      const assignedNodes = slot.assignedNodes()
      slot.remove()
      const listContainer: any = this.shadowRoot!.querySelector('#list')
      assignedNodes.forEach((node: any) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const wrapper = document.createElement('a')
          wrapper.setAttribute('part', 'item')
          wrapper.appendChild(node)
          listContainer.appendChild(wrapper)
        }
      })
      Array.prototype.slice
        .call(this.shadowRoot!.getElementById('list')!.children)
        .forEach((element) => {
          element.addEventListener('click', this.clickItem.bind(this))
          element.addEventListener('mouseover', this.selectElement.bind(this))
        })
    })
  }
  /**
   * Emit a custom event
   * @param  {String} type The event type
   * @param  {Object} detail Any details to pass along with the event
   */
  emit(type: string, detail = {}) {
    let event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail,
    })
    return this.dispatchEvent(event)
  }
  constructor() {
    super()
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = `
#select #list a{
    padding: 5px;
    box-sizing: border-box;
  }
  #select #list{
    visibility:hidden;
    pointer-events:none;
    position:fixed;
    border-radius: 10px;
    border: 1px solid black;
    background:lightgray;
    overflow-y: auto;
    max-height:300px;
    box-shadow: 1px 1px 1px black;
    top:calc(anchor(bottom));
    z-index:1000000;
    position-anchor: --items;
    left: anchor(left);
    right:anchor(right);
  }
  #select{
    background: white;
    display: flex;
    align-items: center;
    border: 1px solid black;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    text-align: left;
    anchor-name: --items;
    position:relative;
    width: 300px;
    height: 40px;
  }
  #select svg{
    max-width: 20px;
    width: 20px;
    height: 20px;;
    margin-left: auto;
  }
  #select:focus-within #list{
    visibility:visible;
    pointer-events:all;
    display:flex;
    flex-direction:column;
  }
  #select:focus-within #list a[part=item-selected]{
    background:blue;
    color: white;
  }`;
    shadow.innerHTML = `
        <button
            id="focusButton"
            style="position: fixed; top: 900%;outline: none;"
            }>
        </button>
        <button id="select" part="select" >
            <div id="selectedElement">select a value</div>
            <div id="list" part="itemsContainer">
                <slot></slot>
            </div>
            <slot name="arrowImg">
                <svg
                fill="#000000"
                height="800px"
                width="800px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 407.437 407.437"
                xml:space="preserve"
                >
                <polygon
                    points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 "
                />
                </svg>
            </slot>
        </button>`;
    shadow.appendChild(style)
    this.select = shadow.getElementById('select') as HTMLButtonElement
    this.select.addEventListener('keyup', this.keyup.bind(this))
    this.select.addEventListener('focus', this.loadOptionsContainer.bind(this))
    shadow
      .getElementById('focusButton')!
      .addEventListener('keyup', this.focusSelect.bind(this))
    this.distributeChildren()
    this.loadOptionsContainer()
  }
  disconnectedCallback() {}
  static get observedAttributes() {
    return []
  }
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {}
  adoptedCallback() {}
}

customElements.define('my-own-select', MyOwnSelect);
