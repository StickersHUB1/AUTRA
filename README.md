🗺️Roadmap para el Equipo de Desarrollo:

Por hacer:❌

En proceso:🚧

Hecho:✅

🔹 1. Uso de Endpoints en Node.js ❌

Objetivo:

Aislar la base de datos y controlar las operaciones mediante endpoints, evitando que el cliente acceda directamente a la base de datos.

Implementación:

❌ Configurar un servidor Node.js con Express que exponga únicamente los endpoints necesarios (por ejemplo, para autenticación, consulta y actualización de datos).

❌ Validar en cada endpoint que solo se realicen las operaciones autorizadas.

❌ Asegurar que la base de datos esté protegida y nunca sea expuesta directamente al cliente.

🔹 2. Sistema Totalmente Privado (con VPS) ❌

Objetivo:

Mantener un entorno seguro y privado en el que todos los dispositivos (clientes y servidor) estén en una red controlada, sin depender de servicios externos.

Implementación:

❌ Utilizar un VPS configurado para operar en un entorno privado.

❌ Establecer reglas de firewall que limiten el acceso únicamente a dispositivos autorizados.

❌ Asegurar la comunicación entre los dispositivos mediante una red privada virtual o configuraciones de red adecuadas en el VPS.

🔹 3. Base de Datos Simplificada con Archivos JSON ❌

Objetivo:

Reducir la complejidad en la gestión de datos mediante el uso de archivos JSON en lugar de un motor de base de datos completo.

Implementación:

❌ Crear un archivo users.json (y otros que sean necesarios) para almacenar la información de los usuarios y otros datos relevantes.

❌ Utilizar el módulo fs de Node.js para leer y escribir datos en los archivos.

❌ Estructurar el archivo JSON de forma clara, por ejemplo:

json

[
  {
    "id": "user1",
    "password": "hashed_password",
    "name": "John Doe",
    "role": "terapeuta"
  },
  {
    "id": "user2",
    "password": "hashed_password",
    "name": "Jane Smith",
    "role": "paciente"
  }
]

Ventajas:

No es necesario instalar ni gestionar un motor de base de datos complejo.

Facilita la administración de datos en un entorno controlado.

Permite cifrar los archivos para mayor seguridad.

🔹 4. Autenticación Básica con ID y Contraseña ❌

Objetivo:

Proporcionar un sistema seguro de autenticación usando identificadores únicos y contraseñas.

Implementación:

❌ Asignar a cada usuario un ID único y una contraseña preconfigurada.

❌ Utilizar la librería bcrypt para hashear las contraseñas antes de almacenarlas en el archivo JSON.

❌ Generar IDs únicos con una librería como uuid para evitar duplicados.

Ejemplo de uso de bcrypt:

javascript

const bcrypt = require('bcrypt');
const hashedPassword = bcrypt.hashSync('mi_contraseña_secreta', 10);
console.log(hashedPassword);

🔹 5. Consideraciones de Seguridad ❌

Cifrado de Archivos:

❌ Utilizar el módulo crypto de Node.js para cifrar y descifrar los archivos JSON que contengan datos sensibles, empleando algoritmos como AES.

javascript

const crypto = require('crypto');

const encrypt = (data, secretKey) => {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (data, secretKey) => {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

❌ Restricciones de Red:

❌ Configurar el firewall del VPS para permitir conexiones solo desde dispositivos autorizados.

Registros de Acceso:

❌ Implementar un sistema de logging para registrar intentos de acceso y operaciones, lo que facilitará el monitoreo y la detección de actividades sospechosas.


🔹6. Viabilidad y Escalabilidad

Viabilidad:

Este enfoque es práctico para un sistema pequeño o controlado con menos de 100 usuarios, ya que se mantiene bajo control y no depende de servicios externos.

Escalabilidad:

La solución puede expandirse en el futuro migrando a una base de datos más robusta si fuera necesario, sin necesidad de rehacer la estructura básica del sistema.

Conclusión

Este roadmap permite al equipo de desarrollo implementar un sistema seguro, privado y eficiente utilizando:

Endpoints en Node.js para controlar y aislar el acceso a la base de datos.

Un entorno privado en un VPS con configuraciones adecuadas de firewall y red.

Gestión de datos mediante archivos JSON para simplificar la configuración.

Autenticación básica con técnicas modernas para garantizar la seguridad.

Medidas de seguridad adicionales (cifrado, registros de acceso) para proteger la información.
