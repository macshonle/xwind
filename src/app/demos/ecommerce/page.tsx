'use client';

import { useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    category: 'Electronics',
    image: '🎧',
    rating: 4.5,
    reviews: 1253,
    inStock: true,
    description: 'Premium sound quality with active noise cancellation'
  },
  {
    id: 2,
    name: 'Ergonomic Office Chair',
    price: 449.99,
    category: 'Furniture',
    image: '🪑',
    rating: 4.8,
    reviews: 892,
    inStock: true,
    description: 'Adjustable lumbar support for all-day comfort'
  },
  {
    id: 3,
    name: 'Smart Watch Series 5',
    price: 399.99,
    category: 'Electronics',
    image: '⌚',
    rating: 4.6,
    reviews: 2104,
    inStock: true,
    description: 'Track your fitness and stay connected'
  },
  {
    id: 4,
    name: 'Mechanical Gaming Keyboard',
    price: 159.99,
    category: 'Electronics',
    image: '⌨️',
    rating: 4.7,
    reviews: 756,
    inStock: false,
    description: 'RGB backlit with tactile switches'
  },
  {
    id: 5,
    name: 'Standing Desk Converter',
    price: 279.99,
    category: 'Furniture',
    image: '🖥️',
    rating: 4.4,
    reviews: 432,
    inStock: true,
    description: 'Easily adjustable height for sitting or standing'
  },
  {
    id: 6,
    name: 'Portable Bluetooth Speaker',
    price: 89.99,
    category: 'Electronics',
    image: '🔊',
    rating: 4.3,
    reviews: 1567,
    inStock: true,
    description: 'Waterproof design with 12-hour battery life'
  },
  {
    id: 7,
    name: 'LED Desk Lamp',
    price: 64.99,
    category: 'Furniture',
    image: '💡',
    rating: 4.5,
    reviews: 623,
    inStock: true,
    description: 'Dimmable with multiple color temperatures'
  },
  {
    id: 8,
    name: 'Wireless Mouse',
    price: 49.99,
    category: 'Electronics',
    image: '🖱️',
    rating: 4.2,
    reviews: 1891,
    inStock: true,
    description: 'Ergonomic design with precision tracking'
  },
];

export default function EcommercePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const cartItemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-secondary border-b-2 border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-foreground font-[family-name:var(--font-display)] text-3xl font-bold">
              TechStore
            </h1>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8">
              <label htmlFor="search-products" className="sr-only">Search products</label>
              <input
                id="search-products"
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-background border-2 border-border rounded-[var(--radius-md)]
                         text-foreground placeholder:text-foreground-muted
                         focus:outline-none focus:border-accent theme-transition"
                aria-label="Search for products"
              />
            </div>

            {/* Cart */}
            <button
              className="relative px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-md)]
                       font-[family-name:var(--font-display)] font-semibold theme-transition
                       hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-background w-6 h-6
                               rounded-full flex items-center justify-center text-sm font-bold"
                      aria-label={`${cartItemCount} items in cart`}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0" aria-label="Product filters">
            <div className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)] p-6">
              <h2 className="text-foreground font-[family-name:var(--font-display)] text-xl font-bold mb-4">
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-foreground font-semibold mb-3" id="category-filter-heading">
                  Category
                </h3>
                <div className="space-y-2" role="radiogroup" aria-labelledby="category-filter-heading">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-accent border-border focus:ring-accent"
                      />
                      <span className="ml-2 text-foreground-muted group-hover:text-foreground theme-transition">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="sort-select" className="text-foreground font-semibold mb-3 block">
                  Sort By
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-background border-2 border-border rounded-[var(--radius-md)]
                           text-foreground theme-transition focus:outline-none focus:border-accent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h2>
              <p className="text-foreground-muted mt-1">
                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <article
                  key={product.id}
                  className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)]
                           overflow-hidden theme-transition hover:shadow-[var(--shadow-lg)]
                           hover:border-accent"
                >
                  {/* Product Image */}
                  <div className="bg-background h-48 flex items-center justify-center text-8xl">
                    <span role="img" aria-label={product.name}>{product.image}</span>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-foreground font-[family-name:var(--font-display)] text-lg font-semibold flex-1">
                        {product.name}
                      </h3>
                      {!product.inStock && (
                        <span className="ml-2 px-2 py-1 bg-destructive text-destructive-foreground text-xs
                                       rounded-[var(--radius-sm)] font-semibold"
                              aria-label="Out of stock">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <p className="text-foreground-muted text-sm mb-3">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <span className="text-accent font-semibold">{product.rating}</span>
                        <span className="ml-1 text-accent" aria-hidden="true">★</span>
                      </div>
                      <span className="text-foreground-muted text-sm">
                        ({product.reviews.toLocaleString()} reviews)
                      </span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-md)]
                                 font-semibold theme-transition
                                 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-foreground-muted text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
