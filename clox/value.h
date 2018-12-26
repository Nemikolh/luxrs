#ifndef clox_value_h
#define clox_value_h

#include "common.h"

typedef double Value;

typedef struct {
    int capacity;
    int count;
    Value* values;
} ValueArray;

void initValueArray(ValueArray* data);
void freeValueArray(ValueArray* data);
void writeValueArray(ValueArray* data, Value value);

#endif