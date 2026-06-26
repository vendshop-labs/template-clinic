import { PrismaClient, Vertical } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding DentCare Clinic database...');

  // ============ STORE ============
  const store = await db.store.upsert({
    where: { slug: 'dentcare' },
    update: {},
    create: {
      name: 'DentCare Clinic',
      slug: 'dentcare',
      vertical: Vertical.SERVICES,
      regionBundle: 'SK',
      address: 'Obchodná 15, 811 06 Bratislava',
      city: 'Bratislava',
      phone: '+421 900 123 456',
      email: 'info@dentcare.sk',
      openingHours: JSON.stringify({
        mon: { open: '08:00', close: '18:00', closed: false },
        tue: { open: '08:00', close: '18:00', closed: false },
        wed: { open: '08:00', close: '18:00', closed: false },
        thu: { open: '08:00', close: '18:00', closed: false },
        fri: { open: '08:00', close: '18:00', closed: false },
        sat: { open: '09:00', close: '13:00', closed: false },
        sun: { open: '', close: '', closed: true },
      }),
      themeConfig: {
        colors: {
          primary:       '#0ea5e9',
          primaryDark:   '#0284c7',
          primaryLight:  '#e0f2fe',
          text:          '#0f172a',
          textSecondary: '#475569',
          textMuted:     '#94a3b8',
          border:        'rgba(14,165,233,0.15)',
          bgSubtle:      '#f1f5f9',
          success:       '#16a34a',
          error:         '#ef4444',
        },
        layout: {
          heroType:     'split',
          cardStyle:    'shadow',
          navPosition:  'top',
          borderRadius: 'rounded',
        },
      },
      metadata: {
        tagline: 'Professional Dental Care in the Heart of Bratislava',
        stats: [
          { label: '10+',   description: 'years of experience' },
          { label: '8,000+', description: 'happy patients' },
          { label: '3',     description: 'specialist doctors' },
          { label: '4.9',   description: 'Google rating' },
        ],
      },
    },
  });
  console.log('✅ Store:', store.slug);

  // ============ HERO CONFIG ============
  await db.heroConfig.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId:  store.id,
      title:    'DentCare Clinic',
      subtitle: 'Professional Dental Care in the Heart of Bratislava',
      ctaText:  'Book Appointment',
      imageUrl: null,
    },
  });
  console.log('✅ HeroConfig');

  // ============ DOCTORS (ServiceMaster) ============
  const doctorsData = [
    {
      name:           'Dr. Jana Nováková',
      role:           'Dentist',
      specialization: 'Dentist — 12 years of experience',
      bio:            'Specialises in preventive and aesthetic dentistry. Graduate of the Faculty of Medicine, Comenius University Bratislava.',
      photo:          '/team/team-kate.webp',
      sortOrder:      1,
    },
    {
      name:           'Dr. Marek Horváth',
      role:           'Orthodontist',
      specialization: 'Orthodontist — 8 years of experience',
      bio:            'Expert in fixed and removable braces. Member of the Slovak Orthodontic Society.',
      photo:          '/team/team-martin.webp',
      sortOrder:      2,
    },
    {
      name:           'Dr. Petra Kováčová',
      role:           'Paediatric Dentist',
      specialization: 'Paediatric Dentist — 6 years of experience',
      bio:            'Specialist in paedodontics. Creates a friendly, stress-free environment for young patients.',
      photo:          '/team/team-lucia.webp',
      sortOrder:      3,
    },
  ];

  for (const doc of doctorsData) {
    await db.serviceMaster.upsert({
      where: {
        // no unique on name+storeId, so use findFirst-then-create pattern
        id: (await db.serviceMaster.findFirst({ where: { storeId: store.id, name: doc.name } }))?.id ?? 'new',
      },
      update: doc,
      create: { ...doc, storeId: store.id, active: true },
    });
  }
  console.log('✅ Doctors:', doctorsData.length);

  // ============ SERVICES (procedúry) ============
  const servicesData = [
    { slug: 'konzultacia',          nameKey: 'konzultacia',          price: 0,   duration: 15, category: 'prevention',   description: 'Free initial consultation with a dentist — no obligation.' },
    { slug: 'zubna-prehliadka',     nameKey: 'zubnaPrehlidka',       price: 30,  duration: 30, category: 'prevention',   description: 'Comprehensive dental examination including digital X-ray.' },
    { slug: 'cistenie-zubov',       nameKey: 'cistenieZubov',        price: 50,  duration: 45, category: 'hygiene',      description: 'Professional teeth cleaning and tartar removal.' },
    { slug: 'bielenie-zubov',       nameKey: 'bielenieZubov',        price: 120, duration: 60, category: 'aesthetics',   description: 'In-office professional whitening — up to 8 shades brighter.' },
    { slug: 'ortodonticka-kontrola',nameKey: 'ortodontickaKontrola', price: 40,  duration: 30, category: 'orthodontics', description: 'Fixed brace or retainer adjustment and review.' },
    { slug: 'extrakcia-zuba',       nameKey: 'ekstrakciaZuba',       price: 80,  duration: 45, category: 'surgery',      description: 'Tooth extraction under local anaesthesia.' },
  ];

  for (const svc of servicesData) {
    await db.service.upsert({
      where: { storeId_slug: { storeId: store.id, slug: svc.slug } },
      update: svc,
      create: { ...svc, storeId: store.id, currency: 'EUR', active: true },
    });
  }
  console.log('✅ Services (procedúry):', servicesData.length);

  // ============ TESTIMONIALS ============
  const testimonialsData = [
    {
      name:   'Martin K.',
      email:  'martin.k@example.com',
      text:   'Great clinic! Dr. Nováková is very professional and patient. I always leave feeling well looked after. Highly recommended.',
      rating: 5,
      locale: 'en',
    },
    {
      name:   'Eva S.',
      email:  'eva.s@example.com',
      text:   'Teeth whitening was quick and completely painless. The result is amazing — I got compliments the very same day!',
      rating: 5,
      locale: 'en',
    },
    {
      name:   'Peter H.',
      email:  'peter.h@example.com',
      text:   "My daughter's orthodontic treatment is going perfectly. Dr. Horváth always explains everything clearly and patiently.",
      rating: 5,
      locale: 'en',
    },
  ];

  for (const t of testimonialsData) {
    const customer = await db.customer.upsert({
      where: { storeId_email: { storeId: store.id, email: t.email } },
      update: {},
      create: { storeId: store.id, email: t.email, name: t.name },
    });
    await db.testimonial.upsert({
      where: {
        id: (await db.testimonial.findFirst({ where: { storeId: store.id, customerId: customer.id } }))?.id ?? 'new',
      },
      update: {},
      create: {
        storeId:    store.id,
        customerId: customer.id,
        text:       t.text,
        rating:     t.rating,
        locale:     t.locale,
        status:     'APPROVED',
      },
    });
  }
  console.log('✅ Testimonials:', testimonialsData.length);

  // ============ ADMIN USER ============
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'dentcare2024';
  const hash = await bcryptjs.hash(adminPassword, 10);
  await db.adminUser.upsert({
    where: { email: 'admin@dentcare.sk' },
    update: {},
    create: {
      email:        'admin@dentcare.sk',
      passwordHash: hash,
      name:         'DentCare Admin',
      role:         'admin',
      storeId:      store.id,
    },
  });
  console.log('✅ AdminUser: admin@dentcare.sk');

  // ============ LEGAL CONFIG ============
  await db.legalConfig.upsert({
    where: { storeId: store.id },
    update: {},
    create: {
      storeId:     store.id,
      enabled:     true,
      companyName: 'DentCare s.r.o.',
      street:      'Obchodná 15',
      zip:         '811 06',
      city:        'Bratislava',
      country:     'Slovensko',
      email:       'info@dentcare.sk',
      phone:       '+421 900 123 456',
      vatId:       'SK2099999999',
    },
  });
  console.log('✅ LegalConfig');

  console.log('\n🎉 DentCare Clinic seeded successfully!');
  console.log('   Store slug: dentcare');
  console.log('   Admin: admin@dentcare.sk / ' + adminPassword);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); await pool.end(); });
