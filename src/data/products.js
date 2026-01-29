/**
 * CoffeeCorner - Mock product catalog
 * Products have: uid, title, slug, description, price, category, image, featured
 */

const COFFEE_IMAGES = {
  espresso: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
  latte: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=400&fit=crop',
  cappuccino: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
  americano: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop',
  mocha: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
  coldbrew: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop',
  iced: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
  pastry: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
  croissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
  muffin: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop',
  default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
};

export const CATEGORIES = [
  { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
  { slug: 'cold', name: 'Cold Drinks', uid: 'cat_cold' },
  { slug: 'pastries', name: 'Pastries', uid: 'cat_pastries' },
];

export const PRODUCTS = [
  {
    uid: 'prod_1',
    title: 'Espresso',
    slug: 'espresso',
    description: 'Rich, bold double shot of our house blend. The perfect pick-me-up.',
    price: 2.5,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.espresso,
    featured: true,
  },
  {
    uid: 'prod_2',
    title: 'Latte',
    slug: 'latte',
    description: 'Smooth espresso with steamed milk and a thin layer of foam. Customize with any syrup.',
    price: 4.25,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.latte,
    featured: true,
  },
  {
    uid: 'prod_3',
    title: 'Cappuccino',
    slug: 'cappuccino',
    description: 'Equal parts espresso, steamed milk, and velvety foam. A classic favorite.',
    price: 4.0,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.cappuccino,
    featured: true,
  },
  {
    uid: 'prod_4',
    title: 'Americano',
    slug: 'americano',
    description: 'Two shots of espresso topped with hot water. Simple and strong.',
    price: 3.0,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.americano,
    featured: false,
  },
  {
    uid: 'prod_5',
    title: 'Mocha',
    slug: 'mocha',
    description: 'Espresso with steamed milk and dark chocolate. Topped with whipped cream.',
    price: 4.75,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.mocha,
    featured: true,
  },
  {
    uid: 'prod_6',
    title: 'Cold Brew',
    slug: 'cold-brew',
    description: 'Slow-steeped for 18 hours. Smooth, low-acid, and refreshing over ice.',
    price: 4.5,
    category: { slug: 'cold', name: 'Cold Drinks', uid: 'cat_cold' },
    image: COFFEE_IMAGES.coldbrew,
    featured: true,
  },
  {
    uid: 'prod_7',
    title: 'Iced Latte',
    slug: 'iced-latte',
    description: 'Espresso and cold milk over ice. Cool and creamy.',
    price: 4.5,
    category: { slug: 'cold', name: 'Cold Drinks', uid: 'cat_cold' },
    image: COFFEE_IMAGES.iced,
    featured: false,
  },
  {
    uid: 'prod_8',
    title: 'Iced Mocha',
    slug: 'iced-mocha',
    description: 'Cold brew base with chocolate and cream. Served over ice.',
    price: 5.0,
    category: { slug: 'cold', name: 'Cold Drinks', uid: 'cat_cold' },
    image: COFFEE_IMAGES.mocha,
    featured: false,
  },
  {
    uid: 'prod_9',
    title: 'Butter Croissant',
    slug: 'butter-croissant',
    description: 'Fresh-baked, flaky butter croissant. Perfect with any drink.',
    price: 3.25,
    category: { slug: 'pastries', name: 'Pastries', uid: 'cat_pastries' },
    image: COFFEE_IMAGES.croissant,
    featured: false,
  },
  {
    uid: 'prod_10',
    title: 'Blueberry Muffin',
    slug: 'blueberry-muffin',
    description: 'Moist muffin loaded with fresh blueberries. Baked daily.',
    price: 3.5,
    category: { slug: 'pastries', name: 'Pastries', uid: 'cat_pastries' },
    image: COFFEE_IMAGES.muffin,
    featured: true,
  },
  {
    uid: 'prod_11',
    title: 'Chocolate Croissant',
    slug: 'chocolate-croissant',
    description: 'Buttery croissant filled with dark chocolate. A sweet treat.',
    price: 3.75,
    category: { slug: 'pastries', name: 'Pastries', uid: 'cat_pastries' },
    image: COFFEE_IMAGES.pastry,
    featured: false,
  },
];

export const getProductBySlug = (slug) =>
  PRODUCTS.find((p) => p.slug === slug) || null;

export const getProductByUid = (uid) =>
  PRODUCTS.find((p) => p.uid === uid) || null;

export const getProductsByCategory = (categorySlug) =>
  PRODUCTS.filter((p) => p.category?.slug === categorySlug);

export const getFeaturedProducts = () =>
  PRODUCTS.filter((p) => p.featured);

export default PRODUCTS;
