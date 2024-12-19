# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2024-10-29

- set `value` attribute and handled initialValue. Is now possible to set an initialValue to select by passing a  value inside a `value` attriubte:
    ```html
    <my-own-select value="foo">
        <div>Hello</div>
        <div option-value="foo">World</div>
        <div>--</div>
    </my-own-select>
    ```
    in the example above the select will rendered with default visible value `World` and hidden value `foo`

## [1.0.8] - 2024-11-02

- fix types for 'preact' 

## [1.0.9] - 2024-11-02

- updated types for 'preact' 

## [1.1.0] - 2024-12-17

- changed default select style:

  ![image](https://raw.githubusercontent.com/FrontendNapulitan/my-own-select/refs/heads/main/public/default-select-style.png)

- introducing form compatibility. Is now possible to work within a form context:
    
    ```html
    <form>
        <input type="text" />
        <my-own-select>
            <div>World!</div>
        </my-own-select>
        <button type="submit">Send</button>
    </form>
    ```
    for testing form value:

    ```javascript
    document.querySelector('form')?.addEventListener('submit', (event:any) => {
        event.preventDefault();
        let values = Array.prototype.slice.call(event.target.elements).filter(e => e.type !== 'submit').map(e => e.value);
        console.log(values.join(','));
    })
    ```

- set a placeholder value. Is now possible to set a placeholder value by setting a boolean property called 'option-placeholder':

    ```html
        <my-own-select>
            <div option-placeholder >Hello!</div>
            <div>World!</div>
        </my-own-select>
    ```
    the option to which the `option-placeholder` attribute is applied will always be placed in first position compared to the other options and it's value is always an empty string, even if on same option is applied also `option-value` attribute

## [1.1.3] - 2024-12-19

- fix handle initial disabled status