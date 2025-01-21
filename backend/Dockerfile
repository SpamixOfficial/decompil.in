# Use the Bun image as the base image
FROM oven/bun:latest AS builder

# Set the working directory in the container
WORKDIR /app

# Copy build dependencies
COPY bun.lockb .env package.json tsconfig.json ./
COPY src/ src/

# Run build and install process
RUN bun install
RUN bun build \
--compile \
--minify-whitespace \
--minify-syntax \
--target bun \
--outfile server \
./src/index.ts

# Copy from build process into deployed instance
FROM oven/bun:latest AS deployer

WORKDIR /app

# Copy from build process
COPY --from=builder /app/server .
COPY --from=builder /app/.env .
COPY --from=builder /app/node_modules node_modules/

RUN chmod +x ./server

# Expose the port on which the API will listen
EXPOSE 3000

# Run the server when the container launches
CMD ["./server"]