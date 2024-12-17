import { styles } from './styles'
import { template } from './template'
import './types'
const customEventName = 'selection'
const optionValueAttributeName = 'option-value'
const selectedItemPartName = 'item-selected'
const itemPartName = 'item'
const placeholderValueAttributeName = 'option-placeholder'
const placeholderDefaultText = 'select a value'

export class MyOwnSelect extends HTMLElement {
  //select wrapper element
  select: HTMLButtonElement | null = null
  static formAssociated = true

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
   * @description get value and textContent of selected element
   */
  getItemValue(el: HTMLElement) {
    const item = this.searchAItem(el)
    return {
      value:
        item.children[0].getAttribute(placeholderValueAttributeName) !== null
          ? ''
          : item.children[0].getAttribute(optionValueAttributeName) !== null
            ? item.children[0].getAttribute(optionValueAttributeName)
            : item.children[0].textContent,
      html: (item.children[0] as HTMLElement).textContent,
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

  searchOptionValueAttribute(item: HTMLElement): string {
    if (item.children.length === 0)
      return item.getAttribute('option-value') ?? item.textContent!
    return this.searchOptionValueAttribute(item.children[0] as HTMLElement)
  }
  searchOptionPlaceholderAttribute(item: HTMLElement): string | undefined {
    if (item.children.length === 0)
      return item.getAttribute(placeholderValueAttributeName)!
    return this.searchOptionPlaceholderAttribute(
      item.children[0] as HTMLElement
    )
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
    let item = this.getItemValue(event.target as HTMLElement)
    this.select!.children[0]!.innerHTML = item.html!
    ;(this.select!.previousElementSibling as HTMLElement).focus()
    this.select!.blur()
    this._value = item.value!
    // this.setAttribute('value', item.value!);
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
        e.hasAttribute('part') &&
        e.getAttribute('part') === selectedItemPartName
    )
    if (selectedElementIndex !== -1) {
      items.forEach((el) => {
        const element = this.searchAItem(el)
        if (
          !element.hasAttribute('part') ||
          element.getAttribute('part') !== itemPartName
        ) {
          element.setAttribute('part', itemPartName)
        }
      })
    }
    this.searchAItem(event.target as HTMLElement).setAttribute(
      'part',
      selectedItemPartName
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
   * bindInitialValue
   * @param {string} value
   * @returns {string | undefined}
   * @description set initialValue to select when the element is rendered
   */
  bindInitialValue(value: string | null = ''): string | undefined | null {
    let items = Array.prototype.slice.call(
      (this.shadowRoot?.getElementById('list'))!.children
    )
    let placeholder = items.find(
      (i) => this.searchOptionPlaceholderAttribute(i) !== null
    )
    let foundValue = items.find(
      (i) =>
        this.searchOptionValueAttribute(i) !== null &&
        this.searchOptionValueAttribute(i) === value
    )

    let returnValue =
      foundValue ?? placeholder?.textContent ?? placeholderDefaultText
    items.forEach((el: HTMLElement) => {
      el.setAttribute('part', itemPartName)
      let placeholder = el.children[0].getAttribute('option-placeholder')
      if (
        (placeholder !== null && placeholder === value) ||
        this.searchOptionValueAttribute(el) === value
      ) {
        el.setAttribute('part', selectedItemPartName)
        returnValue = this.searchOptionValueAttribute(el)
      }
    })
    return returnValue
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
        e.hasAttribute('part') &&
        e.getAttribute('part') === selectedItemPartName
    )
    if (event.key === 'Enter') {
      if (selectedElementIndex !== -1) {
        let itemValue = this.getItemValue(items[selectedElementIndex])
        ;(event.target as HTMLElement)!.children[0].innerHTML = itemValue.html!
        ;(
          (event.target as HTMLElement)!.previousElementSibling as HTMLElement
        ).focus()
        ;(event.target as HTMLElement)!.blur()
        if (itemValue.value) {
          this.setAttribute('value', itemValue.value)
        } else {
          this.removeAttribute('value')
        }
        this.setAttribute('value', itemValue.value ?? itemValue.html!)
      }
    }
    if (event.key === 'ArrowDown') {
      items.forEach((el: HTMLElement) => {
        if (
          !el.hasAttribute('part') ||
          el.getAttribute('part') !== itemPartName
        ) {
          el.setAttribute('part', itemPartName)
        }
      })
      if (selectedElementIndex === -1) {
        domElements[0].setAttribute('part', selectedItemPartName)
        domElements[0].scrollIntoView({ block: 'end' })
        let itemValue = this.getItemValue(items[0])
        this.setAttribute('value', itemValue.value ?? itemValue.html!)
      } else {
        domElements[selectedElementIndex].removeAttribute('part')
        domElements[selectedElementIndex].setAttribute('part', itemPartName)
        domElements[selectedElementIndex].setAttribute('part', itemPartName)
        if (domElements[selectedElementIndex + 1]) {
          domElements[selectedElementIndex + 1].setAttribute(
            'part',
            selectedItemPartName
          )
          domElements[selectedElementIndex + 1].scrollIntoView({
            block: 'end',
          })
          let itemValue = this.getItemValue(items[selectedElementIndex + 1])
          ;(event.target as HTMLElement)!.children[0].innerHTML =
            itemValue.html!
          this.setAttribute('value', itemValue.value ?? itemValue.html!)
        } else {
          domElements[0].removeAttribute('part')
          domElements[0].setAttribute('part', selectedItemPartName)
          domElements[0].setAttribute('part', selectedItemPartName)
          domElements[0].scrollIntoView({ block: 'start' })
          let itemValue = this.getItemValue(items[0])
          ;(event.target as HTMLElement)!.children[0].innerHTML =
            itemValue.html!
          this.setAttribute('value', itemValue.value ?? itemValue.html!)
        }
      }
    }
    if (event.key === 'ArrowUp') {
      items.forEach((el: HTMLElement) => {
        if (
          !el.hasAttribute('part') ||
          el.getAttribute('part') !== itemPartName
        ) {
          el.setAttribute('part', itemPartName)
        }
      })
      if (selectedElementIndex === -1) {
        domElements[domElements.length - 1].setAttribute(
          'part',
          selectedItemPartName
        )
        domElements[domElements.length - 1].scrollIntoView({ block: 'start' })
        let itemValue = this.getItemValue(items[domElements.length - 1])
        this.setAttribute('value', itemValue.value ?? itemValue.html!)
      } else {
        domElements[selectedElementIndex].removeAttribute('part')
        domElements[selectedElementIndex].setAttribute('part', itemPartName)
        domElements[selectedElementIndex].setAttribute('part', itemPartName)
        if (domElements[selectedElementIndex - 1]) {
          domElements[selectedElementIndex - 1].removeAttribute('part')
          domElements[selectedElementIndex - 1].setAttribute(
            'part',
            selectedItemPartName
          )
          domElements[selectedElementIndex - 1].scrollIntoView({
            block: 'start',
          })
          let itemValue = this.getItemValue(items[selectedElementIndex - 1])
          ;(event.target as HTMLElement)!.children[0].innerHTML =
            itemValue.html!
          this.setAttribute('value', itemValue.value ?? itemValue.html!)
        } else {
          domElements[domElements.length - 1].removeAttribute('part')
          domElements[domElements.length - 1].setAttribute(
            'part',
            selectedItemPartName
          )
          domElements[domElements.length - 1].scrollIntoView({ block: 'end' })
          let itemValue = this.getItemValue(items[domElements.length - 1])
          ;(event.target as HTMLElement)!.children[0].innerHTML =
            itemValue.html!
          this.setAttribute('value', itemValue.value ?? itemValue.html!)
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
          let computedStyles = getComputedStyle(list)
          if (computedStyles.borderRadius.length > 0) {
            list.style.borderRadius = computedStyles.borderRadius
              .split(' ')
              .reverse()
              .join(' ')
          }
          if (computedStyles.borderBottom.length > 0) {
            list.style.borderTop = computedStyles.borderBottom
            list.style.borderBottom = 'none'
          }
          if (getComputedStyle(list.parentElement).borderBottom.length > 0) {
            // list.parentElement.style.setProperty('--btrr', '0px');
            // list.parentElement.style.setProperty('--btlr', '0px');
            // list.parentElement.style.setProperty('--bblr', '10px');
            // list.parentElement.style.setProperty('--bbrr', '10px');
            list.parentElement.style.borderBottom = getComputedStyle(
              list.parentElement
            ).borderBottom
          }
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
    const listContainer: any = this.shadowRoot!.querySelector('#list')
    const slot: any = listContainer.children[0]
    slot.addEventListener('slotchange', () => {
      const assignedNodes = slot.assignedNodes()
      slot.remove()
      assignedNodes.forEach((node: any) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const wrapper = document.createElement('a')
          wrapper.setAttribute('part', itemPartName)
          wrapper.appendChild(node)
          if (node.getAttribute(placeholderValueAttributeName) !== null) {
            listContainer.insertBefore(wrapper, listContainer.firstChild)
          } else {
            listContainer.appendChild(wrapper)
          }
        }
      })
      let listChildren = Array.prototype.slice.call(
        this.shadowRoot!.getElementById('list')!.children
      )
      listChildren.forEach((element) => {
        element.addEventListener('click', this.clickItem.bind(this))
        element.addEventListener('mouseover', this.selectElement.bind(this))
      })
      // let placeholder = Array.prototype.slice.call(listContainer.children).find(e => this.searchOptionPlaceholderAttribute(e));
      let selectionValue =
        this.bindInitialValue(this.getAttribute('value')!) ?? ''
      this.select!.children[0]!.innerHTML =
        selectionValue ?? this.getAttribute('value')!
      let placeholder = listChildren.find(
        (l) => l.children[0].getAttribute('option-placeholder') !== null
      )
      this._value = placeholder
        ? ''
        : selectionValue !== placeholderDefaultText
          ? selectionValue
          : this.getAttribute('value')!
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
      composed: true,
      detail: detail,
    })
    return this.dispatchEvent(event)
  }
  constructor(
    private _value = '',
    protected internals: ElementInternals
  ) {
    super()
    this.internals = this.attachInternals()
  }

  connectedCallback() {
    this.setAttribute('name', this.getAttribute('name') || '') // Aggiungi attributo name
    this.setAttribute('disabled', this.getAttribute('disabled') || '') // Aggiungi attributo name
    const shadow = this.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = styles
    shadow.innerHTML = template
    shadow.appendChild(style)
    this.select = shadow.getElementById('select') as HTMLButtonElement;
    this.select.setAttribute('disabled', this.getAttribute('disabled')!);
    this.select.addEventListener('keyup', this.keyup.bind(this))
    this.select.addEventListener('focus', this.loadOptionsContainer.bind(this))
    shadow
      .getElementById('focusButton')!
      .addEventListener('keyup', this.focusSelect.bind(this))
    this.loadOptionsContainer()
    this.distributeChildren()
  }
  set value(val) {
    this._value = val
    this.setAttribute('value', val)
    this.internals.setFormValue(val)
  }

  get value() {
    return this._value
  }
  disconnectedCallback() {}
  static get observedAttributes() {
    return ['value', 'name', 'disabled']
  }
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (this.select !== null && newValue !== oldValue && name === 'name') {
      this.setAttribute('name', newValue)
    }
    if (this.select !== null && newValue !== oldValue && name === 'value') {
      // let selectionValue = this.bindInitialValue(newValue)
      this._value = newValue
      this.emit(customEventName, { value: newValue })
    }
    if (this.select !== null && newValue !== oldValue && name === 'disabled') {
      if (newValue !== null) {
        this.select.setAttribute('disabled', newValue)
      } else {
        this.select.removeAttribute('disabled')
      }
    }
  }
  adoptedCallback() {}
}

customElements.define('my-own-select', MyOwnSelect)
