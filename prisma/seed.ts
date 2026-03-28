import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const ankara = await prisma.category.create({
    data: {
      slug: 'ankara',
      name: 'Ankara Prints',
      description: 'Traditional African print clothing with bold patterns and vibrant colors',
      image: 'https://picsum.photos/seed/ankara/800/600',
      sortOrder: 1,
    },
  })

  const casual = await prisma.category.create({
    data: {
      slug: 'casual',
      name: 'Casual Wear',
      description: 'Everyday comfort with African-inspired flair',
      image: 'https://picsum.photos/seed/casual/800/600',
      sortOrder: 2,
    },
  })

  const accessories = await prisma.category.create({
    data: {
      slug: 'accessories',
      name: 'Accessories',
      description: 'Complete your look with handcrafted accessories',
      image: 'https://picsum.photos/seed/accessories/800/600',
      sortOrder: 3,
    },
  })

  // Create products
  const products = [
    {
      slug: 'ankara-blazer-gold',
      name: 'Ankara Blazer - Gold Pattern',
      description: 'A stunning tailored blazer featuring traditional Ankara print in rich gold tones. Perfect for making a statement at any occasion. Crafted from premium African wax fabric with modern tailoring.',
      price: 285.00,
      comparePrice: 350.00,
      images: [
        'https://picsum.photos/seed/blazer1/800/1000',
        'https://picsum.photos/seed/blazer2/800/1000',
        'https://picsum.photos/seed/blazer3/800/1000',
      ],
      isFeatured: true,
      status: 'published' as const,
      categoryId: ankara.id,
      variants: [
        { size: 'S', color: 'Gold', sku: 'ANK-BLZ-GLD-S', stock: 5 },
        { size: 'M', color: 'Gold', sku: 'ANK-BLZ-GLD-M', stock: 8 },
        { size: 'L', color: 'Gold', sku: 'ANK-BLZ-GLD-L', stock: 6 },
        { size: 'XL', color: 'Gold', sku: 'ANK-BLZ-GLD-XL', stock: 4 },
      ],
    },
    {
      slug: 'ankara-midi-dress-indigo',
      name: 'Ankara Midi Dress - Indigo Wave',
      description: 'Elegant midi dress with flowing silhouette and bold Ankara indigo wave pattern. Features a flattering wrap design with adjustable waist tie.',
      price: 220.00,
      comparePrice: null,
      images: [
        'https://picsum.photos/seed/dress1/800/1000',
        'https://picsum.photos/seed/dress2/800/1000',
      ],
      isFeatured: true,
      status: 'published' as const,
      categoryId: ankara.id,
      variants: [
        { size: 'S', color: 'Indigo', sku: 'ANK-DRS-IND-S', stock: 10 },
        { size: 'M', color: 'Indigo', sku: 'ANK-DRS-IND-M', stock: 12 },
        { size: 'L', color: 'Indigo', sku: 'ANK-DRS-IND-L', stock: 8 },
        { size: 'XL', color: 'Indigo', sku: 'ANK-DRS-IND-XL', stock: 5 },
      ],
    },
    {
      slug: 'ankara-two-piece-crimson',
      name: 'Ankara Two-Piece Set - Crimson',
      description: 'Coordinated top and skirt set in stunning crimson Ankara print. The crop top features puff sleeves and the pencil skirt has a flattering high waist.',
      price: 320.00,
      comparePrice: 400.00,
      images: [
        'https://picsum.photos/seed/twopiece1/800/1000',
        'https://picsum.photos/seed/twopiece2/800/1000',
      ],
      isFeatured: false,
      status: 'published' as const,
      categoryId: ankara.id,
      variants: [
        { size: 'S', color: 'Crimson', sku: 'ANK-2PC-CRM-S', stock: 4 },
        { size: 'M', color: 'Crimson', sku: 'ANK-2PC-CRM-M', stock: 6 },
        { size: 'L', color: 'Crimson', sku: 'ANK-2PC-CRM-L', stock: 3 },
      ],
    },
    {
      slug: 'ankara-shirt-blue',
      name: 'Ankara Button-Down Shirt - Blue Kente',
      description: 'Modern button-down shirt with classic Kente-inspired pattern in blue tones. Relaxed fit, perfect for both casual and semi-formal occasions.',
      price: 180.00,
      comparePrice: null,
      images: [
        'https://picsum.photos/seed/shirt1/800/1000',
        'https://picsum.photos/seed/shirt2/800/1000',
      ],
      isFeatured: true,
      status: 'published' as const,
      categoryId: ankara.id,
      variants: [
        { size: 'S', color: 'Blue', sku: 'ANK-SHT-BLU-S', stock: 7 },
        { size: 'M', color: 'Blue', sku: 'ANK-SHT-BLU-M', stock: 10 },
        { size: 'L', color: 'Blue', sku: 'ANK-SHT-BLU-L', stock: 9 },
        { size: 'XL', color: 'Blue', sku: 'ANK-SHT-BLU-XL', stock: 5 },
      ],
    },
    {
      slug: 'heritage-hoodie-black',
      name: 'Heritage Hoodie - Black',
      description: 'Premium heavyweight hoodie with embroidered African heritage motif. Brushed fleece interior for ultimate comfort. Unisex fit.',
      price: 120.00,
      comparePrice: 150.00,
      images: [
        'https://picsum.photos/seed/hoodie1/800/1000',
        'https://picsum.photos/seed/hoodie2/800/1000',
      ],
      isFeatured: true,
      status: 'published' as const,
      categoryId: casual.id,
      variants: [
        { size: 'S', color: 'Black', sku: 'CAS-HOD-BLK-S', stock: 15 },
        { size: 'M', color: 'Black', sku: 'CAS-HOD-BLK-M', stock: 20 },
        { size: 'L', color: 'Black', sku: 'CAS-HOD-BLK-L', stock: 18 },
        { size: 'XL', color: 'Black', sku: 'CAS-HOD-BLK-XL', stock: 10 },
      ],
    },
    {
      slug: 'adinkra-tee-white',
      name: 'Adinkra Symbol T-Shirt - White',
      description: 'Soft cotton tee featuring minimalist Adinkra symbol print. Relaxed unisex fit with rolled sleeves. Screen-printed with eco-friendly inks.',
      price: 85.00,
      comparePrice: null,
      images: [
        'https://picsum.photos/seed/tee1/800/1000',
        'https://picsum.photos/seed/tee2/800/1000',
      ],
      isFeatured: false,
      status: 'published' as const,
      categoryId: casual.id,
      variants: [
        { size: 'S', color: 'White', sku: 'CAS-TEE-WHT-S', stock: 25 },
        { size: 'M', color: 'White', sku: 'CAS-TEE-WHT-M', stock: 30 },
        { size: 'L', color: 'White', sku: 'CAS-TEE-WHT-L', stock: 22 },
        { size: 'XL', color: 'White', sku: 'CAS-TEE-WHT-XL', stock: 15 },
      ],
    },
    {
      slug: 'tribe-joggers-olive',
      name: 'Tribe Joggers - Olive',
      description: 'Premium joggers with subtle tribal pattern detail on the side seam. French terry cotton with tapered fit and elastic cuffs.',
      price: 95.00,
      comparePrice: null,
      images: [
        'https://picsum.photos/seed/joggers1/800/1000',
        'https://picsum.photos/seed/joggers2/800/1000',
      ],
      isFeatured: false,
      status: 'published' as const,
      categoryId: casual.id,
      variants: [
        { size: 'S', color: 'Olive', sku: 'CAS-JOG-OLV-S', stock: 12 },
        { size: 'M', color: 'Olive', sku: 'CAS-JOG-OLV-M', stock: 18 },
        { size: 'L', color: 'Olive', sku: 'CAS-JOG-OLV-L', stock: 14 },
        { size: 'XL', color: 'Olive', sku: 'CAS-JOG-OLV-XL', stock: 8 },
      ],
    },
    {
      slug: 'ankara-crossbody-bag',
      name: 'Ankara Crossbody Bag',
      description: 'Handcrafted crossbody bag with vibrant Ankara print exterior and vegan leather trim. Adjustable strap, zip closure, interior pocket.',
      price: 95.00,
      comparePrice: 120.00,
      images: [
        'https://picsum.photos/seed/bag1/800/1000',
        'https://picsum.photos/seed/bag2/800/1000',
      ],
      isFeatured: true,
      status: 'published' as const,
      categoryId: accessories.id,
      variants: [
        { size: 'One Size', color: 'Multi', sku: 'ACC-BAG-MLT-OS', stock: 20 },
      ],
    },
    {
      slug: 'gele-headwrap-emerald',
      name: 'Gelé Headwrap - Emerald',
      description: 'Luxurious traditional headwrap in rich emerald green. Made from premium Aso-Oke fabric, pre-shaped for easy styling. 72 inches long.',
      price: 65.00,
      comparePrice: null,
      images: [
        'https://picsum.photos/seed/headwrap1/800/1000',
        'https://picsum.photos/seed/headwrap2/800/1000',
      ],
      isFeatured: false,
      status: 'published' as const,
      categoryId: accessories.id,
      variants: [
        { size: 'One Size', color: 'Emerald', sku: 'ACC-HW-EMR-OS', stock: 30 },
      ],
    },
    {
      slug: 'beaded-statement-necklace',
      name: 'Beaded Statement Necklace - Coral & Gold',
      description: 'Handmade multi-strand beaded necklace inspired by traditional West African jewelry. Features coral, gold, and bone beads with brass clasp.',
      price: 145.00,
      comparePrice: 180.00,
      images: [
        'https://picsum.photos/seed/necklace1/800/1000',
        'https://picsum.photos/seed/necklace2/800/1000',
      ],
      isFeatured: true,
      status: 'published' as const,
      categoryId: accessories.id,
      variants: [
        { size: 'One Size', color: 'Coral/Gold', sku: 'ACC-NKL-CGL-OS', stock: 15 },
      ],
    },
  ]

  for (const { variants, ...productData } of products) {
    await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
      },
    })
  }

  // Create size guide data
  const sizeGuideData = [
    { category: 'tops', size: 'S', bust: '34"', waist: '26"', shoulders: '14"', length: '25"' },
    { category: 'tops', size: 'M', bust: '36"', waist: '28"', shoulders: '15"', length: '26"' },
    { category: 'tops', size: 'L', bust: '38"', waist: '30"', shoulders: '16"', length: '27"' },
    { category: 'tops', size: 'XL', bust: '40"', waist: '32"', shoulders: '17"', length: '28"' },
    { category: 'bottoms', size: 'S', waist: '26"', hips: '36"', length: '40"' },
    { category: 'bottoms', size: 'M', waist: '28"', hips: '38"', length: '41"' },
    { category: 'bottoms', size: 'L', waist: '30"', hips: '40"', length: '42"' },
    { category: 'bottoms', size: 'XL', waist: '32"', hips: '42"', length: '43"' },
    { category: 'dresses', size: 'S', bust: '34"', waist: '26"', hips: '36"', length: '42"' },
    { category: 'dresses', size: 'M', bust: '36"', waist: '28"', hips: '38"', length: '43"' },
    { category: 'dresses', size: 'L', bust: '38"', waist: '30"', hips: '40"', length: '44"' },
    { category: 'dresses', size: 'XL', bust: '40"', waist: '32"', hips: '42"', length: '45"' },
  ]

  for (const guide of sizeGuideData) {
    await prisma.sizeGuide.create({ data: guide })
  }

  // Create promo code
  await prisma.promoCode.create({
    data: {
      code: 'WELCOME15',
      type: 'percent',
      value: 15,
      minOrderAmount: 100,
      validUntil: new Date('2027-12-31'),
      isActive: true,
    },
  })

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@asa-fashion.com',
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
