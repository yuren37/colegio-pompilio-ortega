// app/api/matriculas/route.ts - REEMPLAZAR COMPLETAMENTE
import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Rate limiting storage
const rateLimit = new Map();

const SERVICE_ACCOUNT_EMAIL = 'sheets-integration@instituto-pompilio-ortega.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdd0x6Eb+lETaT
SqZvaWbPz2j72tvr49VzS3TUXuqvwOitXSgXEX3y9KS+YeXiIJbjP+NKKuQU0QvR
229nUHjWG3S+Aspu91F+q7a5VBAV4ne91SLJABHecObpY0fwUU8ftB1kRJMMTlWA
DhMRgt+Y/nR2Yf5A9WQ9mKSjkTvGReJbMKQ+jdSwTd58sPJkFxCLwD/Jye/+FnX0
AXpE370+Q39t/h9OXUv+vz1yiNw98336CMpZ/HsLF93Wg7V+J93TOoa4aWvuxFpZ
GsVpdTTzLw2qf3jSJRk7A0mD/6ud8jFRAGeCUX/cKarMNNUc6ZBhDvPO/rfiVmYw
aeatiRXVAgMBAAECggEABVy7aDnEALNEHEJxxf/9Hg0GWnNCw3br/SPf6956l/cW
BVdThuuT0ir2FDyhtzBcawsxKoSo5TOUNzaFhetl3gar1E+khKBb8FgZHhkIfjJK
2RZRu64KrbxDBMYafErMirwXtyMlrcjaHQT9rb467osVvLVMEvq4SeexjZdjxXXs
kmTmgQIYMJe/WV+xUazAG75xFvBp7XXThCOmdubi6WpLDs66bbJKBc6u65mwm3cB
YD6Yllb24TBUtBuIOef1Xm/7II9hx56ebYR2q4Q2Ei9ZWveKPERm8WJMVm607KdJ
aV1NYTgI8cvuf6Jf8kW+IqZhPxSaDPg3IIpA1EAj+QKBgQDV+r5alNXv8Hl2UseY
cBhbr8Xhl7PXiWpHjPiXtDjrPWxHnIgdrE83JlM7M8BRyINPBKFkNTb8+n3O0YmI
45ejKsNKxWKyqAr4avvQRbV3K7rBmYOZ3JK+8Kh7FeRKfxufdfUTvowwBknShy1P
XlTsM7K7DwYi5voI9UXhxOZeeQKBgQC8Y31IYgsIxmASHmDpnJRPkpZykeyzf5HF
vDcSZHLg/talyHsczIAw4Wci4Dj1sXJENVQIWS/qnltiC+sx+TSEXrnB7HyiKZI7
oXNyhJrhm9EmFyH8+kJKfDmhWh0sfEW+QlB/NUFvoQIUe9/aUynUc/YdVtRnuKf5
doQS2GhrPQKBgENt3IZW2IPf16a9t0AGMubRoR3R3E5TczZQ6hWEKVuX44M9hHc1
UVEjtp61VClxck94OhOF4Woe1X5S8XA9qA827oulX9DEu5BExk1/agu/r/5KDfpy
U5vv4mfHIkWHgIDjfvNV3H9Vu/Wnu1ODemdkczIXLevZtXkVMYxPq/ihAoGAOFXQ
Cys2fYNFC2YGORXXzAvb7Zrxm6PUZbspBNkA+YN7kMvo9O36j+N3whgnMGHF99uy
q2RwTcrZLPK/fIw3RjZFelZL1vpzfl2DdoVtA3ZjDu7v/QShekC3wyZ9fuYSvRh7
le7JCKavRozcnh8sbRnYSWHD1tiDcrgcOr54S0kCgYEAxlP5HP+2Ydwq17HY7K5X
0P+eV21LtXil2zCLZ+o+4NTTutwgS9w1XYc+WcImpBgzguA8BptmvNcQCE9g+lje
eB9WsaVvKQzAR3uLep0GdvhH1S/U5Q2jrVcJmzyPA+SLnO39rkHqkLZanRKzhvYi
/Zbh3KevBBbqGW/cY7jbrL4=
-----END PRIVATE KEY-----`;
const SHEET_ID = '1rSJ37U64uFjBHh0kXO14Owqnw1Cr1mhDKshDOaFJQ7I';

// Función para verificar duplicados
async function verificarDuplicado(sheet: any, data: any): Promise<boolean> {
  try {
    const rows = await sheet.getRows();
    
    // Verificar por teléfono (mismo encargado)
    const duplicadoTelefono = rows.some((row: any) => 
      row.get('Teléfono') === data.telefono && 
      row.get('Nombre del estudiante') === data.nombreEstudiante
    );

    // Verificar por email si existe
    if (data.email && data.email !== 'No proporcionado') {
      const duplicadoEmail = rows.some((row: any) => 
        row.get('Email') === data.email && 
        row.get('Nombre del estudiante') === data.nombreEstudiante
      );
      
      if (duplicadoEmail) return true;
    }

    return duplicadoTelefono;
  } catch (error) {
    console.error('Error verificando duplicados:', error);
    return false;
  }
}

// Función para validar edad (mínimo 5 años)
function validarEdad(fechaNacimiento: string): { valida: boolean; error?: string } {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  
  // Calcular edad
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  if (edad < 5) {
    return { valida: false, error: 'El estudiante debe tener al menos 5 años de edad' };
  }
  
  if (edad > 25) {
    return { valida: false, error: 'La edad del estudiante no parece válida' };
  }
  
  if (nacimiento > hoy) {
    return { valida: false, error: 'La fecha de nacimiento no puede ser futura' };
  }
  
  return { valida: true };
}

// app/api/matriculas/route.ts - REEMPLAZAR la función POST completa
export async function POST(request: NextRequest) {
  console.log('🎯 POST /api/matriculas - INICIANDO');
  
  try {
    // Rate Limiting - Obtener IP de los headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    const maxRequests = 5;

    const requests = rateLimit.get(ip) || [];
    const validRequests = requests.filter((time: number) => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      console.log('🚫 Rate limit excedido para IP:', ip);
      return NextResponse.json(
        { success: false, error: 'Demasiadas solicitudes. Por favor intenta en 15 minutos.' },
        { status: 429 }
      );
    }

    validRequests.push(now);
    rateLimit.set(ip, validRequests);

    const data = await request.json();
    console.log('📝 Datos recibidos del formulario:', data);

    // Validar datos requeridos
    const requiredFields = ['nombreEstudiante', 'fechaNacimiento', 'direccion', 'nombreEncargado', 'telefono', 'carrera', 'grado'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Campos faltantes:', missingFields);
      return NextResponse.json(
        { success: false, error: `Campos requeridos faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validaciones de formato
    const soloLetrasRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
    const soloNumerosRegex = /^\+?504\s?\d{4}-?\d{4}$/;
    
    // Validar nombre del estudiante (solo letras)
    if (!soloLetrasRegex.test(data.nombreEstudiante.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'El nombre del estudiante solo puede contener letras' },
        { status: 400 }
      );
    }

    // Validar nombre del encargado (solo letras)
    if (!soloLetrasRegex.test(data.nombreEncargado.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'El nombre del encargado solo puede contener letras' },
        { status: 400 }
      );
    }

    // Validar teléfono (solo números en formato hondureño)
    if (!soloNumerosRegex.test(data.telefono)) {
      return NextResponse.json(
        { success: false, error: 'Formato de teléfono inválido. Use: +504 0000-0000' },
        { status: 400 }
      );
    }

    // Validar email si está presente
    if (data.email && data.email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return NextResponse.json(
          { success: false, error: 'Formato de email inválido' },
          { status: 400 }
        );
      }
    }

    // Validar edad
    const validacionEdad = validarEdad(data.fechaNacimiento);
    if (!validacionEdad.valida) {
      return NextResponse.json(
        { success: false, error: validacionEdad.error },
        { status: 400 }
      );
    }

    console.log('🔐 Configurando autenticación...');
    
    // Autenticación
    const auth = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('📊 Conectando a Google Sheets...');
    
    // Guardar en Google Sheets
    const doc = new GoogleSpreadsheet(SHEET_ID, auth);
    await doc.loadInfo();
    
    console.log('✅ Documento cargado:', doc.title);
    const sheet = doc.sheetsByIndex[0];
    console.log('📑 Usando sheet:', sheet.title);

    // Verificar duplicados
    console.log('🔍 Verificando duplicados...');
    const esDuplicado = await verificarDuplicado(sheet, data);
    if (esDuplicado) {
      console.log('🚫 Solicitud duplicada detectada');
      return NextResponse.json(
        { success: false, error: 'Ya existe una solicitud para este estudiante con el mismo número de teléfono' },
        { status: 409 }
      );
    }

    // Preparar datos para la fila
    const rowData = {
      'Timestamp': new Date().toLocaleString('es-HN'),
      'Nombre del estudiante': data.nombreEstudiante,
      'Fecha Nacimiento': data.fechaNacimiento,
      'Dirección': data.direccion,
      'Nombre Encargado': data.nombreEncargado,
      'Teléfono': data.telefono,
      'Email': data.email || 'No proporcionado',
      'Carrera': data.carrera,
      'Grado': data.grado,
      'Mensaje': data.mensaje || 'Sin mensaje adicional'
    };

    console.log('💾 Agregando fila con datos:', rowData);
    
    // AGREGAR FILA
    await sheet.addRow(rowData);

    console.log('✅ Datos guardados exitosamente en Google Sheets');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('💥 ERROR EN SERVIDOR:');
    console.error('Mensaje:', error.message);
    
    if (error.message.includes('Duplicate header')) {
      return NextResponse.json(
        { success: false, error: 'Error de configuración del sistema. Contacte al administrador.' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: `Error interno del servidor: ${error.message}` },
        { status: 500 }
      );
    }
  }
}