import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  const hashedPassword = await bcrypt.hash("password123", 10)

  const servicesResult = await prisma.service.createMany({
    data: [
      {
        name: "Massage Therapy",
        slug: "massage",
        description:
          "Therapeutic massage to relieve muscle tension, reduce stress, and improve circulation. Our registered massage therapists use a variety of techniques tailored to your needs.",
        durationMinutes: 60,
        price: 80,
      },
      {
        name: "Physiotherapy",
        slug: "physiotherapy",
        description:
          "Evidence-based physiotherapy treatment for injury rehabilitation, pain management, and movement optimization. Includes assessment, manual therapy, and exercise prescription.",
        durationMinutes: 45,
        price: 120,
      },
      {
        name: "Acupuncture",
        slug: "acupuncture",
        description:
          "Traditional Chinese acupuncture to promote natural healing, reduce pain, and restore balance. Effective for chronic pain, stress, and various health conditions.",
        durationMinutes: 30,
        price: 90,
      },
    ],
    skipDuplicates: true,
  })

  console.log(`✅ Services ready (${servicesResult.count} created)`)

  const [massage, physiotherapy, acupuncture] = await prisma.service.findMany({
    orderBy: { slug: "asc" },
  })

  const staffUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "sarah.chen@fitnesshealth.com" },
      create: {
        email: "sarah.chen@fitnesshealth.com",
        name: "Sarah Chen",
        password: hashedPassword,
        phone: "(555) 123-4567",
        role: "STAFF",
        emailVerifiedAt: new Date(),
      },
      update: { password: hashedPassword },
    }),
    prisma.user.upsert({
      where: { email: "michael.wong@fitnesshealth.com" },
      create: {
        email: "michael.wong@fitnesshealth.com",
        name: "Michael Wong",
        password: hashedPassword,
        phone: "(555) 234-5678",
        role: "STAFF",
        emailVerifiedAt: new Date(),
      },
      update: { password: hashedPassword },
    }),
    prisma.user.upsert({
      where: { email: "emily.johnson@fitnesshealth.com" },
      create: {
        email: "emily.johnson@fitnesshealth.com",
        name: "Emily Johnson",
        password: hashedPassword,
        phone: "(555) 345-6789",
        role: "STAFF",
        emailVerifiedAt: new Date(),
      },
      update: { password: hashedPassword },
    }),
  ])

  console.log(`✅ Staff users ready`)

  const staffProfiles = await Promise.all([
    prisma.staff.upsert({
      where: { userId: staffUsers[0].id },
      create: {
        userId: staffUsers[0].id,
        bio: "Registered Massage Therapist with 8 years of experience specializing in deep tissue and sports massage. Certified in myofascial release techniques.",
        imageUrl: null,
      },
      update: {
        bio: "Registered Massage Therapist with 8 years of experience specializing in deep tissue and sports massage. Certified in myofascial release techniques.",
      },
    }),
    prisma.staff.upsert({
      where: { userId: staffUsers[1].id },
      create: {
        userId: staffUsers[1].id,
        bio: "Licensed Physiotherapist with expertise in sports injuries and post-surgical rehabilitation. Active member of the Canadian Physiotherapy Association.",
        imageUrl: null,
      },
      update: {
        bio: "Licensed Physiotherapist with expertise in sports injuries and post-surgical rehabilitation. Active member of the Canadian Physiotherapy Association.",
      },
    }),
    prisma.staff.upsert({
      where: { userId: staffUsers[2].id },
      create: {
        userId: staffUsers[2].id,
        bio: "Certified Acupuncturist and Traditional Chinese Medicine practitioner. Specializes in pain management and holistic wellness treatments.",
        imageUrl: null,
      },
      update: {
        bio: "Certified Acupuncturist and Traditional Chinese Medicine practitioner. Specializes in pain management and holistic wellness treatments.",
      },
    }),
  ])

  console.log(`✅ Staff profiles ready`)

  await prisma.staffService.deleteMany({
    where: {
      staffId: { in: staffProfiles.map((s) => s.id) },
    },
  })

  await prisma.staffService.createMany({
    data: [
      { staffId: staffProfiles[0].id, serviceId: massage.id },
      { staffId: staffProfiles[1].id, serviceId: physiotherapy.id },
      { staffId: staffProfiles[1].id, serviceId: massage.id },
      { staffId: staffProfiles[2].id, serviceId: acupuncture.id },
    ],
  })

  console.log(`✅ Staff-service associations ready`)

  for (const staff of staffProfiles) {
    for (let day = 1; day <= 5; day++) {
      await prisma.workingHours.upsert({
        where: {
          staffId_dayOfWeek: { staffId: staff.id, dayOfWeek: day },
        },
        create: {
          staffId: staff.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
        update: {
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
      })
    }
  }

  console.log(`✅ Working hours for all staff (Mon-Fri 9am-5pm)`)

  await prisma.user.upsert({
    where: { email: "demo@customer.com" },
    create: {
      email: "demo@customer.com",
      name: "Demo Customer",
      password: hashedPassword,
      phone: "(555) 999-0000",
      role: "CUSTOMER",
      emailVerifiedAt: new Date(),
    },
    update: { password: hashedPassword },
  })

  console.log(`✅ Demo customer account ready`)

  await prisma.user.upsert({
    where: { email: "admin@fitnesshealth.com" },
    create: {
      email: "admin@fitnesshealth.com",
      name: "Admin User",
      password: hashedPassword,
      phone: "(555) 000-0000",
      role: "ADMIN",
      emailVerifiedAt: new Date(),
    },
    update: {},
  })

  console.log(`✅ Created/updated admin account`)

  console.log("\n🎉 Database seeded successfully!")
  console.log("\n📋 Login credentials for testing:")
  console.log("   Admin: admin@fitnesshealth.com / password123")
  console.log("   Customer: demo@customer.com / password123")
  console.log("   Staff (Sarah): sarah.chen@fitnesshealth.com / password123")
  console.log("   Staff (Michael): michael.wong@fitnesshealth.com / password123")
  console.log("   Staff (Emily): emily.johnson@fitnesshealth.com / password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
