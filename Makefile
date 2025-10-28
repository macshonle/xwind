install:
	pnpm install

start:
	pnpm dev

lint:
	pnpm lint

clean:
	find . \( -name \*~ -o -name .DS_Store \) -delete
