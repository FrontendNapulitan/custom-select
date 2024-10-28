# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2024-10-29

- set `value` attribute and handled initialValue. Is now    possible to set an initialValue to select by passing a  value inside a `value` attriubte:
    ```html
    <my-own-select value="foo">
        <div>Hello</div>
        <div option-value="foo">World</div>
        <div>--</div>
    </my-own-select>
    ```
    in the example above the select will rendered with default visible value `World` and hidden value `foo`


