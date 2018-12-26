#ifndef clox_memory_h
#define clox_memory_h

#define GROW_CAPACITY(capacity) \
    ((capacity) < 8 ? 8: (capacity) * 8)
#define GROW_ARRAY(previous, type, oldcount, count) \
    (type *)reallocate(previous, sizeof(type) * (oldcount), sizeof(type) * count)
#define FREE_ARRAY(type, pointer, oldcount) \
    reallocate(pointer, sizeof(type) * (oldcount), 0)

void* reallocate(void* previous, size_t old_size, size_t new_size);

#endif