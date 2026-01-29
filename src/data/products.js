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
    description: 'A rich, bold double shot of our house blend, pulled to order for a smooth crema and full-bodied flavor. The perfect pick-me-up any time of day—enjoy as-is or as the base for your favorite milk drink.',
    price: 2.5,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.espresso,
    featured: true,
  },
  {
    uid: 'prod_2',
    title: 'Latte',
    slug: 'latte',
    description: 'Smooth espresso with steamed milk and a thin layer of silky foam. Creamy and mild, with the coffee shining through—customize with vanilla, caramel, hazelnut, or any syrup. A crowd-pleaser that’s perfect morning or afternoon.',
    price: 4.25,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.latte,
    featured: true,
  },
  {
    uid: 'prod_3',
    title: 'Cappuccino',
    slug: 'cappuccino',
    description: 'Equal parts espresso, steamed milk, and a thick cap of velvety foam. Bold enough to taste the coffee, smooth enough to sip slowly. A classic favorite for those who love balance and a little indulgence.',
    price: 4.0,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.cappuccino,
    featured: true,
  },
  {
    uid: 'prod_4',
    title: 'Americano',
    slug: 'americano',
    description: 'Two shots of espresso topped with hot water for a smooth, full-bodied cup. Simple, strong, and perfect for those who love the pure taste of coffee without the intensity of a straight shot.',
    price: 3.0,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.americano,
    featured: false,
  },
  {
    uid: 'prod_5',
    title: 'Mocha',
    slug: 'mocha',
    description: 'Espresso with steamed milk and rich dark chocolate, topped with a swirl of whipped cream. Sweet, indulgent, and deeply satisfying—ideal when you want something dessert-like in a cup. Perfect with an extra shot for a stronger kick.',
    price: 4.75,
    category: { slug: 'hot', name: 'Hot Drinks', uid: 'cat_hot' },
    image: COFFEE_IMAGES.mocha,
    featured: true,
  },
  {
    uid: 'prod_6',
    title: 'Cold Brew',
    slug: 'cold-brew',
    description: 'Our signature cold brew is slow-steeped for 18 hours in cold water for a smooth, low-acid finish. Served over ice, it’s refreshing and naturally sweet with no bitterness—great black or with a splash of milk. A summer staple you can enjoy year-round.',
    price: 4.5,
    category: { slug: 'cold', name: 'Cold Drinks', uid: 'cat_cold' },
    image: COFFEE_IMAGES.coldbrew,
    featured: true,
  },
  {
    uid: 'prod_7',
    title: 'Iced Latte',
    slug: 'iced-latte',
    description: 'Espresso and cold milk over ice for a refreshing, creamy drink. Smooth and satisfying any time of day—customize with your favorite syrup for a sweet twist.',
    price: 4.5,
    category: { slug: 'cold', name: 'Cold Drinks', uid: 'cat_cold' },
    image: COFFEE_IMAGES.iced,
    featured: false,
  },
  {
    uid: 'prod_8',
    title: 'Iced Mocha',
    slug: 'iced-mocha',
    description: 'Cold brew base blended with rich dark chocolate and a touch of cream, served over ice. Decadent, refreshing, and perfect for chocolate lovers.',
    price: 5.0,
    category: { slug: 'cold', name: 'Cold Drinks', uid: 'cat_cold' },
    image: COFFEE_IMAGES.mocha,
    featured: false,
  },
  {
    uid: 'prod_9',
    title: 'Butter Croissant',
    slug: 'butter-croissant',
    description: 'Fresh-baked, golden croissant with layers of buttery, flaky pastry. Light and crisp on the outside, soft inside—perfect with any coffee or tea.',
    price: 3.25,
    category: { slug: 'pastries', name: 'Pastries', uid: 'cat_pastries' },
    image: COFFEE_IMAGES.croissant,
    featured: false,
  },
  {
    uid: 'prod_10',
    title: 'Blueberry Muffin',
    slug: 'blueberry-muffin',
    description: 'Moist, tender muffin packed with juicy blueberries and a hint of vanilla. Baked fresh daily—ideal for breakfast or an afternoon treat with your latte.',
    price: 3.5,
    category: { slug: 'pastries', name: 'Pastries', uid: 'cat_pastries' },
    image: COFFEE_IMAGES.muffin,
    featured: true,
  },
  {
    uid: 'prod_11',
    title: 'Chocolate Croissant',
    slug: 'chocolate-croissant',
    description: 'Buttery, flaky croissant filled with ribbons of dark chocolate. A classic French-style sweet that pairs beautifully with an espresso or cappuccino.',
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
