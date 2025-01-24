# Use the Bun image as the base image
FROM oven/bun:latest AS builder

# Set the working directory in the container
WORKDIR /app

# Copy build dependencies
COPY bun.lockb drizzle.config.ts .env package.json tsconfig.json ./
COPY src/ src/

# Run build and install process
RUN bun install

# Create database schema, to be used during setup later
# Exit with 0 efter 5 seconds because of indefinite hang by drizzle-kit
RUN timeout 5 bun drizzle-kit generate; exit 0

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
COPY --from=builder /app/drizzle.config.ts .
COPY --from=builder /app/drizzle drizzle/
COPY --from=builder /app/node_modules node_modules/

RUN chmod +x ./server

# Expose the port on which the API will listen
EXPOSE 3000

# Run the server when the container launches
CMD ["./server"]