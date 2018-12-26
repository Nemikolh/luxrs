#include <stdlib.h>

#include "memory.h"
#include "value.h"

void initValueArray(ValueArray* data) {
    data->count = 0;
    data->capacity = 0;
    data->values = NULL;
}

void freeValueArray(ValueArray* data) {
    GROW_ARRAY(data->values, Value, data->capacity, 0);
    initValueArray(data);
}

void writeValueArray(ValueArray* data, Value value) {
    if (data->capacity == data->count) {
        int old_capacity = data->capacity;
        data->capacity = GROW_CAPACITY(old_capacity);
        data->values = GROW_ARRAY(data->values, Value, old_capacity, data->capacity);
    }

    data->values[data->count] = value;
    data->count++;
}