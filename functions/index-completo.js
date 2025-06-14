// Deploy Fix 2025-06-05 14:35 - Individual cancellation URLs
// Google Sheets Integration - 2025-06-05 15:30

const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
const { GoogleSpreadsheet } = require('google-spreadsheet'); // Nueva dependencia

// Inicializar Firebase Admin
admin.initializeApp();

// Configuraci├│n global
setGlobalOptions({maxInstances: 10});

// Configuraci├│n simple de Gmail con App Password
const createTransporter = () => {
  // Usar directamente la App Password (m├ís simple y confiable)
  const gmailPassword = 'myuh svqx djyn kfby';
  
  console.log('≡ƒôº Configurando Gmail transporter...');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'paddlepapudo@gmail.com',
      pass: gmailPassword
    }
  });
};

// ============================================================================
// NUEVA FUNCI├ôN: VERIFICAR GOOGLE SHEETS API
// ============================================================================
exports.verifyGoogleSheetsAPI = onRequest({
  cors: true,
}, async (req, res) => {
  try {
    console.log('≡ƒöì Verificando configuraci├│n de Google Sheets API...');
    
    const SHEET_ID = '1A-8RvvgkHXUP-985So8CBJvDAj50w58EFML1CJEq2c4';
    const SHEET_NAME = 'Maestro';
    
    // Verificar variables de entorno
    const serviceAccountEmail = "sheets-api-service@cgpreservas.iam.gserviceaccount.com";
    const privateKey = `-----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDjOl2rzfM4gPIT
    LgW34/wl1TY/elF6ic6JP53hxHWJZeyjd3q5eFl9fWvdDaujo641ymq0LDeW7rFS
    QnDhM+EmEmQEz/r6YFmzRhzneIZXSJDjGdSPdV3LkIuhn6Fz/2eiL+k9qMAx5Tea
    fPlLikd4UHhw4yEMpnmkt/MBxxW77taoCTTR/Es6e+j0/qpMmdY/G/E0jgjIITwR
    TIRgzyPgGmax+JZleXqQXZYDPlThozXqMZiVr6+4OPkZod2EUwCki+L2vdh+0KqW
    xZejkjZ8Yc89YWzAr2QXGh2V2wy8h4DLk+z7hBw0hhmc6qpfRPw8I51S553E8Q1V
    3K0EKQc7AgMBAAECggEAFhLg76QxqP8JxSg24P7SS2CThQYebS9+82FNNpXtrxvK
    KbUdJHBXDTRGarJ9xodLkKkpxXf4LH7ilfGjYpU2HYsy0S7dHD6I6Dv66deRAWCo
    xo8HUapeorxXfCt0NT8N87kAyP8gMJiqVqUmWJrFx5/Vm23NE5wGfCRshHMxHtDt
    f0CNZwXvgRQdIGgIBGk9sVspSWKWLqSjCK+aknaBlOieNq3VwhdytBYdr0HukLl2
    kV4FGGtOu2QbLTEfI1gZk1L48wOrSquHPt++OnOGe7AHCgykoj4IIvt9UMi+yp9q
    v+2nsBr8P5ZR0PS8oLIXn6JQwjUD7sDc/JTI2TeA9QKBgQD6tV5P4R75he3wxjxX
    5muean28Y6VwkJzvh3rd3ABj/8NC8AV7N0/Gf1j9f3EkK+Gf29cGbn6CkR9YyXya
    kDu8ZbNZHyXyI3V+bOnnQC+71D11TcKKdoLtYN2oicxMEHPxw9kXSG+XoOc4DCX0
    bpiVYEHq5VYesrzeHcJmNb0VhwKBgQDoBiCf1gz3rGg+aNEP5LFChcqNf5aFtfdG
    ElP2VXoLWtVlSeteQR0lVoduBHhp4gwBBdNdW/O/sRvlOMqYAADz9+R9dTay5NfO
    61n3RX+Dg8BHRnfKwEkJwtEkwYFE3pKHRppMwJV6j7KHHv2gEX8Xg7j8+jGHSIlS
    Cy038tFtrQKBgBuW0eYgc/QplOGmLwXNSZKJTYTpwk782whQ9GhtyW03vBklqLTC
    hXjmkrhyydSdL5sT6jm+9xUPO0/d/GRV8vzshCwOjXJ0DH35JlRYb+hPluPNxtbN
    6+KLglkFsQG93cSBNOanBgC9qDQ2wgaAFTJ7AUYELtH6AWbAB6CP0VsJAoGACbqY
    C5uyF4CHLna+rWftdtidUamT6i9jGvERzDZxU6CPahvbXqxkSHiEXTyav/XWgwR3
    hGaipdsLTGVBOXZmk9RFJG2RyZaG5gpAT3n+iskves2doEbHyTz+AAiNHxImGr3/
    IlDA886qsbe+8sNJDPdc/l6PTRjhiSsmzj3EQlECgYEA5cN5s0gG1lMi3g6BYgJI
    ygMUk3gc51IdnybXyunvNOMwBSf82fQE3OVLuQBDXISOkQUHBnjnrQYt5Vf1JZGU
    15SNAe15MPdYJujryWGEqw3Q6qHc1XGJJAfxMMz8YbO06czV6TZK9GOdREzWnvnM
    XZTXYEu54CkpfjQSs3dMAgY=
    -----END PRIVATE KEY-----`;
    
    console.log('≡ƒôº Service Account Email:', serviceAccountEmail ? 'CONFIGURADO' : 'Γ¥î FALTANTE');
    console.log('≡ƒöæ Private Key:', privateKey ? 'CONFIGURADO' : 'Γ¥î FALTANTE');
    
    if (!serviceAccountEmail || !privateKey) {
      return res.status(500).json({
        error: 'Credenciales de Google Sheets API no configuradas',
        missing: {
          serviceAccountEmail: !serviceAccountEmail,
          privateKey: !privateKey
        },
        instructions: [
          'Configurar variables de entorno en Firebase Functions:',
          'firebase functions:config:set google.service_account_email="tu-email@proyecto.iam.gserviceaccount.com"',
          'firebase functions:config:set google.private_key="-----BEGIN PRIVATE KEY-----\\n..."'
        ]
      });
    }
    
    // Intentar conectar a Google Sheets
    const doc = new GoogleSpreadsheet(SHEET_ID);
    
    await doc.useServiceAccountAuth({
      client_email: serviceAccountEmail,
      private_key: privateKey.replace(/\n    /g, '\n'),
    });
    
    console.log('Γ£à Autenticaci├│n exitosa');
    
    // Cargar informaci├│n del documento
    await doc.loadInfo();
    console.log('≡ƒôè Documento cargado:', doc.title);
    
    // Verificar que existe la hoja 'Maestro'
    const sheet = doc.sheetsByTitle[SHEET_NAME];
    if (!sheet) {
      const availableSheets = Object.keys(doc.sheetsByTitle);
      return res.status(404).json({
        error: `Hoja '${SHEET_NAME}' no encontrada`,
        availableSheets: availableSheets,
        suggestion: 'Verificar nombre de la hoja'
      });
    }
    
    console.log('≡ƒôï Hoja encontrada:', sheet.title);
    
    // Cargar las primeras filas para verificar estructura
    await sheet.loadHeaderRow();
    const headers = sheet.headerValues;
    
    console.log('≡ƒô¥ Headers encontrados:', headers);
    
    // Verificar headers esperados
    const expectedHeaders = ['EMAIL', 'NOMBRE(S)', 'APELLIDO_PATERNO', 'APELLIDO_MATERNO', 'RUT/PASAPORTE', 'FECHA NACIMIENTO', 'RELACION', 'CELULAR'];
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    const extraHeaders = headers.filter(header => !expectedHeaders.includes(header));
    
    // Obtener una muestra de datos
    const rows = await sheet.getRows({ limit: 3 });
    const sampleData = rows.map(row => ({
      email: row.EMAIL,
      nombres: row['NOMBRE(S)'],
      apellido_paterno: row.APELLIDO_PATERNO,
      apellido_materno: row.APELLIDO_MATERNO,
      relacion: row.RELACION,
      celular: row.CELULAR,
      formatted_name: formatUserName(
        row['NOMBRE(S)'] || '',
        row.APELLIDO_PATERNO || '',
        row.APELLIDO_MATERNO || ''
      )
    }));
    
    console.log('≡ƒôè Datos de muestra:', sampleData);
    
    res.json({
      success: true,
      message: 'Γ£à Google Sheets API configurado correctamente',
      document: {
        title: doc.title,
        sheetName: sheet.title,
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount
      },
      headers: {
        found: headers,
        missing: missingHeaders,
        extra: extraHeaders,
        isValid: missingHeaders.length === 0
      },
      sampleData: sampleData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Γ¥î Error verificando Google Sheets API:', error);
    
    res.status(500).json({
      error: 'Error al verificar Google Sheets API',
      message: error.message,
      code: error.code,
      suggestions: [
        'Verificar que las credenciales est├⌐n correctamente configuradas',
        'Verificar que la cuenta de servicio tenga acceso a la planilla',
        'Verificar que el ID de la planilla sea correcto',
        'Instalar dependencia: npm install google-spreadsheet'
      ]
    });
  }
});

// ============================================================================
// NUEVA FUNCI├ôN: SINCRONIZAR USUARIOS DESDE GOOGLE SHEETS
// ============================================================================
exports.syncUsersFromSheets = onRequest({
  cors: true,
}, async (req, res) => {
  try {
    console.log('≡ƒöä === SINCRONIZANDO USUARIOS DESDE GOOGLE SHEETS ===');
    
    const SHEET_ID = '1A-8RvvgkHXUP-985So8CBJvDAj50w58EFML1CJEq2c4';
    const SHEET_NAME = 'Maestro';
    
    // Verificar credenciales
    const serviceAccountEmail = "sheets-api-service@cgpreservas.iam.gserviceaccount.com";
    const privateKey = `-----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDjOl2rzfM4gPIT
    LgW34/wl1TY/elF6ic6JP53hxHWJZeyjd3q5eFl9fWvdDaujo641ymq0LDeW7rFS
    QnDhM+EmEmQEz/r6YFmzRhzneIZXSJDjGdSPdV3LkIuhn6Fz/2eiL+k9qMAx5Tea
    fPlLikd4UHhw4yEMpnmkt/MBxxW77taoCTTR/Es6e+j0/qpMmdY/G/E0jgjIITwR
    TIRgzyPgGmax+JZleXqQXZYDPlThozXqMZiVr6+4OPkZod2EUwCki+L2vdh+0KqW
    xZejkjZ8Yc89YWzAr2QXGh2V2wy8h4DLk+z7hBw0hhmc6qpfRPw8I51S553E8Q1V
    3K0EKQc7AgMBAAECggEAFhLg76QxqP8JxSg24P7SS2CThQYebS9+82FNNpXtrxvK
    KbUdJHBXDTRGarJ9xodLkKkpxXf4LH7ilfGjYpU2HYsy0S7dHD6I6Dv66deRAWCo
    xo8HUapeorxXfCt0NT8N87kAyP8gMJiqVqUmWJrFx5/Vm23NE5wGfCRshHMxHtDt
    f0CNZwXvgRQdIGgIBGk9sVspSWKWLqSjCK+aknaBlOieNq3VwhdytBYdr0HukLl2
    kV4FGGtOu2QbLTEfI1gZk1L48wOrSquHPt++OnOGe7AHCgykoj4IIvt9UMi+yp9q
    v+2nsBr8P5ZR0PS8oLIXn6JQwjUD7sDc/JTI2TeA9QKBgQD6tV5P4R75he3wxjxX
    5muean28Y6VwkJzvh3rd3ABj/8NC8AV7N0/Gf1j9f3EkK+Gf29cGbn6CkR9YyXya
    kDu8ZbNZHyXyI3V+bOnnQC+71D11TcKKdoLtYN2oicxMEHPxw9kXSG+XoOc4DCX0
    bpiVYEHq5VYesrzeHcJmNb0VhwKBgQDoBiCf1gz3rGg+aNEP5LFChcqNf5aFtfdG
    ElP2VXoLWtVlSeteQR0lVoduBHhp4gwBBdNdW/O/sRvlOMqYAADz9+R9dTay5NfO
    61n3RX+Dg8BHRnfKwEkJwtEkwYFE3pKHRppMwJV6j7KHHv2gEX8Xg7j8+jGHSIlS
    Cy038tFtrQKBgBuW0eYgc/QplOGmLwXNSZKJTYTpwk782whQ9GhtyW03vBklqLTC
    hXjmkrhyydSdL5sT6jm+9xUPO0/d/GRV8vzshCwOjXJ0DH35JlRYb+hPluPNxtbN
    6+KLglkFsQG93cSBNOanBgC9qDQ2wgaAFTJ7AUYELtH6AWbAB6CP0VsJAoGACbqY
    C5uyF4CHLna+rWftdtidUamT6i9jGvERzDZxU6CPahvbXqxkSHiEXTyav/XWgwR3
    hGaipdsLTGVBOXZmk9RFJG2RyZaG5gpAT3n+iskves2doEbHyTz+AAiNHxImGr3/
    IlDA886qsbe+8sNJDPdc/l6PTRjhiSsmzj3EQlECgYEA5cN5s0gG1lMi3g6BYgJI
    ygMUk3gc51IdnybXyunvNOMwBSf82fQE3OVLuQBDXISOkQUHBnjnrQYt5Vf1JZGU
    15SNAe15MPdYJujryWGEqw3Q6qHc1XGJJAfxMMz8YbO06czV6TZK9GOdREzWnvnM
    XZTXYEu54CkpfjQSs3dMAgY=
    -----END PRIVATE KEY-----`;
    
    if (!serviceAccountEmail || !privateKey) {
      return res.status(500).json({
        error: 'Credenciales de Google Sheets API no configuradas'
      });
    }
    
    // Conectar a Google Sheets
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: serviceAccountEmail,
      private_key: privateKey.replace(/\n    /g, '\n'),
    });
    
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET_NAME];
    
    if (!sheet) {
      return res.status(404).json({
        error: `Hoja '${SHEET_NAME}' no encontrada`
      });
    }
    
    // Leer todas las filas
    const rows = await sheet.getRows();
    const rowsToProcess = rows.slice(0, 50); // Procesar solo 50 por vez
    console.log(`≡ƒôè Procesando ${rowsToProcess.length} de ${rows.length} usuarios`);
    console.log(`≡ƒôè Procesando ${rows.length} usuarios desde Google Sheets`);
    
    const db = admin.firestore();
    const usersRef = db.collection('users');
    
    // Estad├¡sticas de sincronizaci├│n
    const stats = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: 0,
      filtered: 0 // emails inv├ílidos o vac├¡os
    };
    
    // Procesar cada fila
    for (const row of rowsToProcess) {
      try {
        stats.processed++;
        
        const email = (row.EMAIL || '').trim().toLowerCase();
        const nombres = (row['NOMBRE(S)'] || '').trim();
        const apellidoPaterno = (row.APELLIDO_PATERNO || '').trim();
        const apellidoMaterno = (row.APELLIDO_MATERNO || '').trim();
        const rutPasaporte = (row['RUT/PASAPORTE'] || '').trim();
        const fechaNacimiento = (row['FECHA NACIMIENTO'] || '').trim();
        const relacion = (row.RELACION || '').trim();
        const celular = (row.CELULAR || '').trim();
        
        // Validar email
        if (!email || !email.includes('@')) {
          console.log(`ΓÜá∩╕Å Email inv├ílido o vac├¡o para: ${nombres} ${apellidoPaterno}`);
          stats.filtered++;
          continue;
        }
        
        // Formatear nombre seg├║n l├│gica requerida
        const formattedName = formatUserName(nombres, apellidoPaterno, apellidoMaterno);
        
        // Preparar documento del usuario
        const userData = {
          email: email,
          nombres: nombres,
          apellidoPaterno: apellidoPaterno,
          apellidoMaterno: apellidoMaterno,
          displayName: formattedName,
          rutPasaporte: rutPasaporte,
          fechaNacimiento: fechaNacimiento,
          relacion: relacion,
          celular: celular,
          isActive: true,
          lastSyncFromSheets: admin.firestore.FieldValue.serverTimestamp(),
          source: 'google_sheets'
        };
        
        // Verificar si el usuario ya existe
        const userDoc = await usersRef.doc(email).get();
        
        if (userDoc.exists) {
          // Actualizar usuario existente
          await usersRef.doc(email).update(userData);
          stats.updated++;
          console.log(`≡ƒöä Usuario actualizado: ${formattedName} (${email})`);
        } else {
          // Crear nuevo usuario
          await usersRef.doc(email).set({
            ...userData,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          stats.created++;
          console.log(`Γ£à Usuario creado: ${formattedName} (${email})`);
        }
        
      } catch (error) {
        stats.errors++;
        console.error(`Γ¥î Error procesando usuario: ${error.message}`);
      }
    }
    
    // Marcar timestamp de ├║ltima sincronizaci├│n
    await db.collection('system').doc('sync_status').set({
      lastSync: admin.firestore.FieldValue.serverTimestamp(),
      stats: stats,
      source: 'google_sheets',
      sheetId: SHEET_ID,
      sheetName: SHEET_NAME
    }, { merge: true });
    
    console.log('≡ƒôè === RESUMEN DE SINCRONIZACI├ôN ===');
    console.log(`≡ƒôï Procesados: ${stats.processed}`);
    console.log(`Γ£à Creados: ${stats.created}`);
    console.log(`≡ƒöä Actualizados: ${stats.updated}`);
    console.log(`ΓÜá∩╕Å Filtrados: ${stats.filtered}`);
    console.log(`Γ¥î Errores: ${stats.errors}`);
    
    res.json({
      success: true,
      message: 'Sincronizaci├│n completada exitosamente',
      stats: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Γ¥î Error en sincronizaci├│n:', error);
    res.status(500).json({
      error: 'Error sincronizando usuarios',
      message: error.message
    });
  }
});

// ============================================================================
// NUEVA FUNCI├ôN: OBTENER USUARIOS PARA EL FRONTEND
// ============================================================================
exports.getUsers = onRequest({
  cors: true,
}, async (req, res) => {
  try {
    console.log('≡ƒæÑ Obteniendo usuarios desde Firebase...');
    
    const db = admin.firestore();
    const usersSnapshot = await db.collection('users')
      .where('isActive', '==', true)
      .orderBy('displayName')
      .get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        email: doc.id,
        name: userData.displayName,
        phone: userData.celular || '',
        relacion: userData.relacion || '',
        // Solo incluir campos necesarios para el frontend
      });
    });
    
    console.log(`≡ƒæÑ Enviando ${users.length} usuarios al frontend`);
    
    res.json({
      success: true,
      users: users,
      count: users.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Γ¥î Error obteniendo usuarios:', error);
    res.status(500).json({
      error: 'Error obteniendo usuarios',
      message: error.message
    });
  }
});

// ============================================================================
// ENV├ìO DE EMAILS DE CONFIRMACI├ôN
// ============================================================================
exports.sendBookingEmailHTTP = onRequest({
  cors: true,
}, async (req, res) => {
  // Manejar preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'M├⌐todo no permitido' 
    });
  }

  try {
    console.log('≡ƒôº === ENVIANDO EMAILS CON GMAIL APP PASSWORD ===');
    console.log('≡ƒôº Body:', JSON.stringify(req.body, null, 2));

    // Manejar request de test
    if (req.body.test === true) {
      console.log('≡ƒº¬ REQUEST DE TEST RECIBIDO');
      return res.status(200).json({ 
        success: true, 
        message: 'Endpoint Gmail funcionando correctamente',
        timestamp: new Date().toISOString()
      });
    }

    // Validar datos de reserva
    const { booking } = req.body;
    if (!booking || !booking.players || booking.players.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Datos de reserva requeridos' 
      });
    }

    console.log(`≡ƒôº Procesando reserva: ${booking.courtNumber} ${booking.date} ${booking.timeSlot}`);
    console.log(`≡ƒôº Jugadores: ${booking.players.length}`);

    // Crear transporter
    const transporter = createTransporter();

    // Preparar emails para todos los jugadores
    const emailPromises = booking.players
      .filter(player => player.email && player.email !== 'sin-email@cgp.cl')
      .map(async (player, index) => {
        try {
          console.log(`≡ƒôº Enviando email ${index + 1}/${booking.players.length} a: ${player.name} (${player.email})`);

          // Generar ID ├║nico para la reserva
          const bookingId = `${booking.courtNumber}-${booking.date}-${booking.timeSlot}`.replace(/[^a-zA-Z0-9-]/g, '');
          console.log(`≡ƒôº ID generado para ${player.name}: ${bookingId}`);

          const emailHtml = generateBookingEmailHtml({
            playerName: player.name,
            playerEmail: player.email,
            isOrganizer: index === 0,
            booking: {
              ...booking,
              id: bookingId
            }
          });

          // Generar archivo .ics para calendario (comentado para evitar duplicaci├│n)
          // const icsContent = generateICSContent(booking);

          const mailOptions = {
            from: `"Club de Golf Papudo" <paddlepapudo@gmail.com>`,
            to: player.email,
            subject: `Reserva de P├ídel Confirmada - ${formatDate(booking.date)}`,
            html: emailHtml,
            // attachments: [
            //   {
            //     filename: 'reserva-padel.ics',
            //     content: icsContent,
            //     contentType: 'text/calendar'
            //   }
            // ]
          };

          const result = await transporter.sendMail(mailOptions);
          console.log(`Γ£à Email enviado a ${player.name}: ${result.messageId}`);
          
          return { 
            success: true, 
            player: player.name, 
            email: player.email,
            messageId: result.messageId 
          };

        } catch (error) {
          console.error(`Γ¥î Error enviando email a ${player.name}:`, error);
          return { 
            success: false, 
            player: player.name, 
            email: player.email, 
            error: error.message 
          };
        }
      });

    // Ejecutar todos los env├¡os
    const results = await Promise.all(emailPromises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`≡ƒôº === RESUMEN ===`);
    console.log(`Γ£à Exitosos: ${successful.length}/${results.length}`);
    console.log(`Γ¥î Fallidos: ${failed.length}/${results.length}`);

    if (successful.length > 0) {
      return res.status(200).json({
        success: true,
        message: `${successful.length} emails enviados exitosamente`,
        results: results
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'No se pudo enviar ning├║n email',
        results: results
      });
    }

  } catch (error) {
    console.error('Γ¥î Error general:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// CANCELACI├ôN DE RESERVAS
// ============================================================================
exports.cancelBooking = onRequest({
  cors: true,
}, async (req, res) => {
  if (req.method === "OPTIONS") {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).send('');
  }

  try {
    console.log('≡ƒùæ∩╕Å === CANCELACI├ôN DE RESERVA ===');
    console.log('≡ƒùæ∩╕Å Method:', req.method);
    console.log('≡ƒùæ∩╕Å Query:', req.query);

    const bookingId = req.query.id || req.body.bookingId;
    const playerEmail = req.query.email || req.body.playerEmail;
    
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'ID de reserva requerido'
      });
    }

    if (!playerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email del jugador requerido'
      });
    }

    console.log(`≡ƒùæ∩╕Å Cancelando jugador ${decodeURIComponent(playerEmail)} de reserva: ${bookingId}`);

    // Primero, vamos a ver qu├⌐ hay en la base de datos
    const db = admin.firestore();
    const bookingsRef = db.collection('bookings');
    
    console.log('≡ƒöì === DEBUGGING FIRESTORE ===');
    
    // Listar todas las reservas para debugging
    const allBookings = await bookingsRef.limit(10).get();
    console.log(`≡ƒôï Total reservas en DB: ${allBookings.size}`);
    
    allBookings.forEach(doc => {
      const data = doc.data();
      console.log(`≡ƒôï Reserva encontrada:`, {
        docId: doc.id,
        id: data.id,
        courtNumber: data.courtNumber,
        date: data.date,
        timeSlot: data.timeSlot,
        status: data.status
      });
    });

    // Buscar la reserva por el ID generado
    console.log(`≡ƒöì Buscando por ID: ${bookingId}`);
    const snapshot = await bookingsRef.where('id', '==', bookingId).get();
    console.log(`≡ƒöì B├║squeda por ID resultado: ${snapshot.size} documentos`);
    
    if (snapshot.empty) {
      // Decodificar el ID para buscar por campos individuales
      const idParts = bookingId.split('-');
      console.log(`≡ƒöì ID parts:`, idParts);
      
      if (idParts.length >= 5) {
        // ID formato: court1-2025-06-05-1200
        // Convertir a formato Firebase: court_1, 2025-06-05, 12:00
        const courtNumber = idParts[0].replace('court', 'court_'); // court1 ΓåÆ court_1
        const date = `${idParts[1]}-${idParts[2]}-${idParts[3]}`; // 2025-06-05
        const timeRaw = idParts[4]; // 1200
        const timeSlot = `${timeRaw.substring(0,2)}:${timeRaw.substring(2,4)}`; // 12:00
        
        console.log(`≡ƒöì Buscando por: court=${courtNumber}, date=${date}, time=${timeSlot}`);
        
        const alternativeSnapshot = await bookingsRef
          .where('courtNumber', '==', courtNumber)
          .where('date', '==', date)
          .where('timeSlot', '==', timeSlot)
          .get();
          
        console.log(`≡ƒöì B├║squeda alternativa resultado: ${alternativeSnapshot.size} documentos`);
          
        if (!alternativeSnapshot.empty) {
          // Encontramos la reserva, ahora remover solo al jugador
          console.log('≡ƒöì Reserva encontrada, removiendo jugador...');
          
          const doc = alternativeSnapshot.docs[0]; // Tomar el primer documento
          const bookingData = doc.data();
          const currentPlayers = bookingData.players || [];
          
          console.log('≡ƒæÑ Jugadores actuales:', currentPlayers.map(p => p.email));
          
          // Filtrar el jugador que cancela
          const decodedPlayerEmail = decodeURIComponent(playerEmail);
          const updatedPlayers = currentPlayers.filter(player => 
            player.email !== decodedPlayerEmail
          );
          
          console.log('≡ƒæÑ Jugadores despu├⌐s de cancelaci├│n:', updatedPlayers.map(p => p.email));
          
          if (updatedPlayers.length === 0) {
            // Si no quedan jugadores, eliminar toda la reserva
            console.log('≡ƒùæ∩╕Å No quedan jugadores, eliminando reserva completa...');
            await doc.ref.delete();
            console.log('Γ£à Reserva eliminada completamente (sin jugadores)');
          } else {
            // Actualizar la reserva con los jugadores restantes
            console.log('≡ƒöä Actualizando reserva con jugadores restantes...');
            await doc.ref.update({
              players: updatedPlayers,
              lastModified: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Γ£à Jugador removido. Quedan ${updatedPlayers.length} jugadores`);
          }
        } else {
          console.log('Γ¥î No se encontr├│ la reserva para cancelar en b├║squeda alternativa');
        }
      } else {
        console.log('Γ¥î Formato de ID inv├ílido para b├║squeda alternativa');
      }
    } else {
      // Encontramos la reserva por ID directo, remover solo al jugador
      console.log('≡ƒöì Reserva encontrada por ID directo, removiendo jugador...');
      
      const doc = snapshot.docs[0]; // Tomar el primer documento
      const bookingData = doc.data();
      const currentPlayers = bookingData.players || [];
      
      console.log('≡ƒæÑ Jugadores actuales:', currentPlayers.map(p => p.email));
      
      // Filtrar el jugador que cancela
      const decodedPlayerEmail = decodeURIComponent(playerEmail);
      const updatedPlayers = currentPlayers.filter(player => 
        player.email !== decodedPlayerEmail
      );
      
      console.log('≡ƒæÑ Jugadores despu├⌐s de cancelaci├│n:', updatedPlayers.map(p => p.email));
      
      if (updatedPlayers.length === 0) {
        // Si no quedan jugadores, eliminar toda la reserva
        console.log('≡ƒùæ∩╕Å No quedan jugadores, eliminando reserva completa...');
        await doc.ref.delete();
        console.log('Γ£à Reserva eliminada completamente (sin jugadores)');
      } else {
        // Actualizar la reserva con los jugadores restantes
        console.log('≡ƒöä Actualizando reserva con jugadores restantes...');
        await doc.ref.update({
          players: updatedPlayers,
          lastModified: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Γ£à Jugador removido. Quedan ${updatedPlayers.length} jugadores`);
      }
    }

    // Mostrar p├ígina de confirmaci├│n para GET requests
    if (req.method === 'GET') {
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cancelar Reserva - Club de Golf Papudo</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                    background: #f5f5f5; margin: 0; padding: 20px; 
                }
                .container { 
                    max-width: 500px; margin: 50px auto; background: white; 
                    border-radius: 12px; padding: 40px; text-align: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .header { color: #1e3a8a; margin-bottom: 30px; }
                .success { color: #10b981; font-size: 48px; margin-bottom: 20px; }
                .message { font-size: 18px; color: #374151; margin-bottom: 30px; line-height: 1.6; }
                .booking-id { 
                    background: #f3f4f6; padding: 12px; border-radius: 6px; 
                    font-family: monospace; color: #6b7280; margin: 20px 0; 
                }
                .button { 
                    background: #1e3a8a; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;
                    margin: 10px; font-weight: 600;
                }
                .button:hover { background: #1e40af; }
                .note { 
                    background: #fef3cd; padding: 16px; border-radius: 6px; 
                    color: #92400e; font-size: 14px; margin-top: 20px; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Club de Golf Papudo</h1>
                    <p>Sistema de Reservas de P├ídel</p>
                </div>
                
                <div class="success">Γ£à</div>
                
                <div class="message">
                    <strong>Cancelaci├│n Individual Exitosa</strong><br><br>
                    Has sido removido de esta reserva de p├ídel. 
                    Los otros jugadores han sido notificados autom├íticamente.
                </div>
                
                <div class="booking-id">
                    Reserva: ${bookingId}<br>
                    Jugador: ${decodeURIComponent(playerEmail)}
                </div>
                
                <a href="https://cgpreservas.web.app" class="button">
                    ≡ƒÅô Hacer Nueva Reserva
                </a>
                
                <a href="mailto:paddlepapudo@gmail.com" class="button">
                    ≡ƒôº Contactar al Club
                </a>
                
                <div class="note">
                    <strong>≡ƒÆí Nota:</strong> Puedes hacer una nueva reserva 
                    en cualquier momento desde la aplicaci├│n web del club.
                </div>
            </div>
        </body>
        </html>
      `;
      
      res.set('Content-Type', 'text/html');
      return res.status(200).send(html);
    }

    // Para POST requests, responder JSON
    return res.status(200).json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      bookingId: bookingId
    });

  } catch (error) {
    console.error('Γ¥î Error cancelando:', error);
    
    // A├║n mostrar p├ígina de ├⌐xito aunque haya error interno
    if (req.method === 'GET') {
      const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Error - Club de Golf Papudo</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>ΓÜá∩╕Å Error al Cancelar</h1>
          <p>Hubo un problema al cancelar la reserva.</p>
          <p>Por favor contacta al club directamente.</p>
          <a href="mailto:paddlepapudo@gmail.com">≡ƒôº Contactar Club</a>
        </body>
        </html>
      `;
      res.set('Content-Type', 'text/html');
      return res.status(500).send(html);
    }
    
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// Funci├│n utilitaria para formatear nombres seg├║n la l├│gica requerida
function formatUserName(nombres, apellidoPaterno, apellidoMaterno) {
  try {
    // PRIMER NOMBRE (espacio) INICIAL SEGUNDO NOMBRE (ESPACIO) PRIMER APELLIDO (espacio) INICIAL SEGUNDO APELLIDO
    
    const nombresArray = nombres.trim().split(' ').filter(n => n.length > 0);
    const primerNombre = nombresArray[0] || '';
    const segundoNombre = nombresArray[1] || '';
    
    const primerApellido = apellidoPaterno.trim();
    const segundoApellido = apellidoMaterno.trim();
    
    let formattedName = primerNombre;
    
    if (segundoNombre) {
      formattedName += ` ${segundoNombre.charAt(0)}.`;
    }
    
    if (primerApellido) {
      formattedName += ` ${primerApellido}`;
    }
    
    if (segundoApellido) {
      formattedName += ` ${segundoApellido.charAt(0)}.`;
    }
    
    return formattedName.trim();
  } catch (error) {
    console.error('Error formateando nombre:', error);
    return `${nombres} ${apellidoPaterno}`.trim();
  }
}

function generateBookingEmailHtml({playerName, playerEmail, isOrganizer, booking}) {
  const courtName = getCourtName(booking.courtNumber);
  const playersHtml = booking.players.map((player, index) => {
    const isOrganizerBadge = (index === 0) ?
      "<div class=\"organizer-badge\">Organizador</div>" : "";

    return `
      <div class="player-card">
        <div class="player-name">${player.name}</div>
        ${isOrganizerBadge}
      </div>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reserva Confirmada - P├ídel Papudo</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; 
                background-color: #f5f5f5; 
            }
            .container { 
                max-width: 600px; margin: 20px auto; background: white; 
                border-radius: 12px; overflow: hidden; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #1e3a8a, #1e40af); 
                color: white; padding: 40px 20px; text-align: center; 
                position: relative;
            }
            .header-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .logo-circle { 
                width: 80px; height: 80px; 
                background: white; border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                flex-shrink: 0;
                font-weight: bold;
                color: #1e3a8a;
                font-size: 18px;
                text-align: center;
                line-height: 1.2;
            }
            .title-section {
                flex: 1;
                min-width: 200px;
            }
            .title-section h1 {
                margin: 0; 
                font-size: 28px; 
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .padel-icon {
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                flex-shrink: 0;
            }
            .subtitle {
                margin: 10px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .content { padding: 30px; }
            .booking-card { 
                background: #f8fafc; border-radius: 8px; padding: 24px; 
                margin: 20px 0; border-left: 4px solid #1e3a8a; 
            }
            .detail-row { 
                display: flex; justify-content: space-between; 
                padding: 8px 0; border-bottom: 1px solid #e2e8f0; 
            }
            .detail-label { font-weight: 600; color: #475569; }
            .detail-value { color: #1e293b; font-weight: 500; }
            .players-grid { 
                display: grid; grid-template-columns: repeat(2, 1fr); 
                gap: 12px; margin-top: 12px; 
            }
            .player-card { 
                background: white; padding: 12px; border-radius: 6px; 
                border: 1px solid #e2e8f0; text-align: center; 
            }
            .player-name { font-weight: 600; color: #1e293b; font-size: 14px; }
            .organizer-badge { 
                background: #1e3a8a; color: white; padding: 2px 8px; 
                border-radius: 12px; font-size: 11px; margin-top: 4px; 
                display: inline-block; 
            }
            .actions { margin: 30px 0; text-align: center; }
            .button { 
                display: inline-block; padding: 12px 24px; margin: 0 8px; 
                border-radius: 6px; text-decoration: none; font-weight: 600; 
                font-size: 14px; 
            }
            .button-primary { background: #10b981; color: white; }
            .button-secondary { background: #ef4444; color: white; }
            
            /* Responsive adjustments */
            @media (max-width: 600px) { 
                .header-content { 
                    flex-direction: column; 
                    gap: 20px; 
                }
                .players-grid { 
                    grid-template-columns: 1fr; 
                } 
                .button { 
                    display: block; 
                    margin: 8px 0; 
                } 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-content">
                    <!-- Logo Textual del Club -->
                    <div class="logo-circle">
                        CLUB<br>GOLF<br>PAPUDO<br><small>1932</small>
                    </div>
                    
                    <!-- T├¡tulo con icono de p├ídel -->
                    <div class="title-section">
                        <h1>
                            <div class="padel-icon" style="font-family: Arial, sans-serif; font-weight: bold; font-size: 20px;">P</div>
                            Reserva Confirmada
                        </h1>
                        <p class="subtitle">Club de Golf Papudo - P├ídel ΓÇó Desde 1932</p>
                    </div>
                </div>
            </div>
            
            <div class="content">
                <h2>┬íHola ${playerName}!</h2>
                <p>Tu reserva de p├ídel ha sido confirmada exitosamente. 
                Te esperamos en la cancha.</p>

                <div class="booking-card">
                    <div class="detail-row">
                        <span class="detail-label">≡ƒôà Fecha:&nbsp;</span>
                        <span class="detail-value">${formatDate(booking.date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">ΓÅ░ Hora&nbsp;</span>
                        <span class="detail-value">${booking.timeSlot} - ${getEndTime(booking.timeSlot)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">≡ƒÄ╛ Cancha&nbsp;</span>
                        <span class="detail-value">${courtName}</span>
                    </div>
                </div>

                <div>
                    <h3>≡ƒæÑ Jugadores Confirmados (${booking.players.length}/4)</h3>
                    <div class="players-grid">
                        ${playersHtml}
                    </div>
                </div>

                <div class="actions">
                    <a href="https://us-central1-cgpreservas.cloudfunctions.net/cancelBooking?id=${booking.id}&email=${encodeURIComponent(playerEmail)}" 
                    class="button button-secondary">Γ¥î Cancelar Reserva</a>
                </div>

                <div style="background: #fef3cd; padding: 16px; border-radius: 6px; margin: 20px 0;">
                    <strong>≡ƒÆí Importante:</strong> Si no has reservado, no est├ís al tanto de esta invitaci├│n, o no puedes asistir, <strong>cancela</strong> esta reserva. Para cancelar, haz clic en el bot├│n de arriba. Se notificar├í autom├íticamente a los otros jugadores.
                </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px;">
                <p>
                    <strong>Club de Golf Papudo</strong> ΓÇó Desde 1932<br>
                    ≡ƒôº <a href="mailto:paddlepapudo@gmail.com" style="color: #1e3a8a;">paddlepapudo@gmail.com</a><br>
                    ≡ƒôì Miraflores s/n - Papudo, Valpara├¡so<br>
                    ≡ƒîÉ <a href="https://clubgolfpapudo.cl" style="color: #1e3a8a;">clubgolfpapudo.cl</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateICSContent(booking) {
  const startDateTime = new Date(`${booking.date}T${booking.timeSlot}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 90 * 60000); // +90 minutos
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const courtName = getCourtName(booking.courtNumber);
  const playersNames = booking.players.map(p => p.name).join(', ');
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Club de Golf Papudo//Padel//ES
BEGIN:VEVENT
UID:booking-${booking.id}@cgpreservas.web.app
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:P├ídel - ${courtName}
DESCRIPTION:Reserva de p├ídel en ${courtName}\\nJugadores: ${playersNames}
LOCATION:Club de Golf Papudo\\nCamino Papudo - Zapallar\\nPapudo\\, Valpara├¡so
ORGANIZER:MAILTO:paddlepapudo@gmail.com
END:VEVENT
END:VCALENDAR`;
}

function getCourtName(courtNumber) {
  const courts = {
    "court_1": "Cancha 1 - PITE",
    "court_2": "Cancha 2 - LILEN", 
    "court_3": "Cancha 3 - PLAIYA",
  };
  return courts[courtNumber] || courtNumber;
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric", 
    month: "long",
    day: "numeric",
  });

  // Fix: Agregar espacio despu├⌐s de "Fecha" en el template
  return " " + formatted;
}

function getEndTime(startTime) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes);
  endDate.setTime(endDate.getTime() + 90 * 60000);
  return endDate.toTimeString().slice(0, 5);
}
