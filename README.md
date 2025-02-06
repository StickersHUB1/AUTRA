# **GUÍA DETALLADA PARA LA DIGITALIZACIÓN DE AUTRA**

## **Índice**

1. [Introducción](#introducción)
2. [Objetivos del Proyecto](#objetivos-del-proyecto)
3. [Tecnologías](#tecnologías)
4. [Fases del Proyecto](#fases-del-proyecto)
   - [Fase 1: Configuración del Entorno](#fase-1)
   - [Fase 2: Desarrollo del Backend](#fase-2)
   - [Fase 3: Implementación del Frontend](#fase-3)
   - [Fase 4: Digitalización y Automatización](#fase-4)
   - [Fase 5: Despliegue, Seguridad y Optimización](#fase-5)
   - [Fase 6: Pruebas y Validaciones Finales](#fase-6)
5. [Conclusión](#conclusión)

---

## **Objetivos del Proyecto**

Este proyecto tiene como objetivo la digitalización eficiente de documentos y tests terapéuticos mediante un sistema escalable, seguro y optimizado para entornos en la nube. Se busca:

- **Automatizar** la captura, almacenamiento y procesamiento de documentos físicos.
- **Garantizar la seguridad** en el manejo y almacenamiento de datos sensibles.
- **Optimizar el acceso** a los documentos digitales a través de una interfaz intuitiva.
- **Implementar herramientas robustas** para la gestión de PDFs y la manipulación de formularios electrónicos.

## **Tecnologías**

Para lograr estos objetivos, se emplearán las siguientes tecnologías:

- **Backend:** Node.js con Express.js para la gestión de API y servidores.
- **Frontend:** HTML5, CSS3, JavaScript y pdf.js para la manipulación de documentos.
- **Base de Datos:** Almacenamiento en JSON con opción de escalabilidad a MongoDB o PostgreSQL.
- **Infraestructura:** VPS con Ubuntu 20.04 LTS, utilizando Nginx como proxy inverso y Certbot para SSL.
- **Gestión de Procesos:** PM2 para administración y monitoreo del servidor en producción.

## **Fase 1: Configuración del Entorno** ❌

📆 **Duración: aproximadamente 4 semanas**

### **Paso 1: Conectar al VPS y Preparar el Sistema**

```bash
# Este comando te permite acceder remotamente a tu servidor virtual privado (VPS) de manera segura mediante Secure Shell (SSH).
# 'usuario' es tu nombre de usuario en el servidor y 'IP_DEL_VPS' es la dirección IP del VPS.
# Si es la primera vez que te conectas, podrías ver una advertencia sobre la autenticidad del host; responde 'yes' para continuar.
ssh usuario@IP_DEL_VPS
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git vim ufw build-essential
```

### **Paso 2: Instalar Node.js y Configurar el Firewall**

```bash
# NVM (Node Version Manager) permite instalar y gestionar diferentes versiones de Node.js.
# Esto es útil para mantener la compatibilidad entre diferentes proyectos.
# Descargar el script de instalación de NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Ejecutar el script para configurar el entorno
source ~/.bashrc

# Instalar la versión LTS de Node.js para garantizar estabilidad y soporte a largo plazo
nvm install --lts
source ~/.bashrc

# Verifica la versión de Node.js instalada para asegurarte de que NVM funciona correctamente.
node -v
nvm install --lts
# Permitimos SSH (puerto 22) para poder gestionar el servidor remotamente.
sudo ufw allow ssh
# El puerto 3000 se abre para tu aplicación Node.js.
sudo ufw allow 3000/tcp
# HTTP (puerto 80) permite el acceso web sin cifrado.
sudo ufw allow 80/tcp
# HTTPS (puerto 443) es necesario para que tu sitio web sea accesible de forma segura.
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## **Fase 2: Desarrollo del Backend** ❌

📆 **Duración: aproximadamente 3 semanas**

### **Paso 3: Crear la Estructura del Backend**

```bash
mkdir -p digitalizacion/backend && cd digitalizacion/backend
# Este comando crea un archivo package.json para gestionar las dependencias de tu proyecto Node.js.
# La opción -y usa valores predeterminados, evitando preguntas interactivas.
npm init -y
npm install express

# Verifica que Express se ha instalado correctamente.
npm list express
```

### **Paso 4: Configurar el Servidor Express**

```javascript
// Importa Express, un framework para Node.js.
const express = require('express');
// Crea una instancia de Express.
const app = express();
// Define el puerto en el que se ejecutará el servidor.
const port = 3000;

// Permite que el servidor interprete JSON en las solicitudes POST.
app.use(express.json());
// Configura Express para servir archivos estáticos desde la carpeta frontend.
app.use(express.static('../frontend'));

// Define una ruta raíz que responde con un mensaje de bienvenida.
app.get('/', (req, res) => res.send('Servidor activo 🚀'));

// Inicia el servidor en el puerto especificado, mostrando un mensaje de confirmación.
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
```

### **Paso 5: Configurar Nginx como Proxy Inverso**

**Objetivo:** Nginx actuará como un proxy inverso, redirigiendo las solicitudes del puerto 80 (HTTP) a tu aplicación Node.js en el puerto 3000. Esto permite una mejor gestión del tráfico y mejora la seguridad del sistema.

```bash
# Implementar un servidor web ligero de alto rendimiento como Nginx para la gestión de solicitudes y balanceo de carga.
sudo apt install nginx -y
sudo vim /etc/nginx/sites-available/digitalizacion
```

Pegar en el archivo:

```nginx
# Configuración de Nginx para actuar como proxy inverso.
server {
        # Nginx escucha en el puerto 80 (HTTP) y redirige las solicitudes a la aplicación Node.js.
    listen 80;
        # Define el dominio que este servidor atenderá. Sustituye 'tudominio.com' con tu dominio real.
    server_name tudominio.com;
    location / {
                # Redirige las solicitudes HTTP al backend en localhost:3000, donde se ejecuta la aplicación Node.js.
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
                # Configura los encabezados HTTP para mantener la conexión adecuada entre Nginx y la aplicación Node.js.
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/digitalizacion /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Verifica que Nginx está corriendo correctamente.
sudo systemctl status nginx
```

---

## **Fase 3: Implementación del Frontend** ❌

📆 **Duración: aproximadamente 3 semanas**

### **Paso 6: Crear la Estructura del Frontend**

**Objetivo:** Organizamos la estructura del frontend para mantener el CSS, JavaScript y archivos estáticos en carpetas separadas, facilitando la gestión del proyecto.

```bash
mkdir -p digitalizacion/frontend/css digitalizacion/frontend/js digitalizacion/frontend/assets
```

### **Paso 7: Crear ****`index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <title>Digitalización de PDFs</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
    <!-- Carga la librería pdf.js para manipular PDFs en el navegador. -->
</head>
<body>
  <h1>Test Terapéutico</h1>
  <div id="pdf-container"></div>
    <!-- Este div es donde se renderizará el PDF dentro de la interfaz web. -->
  <form id="testForm">
    <!-- El formulario permite la interacción del usuario con el contenido del PDF. -->
    <input type="text" id="respuesta1" placeholder="Respuesta 1">
    <button type="submit">Enviar</button>
  </form>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## **Fase 4: Digitalización y Automatización** ❌

📆 **Duración: aproximadamente 3 semanas**

### **Paso 8: Carga y Visualización de PDFs**

**Objetivo:** pdf.js permite visualizar y manipular PDFs directamente en el navegador, sin necesidad de plugins adicionales. Aquí estamos configurando para cargar y mostrar un PDF.

**Objetivo:** Permitir la visualización de PDFs dentro de la aplicación sin modificar su estructura.

#### **1. Instalar y Configurar pdf.js**

1. Descarga la librería de pdf.js en el frontend:

   ```bash
   mkdir -p digitalizacion/frontend/js
   cd digitalizacion/frontend/js
   wget https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js
   ```

2. Agrega la referencia a pdf.js en `index.html`:

   ```html
   <script src="js/pdf.min.js"></script>
   ```

3. Crea `pdf-handler.js` dentro de la carpeta `js/` y añade el siguiente código:

   ```javascript
   pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';
   var url = 'ruta/al/documento.pdf';

   pdfjsLib.getDocument(url).promise.then(function(pdf) {
       pdf.getPage(1).then(function(page) {
           var scale = 1.5;
           var viewport = page.getViewport({scale: scale});
           var canvas = document.createElement('canvas');
           document.getElementById('pdf-container').appendChild(canvas);
           var context = canvas.getContext('2d');
           canvas.height = viewport.height;
           canvas.width = viewport.width;
           var renderContext = {
               canvasContext: context,
               viewport: viewport
           };
           page.render(renderContext);
       });
   });
   ```

---

### **Paso 9: Superposición de Formularios en el PDF**

**Objetivo:** Usamos CSS para posicionar un formulario sobre el PDF, permitiendo al usuario interactuar con el documento sin alterarlo.

**Nota:** Es importante ajustar estas posiciones según el diseño del PDF específico para asegurar una alineación precisa de los campos.

**Objetivo:** Usamos CSS para posicionar un formulario sobre el PDF, permitiendo al usuario interactuar con el documento sin alterarlo.

**Objetivo:** Permitir que los usuarios ingresen respuestas dentro de los PDFs sin alterar el archivo original.

#### **1. Crear un Contenedor para Formularios**

1. Agregar un `div` en `index.html` que contendrá los formularios interactivos:

   ```html
   <div id="overlay" style="position: absolute; top: 50px; left: 100px; z-index: 10;">
       <input type="text" id="campoRespuesta" placeholder="Respuesta...">
   </div>
   ```

2. Ajustar la posición del formulario en `pdf-handler.js` para que coincida con el documento:

   ```javascript
   var overlay = document.getElementById('overlay');
// Ejemplo conceptual para ajuste dinámico:
// overlay.style.top = `${page.height / 2}px`;
// overlay.style.left = `${page.width / 2}px`;
   overlay.style.top = "150px";
   overlay.style.left = "200px";
   ```

---

### **Paso 10: Recolección y Almacenamiento de Datos**

**Objetivo:** Guardar las respuestas ingresadas en el formulario y enviarlas al backend.

#### **1. Capturar Datos y Enviar a la API**

1. Agregar un botón en `index.html` para enviar los datos:

   ```html
   <button id="enviarDatos">Enviar Respuestas</button>
   ```

2. Modificar `pdf-handler.js` para capturar y enviar datos:

   ```javascript
   // Este código maneja el evento de clic en el botón 'Enviar Respuestas', enviando los datos al backend vía una solicitud POST.
// Asegúrate de manejar errores de red para mejorar la experiencia del usuario.
document.getElementById('enviarDatos').addEventListener('click', function() {
       var respuesta = document.getElementById('campoRespuesta').value;
       fetch('/api/test/submit', {
       // Manejo de errores de red o del servidor.
// Los desarrolladores pueden mejorar la experiencia del usuario mostrando mensajes personalizados o proporcionando instrucciones para resolver problemas.
// Ejemplo: Mostrar un mensaje amigable en la interfaz en lugar de solo imprimir el error en la consola.
       .catch(error => console.error('Error:', error));
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({ respuesta: respuesta })
       })
       .then(response => response.json())
       .then(data => alert('Respuestas guardadas correctamente'));
   });
   ```

---

### **Paso 11: Generación y Edición de PDFs con Respuestas**

**Objetivo:** pdf-lib se utiliza aquí para modificar el PDF existente, añadiéndole las respuestas del usuario sin cambiar su estructura original.

**Objetivo:** Insertar las respuestas en un PDF y permitir su descarga.

#### **1. Usar pdf-lib para Modificar el PDF**

1. Instalar pdf-lib en el backend:

   ```bash
   npm install pdf-lib

# Verifica que pdf-lib se ha instalado correctamente.
npm list pdf-lib
   ```

2. Crear un endpoint en `server.js` para modificar el PDF:

   ```javascript
   const { PDFDocument } = require('pdf-lib');
   const fs = require('fs');

   app.post('/api/generar-pdf', async (req, res) => {
       const { respuesta } = req.body;
       const pdfDoc = await PDFDocument.load(fs.readFileSync('ruta/al/documento.pdf'));
       const pages = pdfDoc.getPages();
       const firstPage = pages[0];
       firstPage.drawText(respuesta, { x: 100, y: 500, size: 20 });
       const pdfBytes = await pdfDoc.save();
       fs.writeFileSync('ruta/al/nuevo_documento.pdf', pdfBytes);
       res.download('ruta/al/nuevo_documento.pdf');
   });
   ```

---

### **Paso 12: Extracción de Texto desde PDFs Existentes**

**Objetivo:** pdf-parse extrae texto de PDFs, pero no es óptimo para PDFs escaneados o con texto en imágenes; en esos casos, consideraría usar OCR.

**Objetivo:** Leer texto de un PDF y convertirlo en datos editables.

#### **1. Usar pdf-parse para Extraer Texto**

1. Instalar pdf-parse en el backend:

   ```bash
   npm install pdf-parse
   ```

2. Crear un endpoint en `server.js` para procesar el PDF:

   ```javascript
   // Nota: pdf-parse no funcionará bien con PDFs escaneados. Considera OCR para esos casos.
const pdfParse = require('pdf-parse');

   app.post('/api/extraer-texto', async (req, res) => {
       const dataBuffer = fs.readFileSync('ruta/al/documento.pdf');
       pdfParse(dataBuffer).then(function(data) {
           res.json({ texto: data.text });
       });
   });
   ```

---

## **Fase 5: Despliegue, Seguridad y Optimización** ❌

📆 **Duración: aproximadamente 3 semanas**

### **Paso 13: Implementar Certificado SSL con Certbot**

**Objetivo:** Certbot automatiza la obtención y renovación de certificados SSL, asegurando conexiones seguras para tu sitio.

```bash
sudo apt install certbot python3-certbot-nginx -y
# Certbot automatiza la obtención y renovación de certificados SSL, asegurando conexiones seguras para tu sitio web.
sudo certbot --nginx -d tudominio.com
```

### **Paso 14: Configurar PM2 para el Backend**

```bash
sudo npm install -g pm2
# Usar PM2 para gestionar procesos de Node.js y garantizar su persistencia en producción.
pm2 start backend/server.js --name "digitalizacion"
pm2 save

# Verifica que tu aplicación está siendo gestionada por PM2.
pm2 list
pm2 startup
```

📆 **Duración: aproximadamente 3 semanas**



```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.com
```



```bash
sudo npm install -g pm2
pm2 start backend/server.js --name "digitalizacion"
pm2 save
pm2 startup
```

---

## **Fase 6: Pruebas y Validaciones Finales** ❌

📆 **Duración: aproximadamente 3 semanas**

### **Paso 15: Validar el Funcionamiento del Sistema**

**Objetivo:** Confirmar que la aplicación funciona correctamente en producción, asegurando que todas las funcionalidades están operativas y que los datos se almacenan y procesan sin errores.

#### **Ejemplos de pruebas específicas:**

- **Monitoreo del uso de recursos durante las pruebas de carga:**
  - Para verificar el consumo de CPU y memoria mientras se ejecutan pruebas de carga:
    ```bash
    top
    ```
    O una versión más interactiva con:
    ```bash
    htop
    ```
  - Observa si hay picos en el uso de CPU o si el servidor alcanza el límite de memoria.

- **Prueba de carga básica:**
  - Usa herramientas como Apache JMeter o el propio navegador para enviar múltiples solicitudes simultáneas y verificar cómo se comporta el sistema.
  - Mide el tiempo de respuesta y analiza si el servidor se mantiene estable bajo carga.
  - Si notas una caída en el rendimiento, revisa los logs con:
    ```bash
    pm2 logs digitalizacion
    ```

- **Prueba que el sistema maneja correctamente archivos PDF de gran tamaño.**
  - Intenta cargar y procesar un archivo PDF de más de 10 MB.
  - Verifica que la visualización no presente errores ni ralentizaciones significativas.
  - Si el archivo no se carga, revisa los logs con:
    ```bash
    pm2 logs digitalizacion

# Observa errores específicos como 404, 500, o cualquier mensaje que indique fallos en tu aplicación o Nginx.
    ```

- **Asegura que la aplicación responde adecuadamente a entradas incorrectas o maliciosas en el formulario.**
  - Intenta enviar datos vacíos en el formulario y verifica que el sistema devuelve un mensaje de error adecuado.
  - Introduce caracteres especiales o código sospechoso para evaluar la seguridad contra ataques de inyección.
  - Revisa los logs de errores con:
    ```bash
    sudo tail -f /var/log/nginx/error.log
    ```

- **Validación de almacenamiento de datos.**
  - Envía datos de prueba desde el formulario y confirma que se almacenan correctamente en la base de datos o en el archivo JSON.
  - Revisa el contenido de `tests.json` para asegurar que las respuestas se guardan de forma estructurada:
    ```bash
    cat digitalizacion/backend/data/tests.json
    ```

- **Prueba de generación y descarga de PDFs.**
  - Completa el formulario y genera un PDF con las respuestas incorporadas.
  - Descarga el archivo generado y ábrelo con un visor de PDF.
  - Verifica que el contenido es legible y que todas las respuestas aparecen en su lugar correcto.
  - Si el archivo no se genera, revisa los logs con:
    ```bash
    pm2 logs digitalizacion
    ```

**Objetivo:** Confirmar que la aplicación funciona correctamente en producción, asegurando que todas las funcionalidades están operativas y que los datos se almacenan y procesan sin errores.

#### **1. Acceder a la Aplicación en Producción**

1. Abre un navegador web y visita `https://tudominio.com`.
2. Verifica que la página de inicio se carga sin errores y que el contenido se muestra correctamente.
3. Si la página no carga, revisa el estado de Nginx en el servidor con:
   ```bash
   sudo systemctl status nginx
   ```
   Si hay errores, intenta reiniciar el servicio:
   ```bash
   sudo systemctl restart nginx
   ```

#### **2. Prueba del Envío de Datos desde el Formulario**

1. Accede al formulario en la interfaz web.
2. Ingresa datos de prueba en los campos correspondientes y presiona "Enviar".
3. Abre la consola del navegador (F12 en la mayoría de los navegadores, luego pestaña "Consola").
4. Si hay errores en la red, revisa los detalles en la pestaña "Red" (Network) para verificar las solicitudes enviadas.
5. Confirma que los datos han llegado al servidor ejecutando en el VPS:
   ```bash
   cat digitalizacion/backend/data/tests.json
   ```
   Esto debería mostrar las respuestas almacenadas.

#### **3. Verificar la Generación y Descarga Correcta de PDFs**

1. Ingresa respuestas en el formulario.
2. Presiona el botón de generación de PDF.
3. Descarga el archivo generado y ábrelo en un lector de PDF.
4. Confirma que las respuestas aparecen dentro del documento.
5. Si el archivo no se genera, revisa los logs del servidor con:
   ```bash
   pm2 logs digitalizacion
   ```
   Si hay errores en pdf-lib, asegúrate de que el módulo está instalado correctamente:
   ```bash
   npm list pdf-lib
   ```

- Acceder a `https://tudominio.com` y verificar la carga correcta.
- Enviar datos desde el formulario y verificar la base de datos.
- Asegurar la generación y descarga correcta de PDFs.

### **Paso 16: Monitorear Logs y Seguridad**

**Objetivo:** Supervisar el funcionamiento del sistema, detectar posibles errores y garantizar la estabilidad del servicio.

#### **Pruebas de Seguridad**

**Nota:** La correcta implementación de estas pruebas es crucial para la integridad y seguridad del sistema en su totalidad.

- **Verificación de exposición de datos sensibles:**
  - Revisa si respuestas del servidor incluyen información sensible como rutas de archivos o detalles de configuración.
  - Usa herramientas como `curl` o la consola del navegador para inspeccionar respuestas de la API.
  - ```bash
    curl -i https://tudominio.com/api/test/submit
    ```

- **Protección contra inyección de código:**
  - Intenta enviar caracteres especiales y código malicioso en los formularios.
  - Verifica que el sistema devuelve errores controlados sin ejecutar código no autorizado.

- **Prueba de acceso restringido:**
  - Intenta acceder a endpoints protegidos sin autenticación.
  - Revisa que el servidor responda con `403 Forbidden` en caso de acceso no autorizado.

#### **Errores Comunes y Soluciones**

- **Error: 'EACCES: Permission denied' al iniciar el servidor Node.js**
  - Solución: Ejecutar el comando con `sudo` o cambiar los permisos de la carpeta donde se ejecuta el servidor.
  - ```bash
    sudo chmod -R 755 /ruta/del/proyecto
    ```

- **Error: 'Address already in use' en el puerto 3000**
  - Solución: Verificar si otro proceso está usando el puerto y detenerlo.
  - ```bash
    sudo lsof -i :3000
    sudo kill -9 <PID>
    ```

- **Error en Nginx: '502 Bad Gateway'**
  - Solución: Verificar que el servidor Node.js esté corriendo correctamente con:
  - ```bash
    pm2 list
    ```
  - Reiniciar Nginx si es necesario:
  - ```bash
    sudo systemctl restart nginx
    ```

- **Certificado SSL no renovado automáticamente**
  - Solución: Forzar la renovación manual con:
  - ```bash
    sudo certbot renew --force-renewal
    ```
  - Reiniciar Nginx después de renovar:
  - ```bash
    sudo systemctl restart nginx
    ```

#### **Monitoreo de Logs**

# pm2 logs muestra mensajes de tu aplicación y errores de Node.js.
# access.log de Nginx contiene detalles de cada solicitud recibida.
# error.log de Nginx muestra errores en la configuración o ejecución del servidor web.

```bash
pm2 logs digitalizacion
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Objetivo:** Supervisar el funcionamiento del sistema, detectar posibles errores y garantizar la estabilidad del servicio.

#### **Errores Comunes y Soluciones**

- **Error: 'EACCES: Permission denied' al iniciar el servidor Node.js**
  - Solución: Ejecutar el comando con `sudo` o cambiar los permisos de la carpeta donde se ejecuta el servidor.
  - ```bash
    sudo chmod -R 755 /ruta/del/proyecto
    ```

- **Error: 'Address already in use' en el puerto 3000**
  - Solución: Verificar si otro proceso está usando el puerto y detenerlo.
  - ```bash
    sudo lsof -i :3000
    sudo kill -9 <PID>
    ```

- **Error en Nginx: '502 Bad Gateway'**
  - Solución: Verificar que el servidor Node.js esté corriendo correctamente con:
  - ```bash
    pm2 list
    ```
  - Reiniciar Nginx si es necesario:
  - ```bash
    sudo systemctl restart nginx
    ```

- **Certificado SSL no renovado automáticamente**
  - Solución: Forzar la renovación manual con:
  - ```bash
    sudo certbot renew --force-renewal
    ```
  - Reiniciar Nginx después de renovar:
  - ```bash
    sudo systemctl restart nginx
    ```

#### **Monitoreo de Logs**

# pm2 logs muestra mensajes de tu aplicación y errores de Node.js.
# access.log de Nginx contiene detalles de cada solicitud recibida.
# error.log de Nginx muestra errores en la configuración o ejecución del servidor web.

**Objetivo:** Supervisar el funcionamiento del sistema, detectar posibles errores y garantizar la estabilidad del servicio.

# pm2 logs muestra mensajes de tu aplicación y errores de Node.js.
# access.log de Nginx contiene detalles de cada solicitud recibida.
# error.log de Nginx muestra errores en la configuración o ejecución del servidor web.

```bash
pm2 logs digitalizacion
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

📆 **Duración: aproximadamente 3 semanas**

###



```bash
pm2 logs digitalizacion
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## **Conclusión**

Siguiendo esta guía “masticada”, tendrás un sistema de digitalización funcional, seguro y escalable, listo para producción.

### **Optimización y Mantenimiento**

Para garantizar que el sistema siga funcionando correctamente y de manera eficiente, es importante aplicar prácticas de mantenimiento:

- **Optimización del Rendimiento:** Comprimir archivos PDF para reducir el ancho de banda o utilizar CDN para archivos estáticos.
- **Monitoreo y Seguridad:** Revisar logs con regularidad para detectar problemas potenciales.
- **Backups y Recuperación:** Implementar copias de seguridad de la base de datos y archivos PDF generados.

### **Posibles Mejoras Futuras**

- **Migración a Base de Datos:** Si el volumen de datos aumenta, podría ser útil pasar de almacenamiento en JSON a una base de datos robusta como MongoDB o PostgreSQL.
- **Automatización de Procesos:** Implementar generación automática de informes PDF sin necesidad de intervención manual.
- **Escalabilidad del Sistema:** Configurar balanceo de carga y contenedores Docker para mejorar la estabilidad en producción.

---

### **Recursos Adicionales**

Para ampliar conocimientos sobre las tecnologías utilizadas en esta guía, se recomienda consultar la documentación oficial:

- **Node.js & Express:** [https://nodejs.org](https://nodejs.org)
- **pdf.js:** [https://mozilla.github.io/pdf.js/](https://mozilla.github.io/pdf.js/)
- **pdf-lib:** [https://pdf-lib.js.org/](https://pdf-lib.js.org/)
- **Certbot SSL:** [https://certbot.eff.org/](https://certbot.eff.org/)
- **PM2:** [https://pm2.keymetrics.io/](https://pm2.keymetrics.io/)

Siguiendo esta guía, tendrás un sistema de digitalización funcional, seguro y escalable, listo para producción. 🚀
