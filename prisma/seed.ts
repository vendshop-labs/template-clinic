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
        tagline: 'Profesionálna stomatológia v centre Bratislavy',
        stats: [
          { label: '10+ rokov', description: 'skúseností' },
          { label: '8 000+', description: 'spokojných pacientov' },
          { label: '3 doktori', description: 'odborníci' },
          { label: '4.9', description: 'priemerné hodnotenie' },
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
      subtitle: 'Profesionálna stomatológia v centre Bratislavy',
      ctaText:  'Objednať termín',
      imageUrl: null,
    },
  });
  console.log('✅ HeroConfig');

  // ============ DOCTORS (ServiceMaster) ============
  const doctorsData = [
    {
      name:           'Dr. Jana Nováková',
      role:           'Stomatológ',
      specialization: 'Stomatológ — 12 rokov praxe',
      bio:            'Špecializuje sa na preventívnu starostlivosť a estetickú stomatológiu. Absolventka LF UK Bratislava.',
      photo:          '/team/team-kate.webp',
      sortOrder:      1,
    },
    {
      name:           'Dr. Marek Horváth',
      role:           'Ortodontista',
      specialization: 'Ortodontista — 8 rokov praxe',
      bio:            'Expert na fixné a snímateľné rovnátka. Člen Slovenskej ortodontickej spoločnosti.',
      photo:          '/team/team-martin.webp',
      sortOrder:      2,
    },
    {
      name:           'Dr. Petra Kováčová',
      role:           'Detský zubár',
      specialization: 'Detský zubár — 6 rokov praxe',
      bio:            'Špecialista na pedostomatológiu. Vytvára príjemné prostredie pre detských pacientov.',
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
    { slug: 'konzultacia',          nameKey: 'konzultacia',          price: 0,   duration: 15, category: 'preventiva', description: 'Bezplatná úvodná konzultácia so stomatológom.' },
    { slug: 'zubna-prehliadka',     nameKey: 'zubnaPrehlidka',       price: 30,  duration: 30, category: 'preventiva', description: 'Komplexná zubná prehliadka vrátane RTG snímky.' },
    { slug: 'cistenie-zubov',       nameKey: 'cistenieZubov',        price: 50,  duration: 45, category: 'hygiena',    description: 'Profesionálne čistenie zubov a odstránenie zubného kameňa.' },
    { slug: 'bielenie-zubov',       nameKey: 'bielenieZubov',        price: 120, duration: 60, category: 'estetika',   description: 'Profesionálne bielenie zubov o 4–8 odtieňov.' },
    { slug: 'ortodonticka-kontrola',nameKey: 'ortodontickaKontrola', price: 40,  duration: 30, category: 'ortodontia', description: 'Kontrola fixných rovnátok alebo retainerov.' },
    { slug: 'extrakcia-zuba',       nameKey: 'ekstrakciaZuba',       price: 80,  duration: 45, category: 'chirurgia',  description: 'Extrakcia zuba vrátane lokálnej anestézie.' },
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
      text:   'Skvelá klinika! Doktorka Nováková je veľmi profesionálna a trpezlivá. Odporúčam všetkým.',
      rating: 5,
      locale: 'sk',
    },
    {
      name:   'Eva S.',
      email:  'eva.s@example.com',
      text:   'Bielenie zubov prebehlo rýchlo a bez bolesti. Výsledok je úžasný, som veľmi spokojná!',
      rating: 5,
      locale: 'sk',
    },
    {
      name:   'Peter H.',
      email:  'peter.h@example.com',
      text:   'Ortodontická liečba mojej dcéry prebieha skvele. Dr. Horváth vždy všetko vysvetlí.',
      rating: 5,
      locale: 'sk',
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
