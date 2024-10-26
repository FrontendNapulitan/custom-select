
# my-own-select

`my-own-select` is a highly customizable dropdown select component built using the `customElements` API. It is compatible with both ReactJS and Angular, and it allows for in-depth customization of the dropdown appearance and behavior. `my-own-select` offers a flexible structure, allowing you to insert HTML tags, components, and styled elements as options within the select dropdown.

## Installation

You can install `my-own-select` via npm:

```bash
npm install my-own-select
```

## Usage

To use `my-own-select` in your project, simply include it as a custom HTML element. Below is an example of how to use it:

### HTML

```html
<my-own-select>
   <p>First option</p>
   <h1>Second option</h1>
   <Component></Component>
</my-own-select>
```
- **get Selected value**
in order to get selected value of your option, it's possible to set a custom attribute on sigle item called `option-value` which can be different rather than text contained inside your html tag:
```html
<my-own-select>
   <p option-value="foo">First option</p>
   <h1 option-value="bar">Second option</h1>
   <div>
      <p>Third</p>
      <h1>option</bar>
   </div>
   <Component></Component>
</my-own-select>
```
the value is provided by a custom event called `selection` which can be detected also a simple eventListener (depends by technology do you want to use).
For the above example, along the `selection` event, for the first item of select will be passed `foo` value, for the second one will be passed `bar`. For third element instead, because the attribute `option-value` is not set, will passed `innerText` found in DOM element
```html
<my-own-select>
   <p option-value="foo">First option</p> <!--WILL GET 'foo' -->
   <h1 option-value="bar">Second option</h1> <!--WILL GET 'bar' -->
   <div>
      <p>Third</p>
      <h1>option</bar>
   </div> <!--WILL GET 'Third\noption' -->
   <Component></Component>
</my-own-select>
```
### React (Javascript or Typescritpt)

![image](https://cdn.iconscout.com/icon/free/png-256/free-react-logo-icon-download-in-svg-png-gif-file-formats--company-brand-world-logos-vol-4-pack-icons-282599.png?f=webp&w=200)

For ReactJS, ensure you import and use the `my-own-select` component as a custom element within your JSX code. You may need to register the component to ensure it works as expected:

```javascript
import 'my-own-select';

function App() {
  const selectRef = React.useRef();

  React.useEffect(() => {
    const handleSelection = (event) => {
      console.log("Selected option:", event.detail);
    };
    const currentSelect = selectRef.current;
    currentSelect.addEventListener("selection", handleSelection);

    return () => currentSelect.removeEventListener("selection", handleSelection);
  }, []);

  return (
    <my-own-select ref={selectRef}>
      <p>First option</p>
      <h1>Second option</h1>
      <MyComponent />
    </my-own-select>
  );
}
```

### Angular 
![image](https://avatars.githubusercontent.com/u/139426?s=200&v=4)

For Angular projects, you may need to allow custom elements within your module by configuring `CUSTOM_ELEMENTS_SCHEMA`:

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'my-own-select';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

Then, you can use `my-own-select` in your Angular templates and listen for the `selection` event:

```html
<my-own-select (selection)="onSelection($event)">
   <p>First option</p>
   <h1>Second option</h1>
   <my-component></my-component>
</my-own-select>
```

In your Angular component, define the `onSelection` method:

```typescript
export class AppComponent {
  onSelection(event: CustomEvent) {
    console.log("Selected option:", event.detail);
  }
}
```

### Vue (Javascript or Typescritpt)
![image](https://images.opencollective.com/vuejs/5447764/logo/200.png)
For Vue projects, you can use `my-own-select` in your scripts:
```html
<script setup lang="ts">
  import "my-own-select";
  const onSelection = (event: CustomEvent<any>) => {
    console.log(event);
  };
</script>
```
and listen for the `selection` event:
```html
  <my-own-select @selection="onSelection">
    <p>First option</p>
    <h1>Second option</h1>
    <my-component></my-component>
  </my-own-select>
```

### Solid (Javascript or Typescritpt)
![image](https://app.opensauced.pizza/_next/image?url=https%3A%2F%2Fwww.github.com%2Fsolidjs.png%3Fsize%3D96&w=200&q=75)
For Solid projects, you can import `my-own-select`:
```typescript
import 'my-own-select';
```
and use it in your JSX:
```html
  <my-own-select>
    <p>First option</p>
    <h1>Second option</h1>
    <my-component></my-component>
  </my-own-select>
```
for handle selection event:

```typescript
  const onSelection = (event:CustomEvent<any>) => {
    console.log(event);
  } 
```
```html
  <my-own-select on:selection={onSelection}>
    <p>First option</p>
    <h1>Second option</h1>
    <my-component></my-component>
  </my-own-select>
```

### Qwik 
![image](https://images.crunchbase.com/image/upload/c_pad,h_200,w_200,f_auto,q_auto:eco,dpr_1/zm3fmuvcsytxzpdwgnrw)
For Qwik, ensure you import and use the `my-own-select` component as a custom element within your JSX code. You may need to register the component to ensure it works as expected:

```typescript
import 'my-own-select';

export const App = component$(() => {
  useOn('selection', $((event: CustomEvent) => {
    console.log(event.detail);
  }));

  return (
  <my-own-select window:selection={handleSelection$} >
    <p option-value="hello">First option</p>
    <h1>Second option</h1>
    <my-component></my-component>
  </my-own-select>
  );
});
```

### Svelte (Javascript, Typescritpt and SvelteKit)
![image](https://icons.iconarchive.com/icons/simpleicons-team/simple/256/svelte-icon.png)
For Svelte projects, you can use `my-own-select` in your scripts:
```html
<script setup lang="ts">
  import "my-own-select";
  const onSelection = (event: CustomEvent<any>) => {
    console.log(event);
  };
</script>
```
and listen for the `selection` event:
```html
  <my-own-select on:selection={onSelection}>
    <p>First option</p>
    <h1>Second option</h1>
    <my-component></my-component>
  </my-own-select>
```
### Preact
![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQByb1lg2F2f5IZhgCo7HDGVCwlzPCLRXHUXg&s)
For Preact projects, you can import `my-own-select`:
```typescript
import 'my-own-select';
```
and use it in your JSX:
```html
  <my-own-select>
    <p>First option</p>
    <h1>Second option</h1>
    <my-component></my-component>
  </my-own-select>
```
for handle selection event:

```typescript
  const onSelection = (event:CustomEvent<any>) => {
    console.log(event);
  } 
```
```html
  <my-own-select onselection={onSelection}>
    <p>First option</p>
    <h1>Second option</h1>
    <my-component></my-component>
  </my-own-select>
```

## CSS Customization

`my-own-select` provides parts that can be styled via the `::part()` selector. This allows you to fully customize the dropdown’s appearance:

- **Select container**: Customize the main select element.
  ```css
  my-own-select::part(select) {
    /* Add your styles here */
    background-color: lightgray;
    border: 1px solid #ccc;
    padding: 10px;
  }
  ```

- **Options container**: Style the container holding all options.
  ```css
  my-own-select::part(itemsContainer) {
    /* Add your styles here */
    background-color: white;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
  }
  ```

- **Single option item**: Customize individual options.
  ```css
  my-own-select::part(item) {
    /* Add your styles here */
    padding: 8px;
    cursor: pointer;
  }
  my-own-select::part(item-selected) {
    /* Selected item */
    background-color: #f0f0f0;
  }
  ```

## Custom Event: `selection`

When an option is selected, `my-own-select` emits a custom event called `selection`. This can be intercepted in both ReactJS and Angular:

- **ReactJS**: Use a `ref` to attach an event listener to `my-own-select` and handle the selection event.
- **Angular**: Bind directly to the `(selection)` event on the `my-own-select` tag.
- **Vue**: Bind directly to the `@selection` event on the `my-own-select` tag.
- **Solid**: Bind directly to the `on:selection` event on the `my-own-select` tag.
- **Qwik**: Use a `useOn` to attach an event listener to `my-own-select` and handle the selection event.
- **Svelte**: Bind directly to the `on:selection` event on the `my-own-select` tag.
- **Preact**: Bind directly to the `onselection` event on the `my-own-select` tag.

## Custom Arrow

You can customize the arrow of your select simply writing this:
```html
<my-own-select >
   <p>First option</p>
   <h1>Second option</h1>
   <img slot="arrowImg" src="yourUrl" alt="yourAlt" />
</my-own-select>
```
everywhere in your select, event at begin or in the middle of your options:
```html
<my-own-select >
   <p>First option</p>
   <img slot="arrowImg" src="yourUrl" alt="yourAlt" />
   <h1>Second option</h1>
</my-own-select>
```

## Compatibility

`my-own-select` is built with the `customElements` API, making it natively compatible across modern browsers. It integrates seamlessly with popular frontend frameworks like ReactJS and Angular.

## Contributing

If you'd like to contribute to `my-own-select`, please submit an issue or a pull request on our GitHub repository. Contributions, bug reports, and feature suggestions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Happy coding with `my-own-select`!

## Authors

- [@FrontendNapulitan](https://www.github.com/FrontendNapulitan)


## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.