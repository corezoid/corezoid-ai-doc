# Process with Input Parameters

This document provides an example of a Corezoid process with defined input parameters of various
types, validation rules, and flags.

## Process Overview

The example process demonstrates how to configure input parameters with different data types,
validation rules, and flags. This pattern is useful when you need to:

- Validate incoming data before processing
- Enforce required parameters
- Define expected data types for parameters
- Apply regex validation to string inputs
- Handle complex object parameters

## JSON Structure

```json
{
  "obj_type": 1,
  "obj_id": 1643031,
  "parent_id": 0,
  "title": "New Process",
  "description": "",
  "status": "active",
  "params": [
    {
      "name": "a",
      "type": "string",
      "descr": "aa",
      "flags": ["required", "input"],
      "regex": "",
      "regex_error_text": ""
    },
    {
      "name": "b",
      "type": "number",
      "descr": "bb",
      "flags": ["input"],
      "regex": "",
      "regex_error_text": ""
    },
    {
      "name": "c",
      "type": "boolean",
      "descr": "cc",
      "flags": ["auto-clear", "input"],
      "regex": "",
      "regex_error_text": ""
    },
    {
      "name": "d",
      "type": "string",
      "descr": "dd",
      "flags": ["input"],
      "regex": "/s",
      "regex_error_text": "error"
    },
    {
      "name": "e",
      "type": "object",
      "descr": "ee",
      "flags": ["input"],
      "regex": "",
      "regex_error_text": ""
    }
  ],
  "ref_mask": false,
  "conv_type": "process",
  "scheme": {
    "nodes": [
      {
        "id": "67f40e0682ba966c7fb151b9",
        "obj_type": 2,
        "condition": {
          "logics": [],
          "semaphors": []
        },
        "title": "Final",
        "description": "",
        "x": 748,
        "y": 400,
        "extra": "{\"modeForm\":\"collapse\",\"icon\":\"success\"}",
        "options": "{\"save_task\":true}"
      },
      {
        "id": "67f40e0682ba966c7fb151b7",
        "obj_type": 1,
        "condition": {
          "logics": [
            {
              "type": "go",
              "to_node_id": "67f40e0682ba966c7fb151b9"
            }
          ],
          "semaphors": []
        },
        "title": "Start",
        "description": "",
        "x": 748,
        "y": 100,
        "extra": "{\"modeForm\":\"collapse\",\"icon\":\"\"}",
        "options": null
      }
    ],
    "web_settings": [[], []]
  }
}
```

## Input Parameters

The process defines five input parameters with different types, validation rules, and flags:

| Parameter | Type    | Description | Flags             | Validation                  |
| --------- | ------- | ----------- | ----------------- | --------------------------- |
| `a`       | string  | aa          | required, input   | None                        |
| `b`       | number  | bb          | input             | None                        |
| `c`       | boolean | cc          | auto-clear, input | None                        |
| `d`       | string  | dd          | input             | Regex: `/s`, Error: "error" |
| `e`       | object  | ee          | input             | None                        |

### Parameter Details

#### Parameter `a` (string)

- **Description**: aa
- **Flags**:
  - `required`: This parameter must be provided when calling the process
  - `input`: This parameter is an input parameter
- **Validation**: None

#### Parameter `b` (number)

- **Description**: bb
- **Flags**:
  - `input`: This parameter is an input parameter
- **Validation**: None

#### Parameter `c` (boolean)

- **Description**: cc
- **Flags**:
  - `auto-clear`: This parameter will be automatically cleared after processing
  - `input`: This parameter is an input parameter
- **Validation**: None

#### Parameter `d` (string)

- **Description**: dd
- **Flags**:
  - `input`: This parameter is an input parameter
- **Validation**:
  - Regex pattern: `/s`
  - Error message: "error"

#### Parameter `e` (object)

- **Description**: ee
- **Flags**:
  - `input`: This parameter is an input parameter
- **Validation**: None

## Process Flow

This example process has a simple flow:

1. **Start Node**: Entry point for the process
2. **Final Node**: Terminates the process flow

The process does not contain any processing logic between the Start and Final nodes, as it is
intended to demonstrate parameter configuration rather than process logic.

## Parameter Flags

The example demonstrates several parameter flags:

- **required**: The parameter must be provided when calling the process
- **input**: The parameter is an input parameter
- **auto-clear**: The parameter will be automatically cleared after processing

## Validation Rules

The example demonstrates regex validation for string parameters:

- Parameter `d` has a regex pattern `/s` with an error message "error"
- When the input for parameter `d` does not match the regex pattern, the error message will be
  displayed

## Usage Example

To call this process with valid parameters:

```json
{
  "a": "string value",
  "b": 123,
  "c": true,
  "d": "string with s",
  "e": {
    "property1": "value1",
    "property2": "value2"
  }
}
```

## Best Practices

When defining process parameters:

1. Use the `required` flag for parameters that must be provided
2. Provide clear descriptions for each parameter
3. Use appropriate data types for parameters
4. Add regex validation for string parameters that need to follow specific patterns
5. Use the `auto-clear` flag for parameters that should not persist after processing
6. Document complex object parameters with examples of expected structure
