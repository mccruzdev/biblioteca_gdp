import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function createSuperuser() {
  const prisma = new PrismaClient();

  try {
    const email = 'admin@example.com'; // Email del superusuario
    const password = 'SuperSecurePassword123'; // Contraseña del superusuario

    // Verifica si ya existe un usuario con este email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`Ya existe un usuario con el email: ${email}`);
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el superusuario
    const superuser = await prisma.user.create({
      data: {
        dni: '000000000', // Identificador ficticio
        names: 'Super',
        lastName: 'User',
        phoneNumber: '000000000', // Número ficticio
        password: hashedPassword,
        role: 'ADMIN', // Asegúrate de que este rol exista en tu sistema
        email,
        emailVerified: true,
        isDisabled: false,
        isSuperUser: true,
      },
    });

    console.log(`Superusuario creado: ${superuser.email}`);
  } catch (error) {
    console.error('Error creando el superusuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperuser();
