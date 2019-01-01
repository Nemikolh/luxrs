#include "common.h"
#include "chunk.h"
#include "debug.h"
#include "vm.h"

int main(int argc, const char* argv[]) {
    initVM();
    Chunk chunk;
    initChunk(&chunk);
    int constant = addConstant(&chunk, 1.2);
    writeChunk(&chunk, OP_CONSTANT, 0);
    writeChunk(&chunk, constant, 0);
    constant = addConstant(&chunk, 2.3);
    writeChunk(&chunk, OP_CONSTANT, 0);
    writeChunk(&chunk, constant, 0);
    writeChunk(&chunk, OP_NEGATE, 0);
    writeChunk(&chunk, OP_ADD, 0);
    writeChunk(&chunk, OP_RETURN, 0);
    disassembleChunk(&chunk, "test chunk");
    interpret(&chunk);
    freeVM();
    freeChunk(&chunk);
    return 0;
}