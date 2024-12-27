import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

// Función para leer entrada del usuario desde la consola
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function createSuperuser() {
  const prisma = new PrismaClient();

  try {
    // Solicitar datos al usuario
    const email = await askQuestion('Ingrese el email del superusuario: ');
    const password = await askQuestion(
      'Ingrese la contraseña del superusuario: ',
    );
    const dni = await askQuestion('Ingrese el DNI del superusuario: ');
    const names = await askQuestion('Ingrese el nombre(s) del superusuario: ');
    const lastName = await askQuestion(
      'Ingrese el apellido del superusuario: ',
    );
    const phoneNumber = await askQuestion(
      'Ingrese el número de teléfono del superusuario: ',
    );

    // Verificar si ya existe un usuario con este email
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
        dni,
        names,
        lastName,
        phoneNumber,
        password: hashedPassword,
        role: 'ADMIN',
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
