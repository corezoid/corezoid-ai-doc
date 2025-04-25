# Task Creation in Corezoid

This document outlines best practices and requirements for creating tasks in Corezoid processes.

## Task Requirements

When creating tasks in Corezoid processes, follow these guidelines:

1. **Reference ID (ref field)**:

   - Each task must have a unique reference ID
   - Reference IDs cannot overlap between tasks, even for different processes
   - Always generate new random reference IDs when resending or creating similar test tasks
   - Best practice: Use timestamps combined with random numbers to ensure uniqueness

2. **Task Data Structure**:

   - Avoid using null values at the first level of the "data" structure
   - Null values can be used deeper in nested structures within the data object
   - This is important because the Corezoid online IDE doesn't fully support top-level null values

3. **Task Size Limitations**:
   - Tasks are limited to 128KB (128000 bytes) by default
   - Size calculation includes all parameters and their values
   - Consider data optimization for large tasks

## Example of Valid Task Data

```json
{
  "ref": "1618234567_89012",
  "data": {
    "customer_id": "123456",
    "email": "user@example.com",
    "amount": 150.75,
    "top_level_field": "", // Empty string instead of null
    "nested_object": {
      "can_be_null": null // Null is acceptable at deeper levels
    }
  }
}
```

## Common Task Creation Errors

1. **Duplicate Reference ID**: Using the same reference ID for multiple tasks
2. **Null at Top Level**: Using null values in the first level of the data structure
3. **Task Size Limit Exceeded**: Creating tasks larger than the maximum allowed size
4. **Missing Required Parameters**: Not including parameters marked as required in the process
   definition

## Test Task Creation Best Practices

When creating test tasks:

1. Generate unique reference IDs for each test run
2. Include all required parameters defined in the process
3. Test both valid and invalid data to verify validation rules
4. Verify that error handling works as expected

By following these guidelines, you'll ensure that your tasks are processed correctly in the Corezoid
system.
