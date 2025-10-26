// lib/posts.ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'nuevo-programa-informatica-2024',
    title: 'Nuevo Programa de Informática 2024',
    excerpt: 'Implementamos nuevas tecnologías y metodologías en nuestro programa de BTP en Informática para preparar a los estudiantes para el futuro digital.',
    content: `
      <h2>Innovación Educativa en el Instituto Pompilio Ortega</h2>
      
      <p>Estamos emocionados de anunciar las mejoras significativas en nuestro programa de BTP en Informática para el año 2024. Estas actualizaciones reflejan nuestro compromiso con la excelencia educativa y la preparación de nuestros estudiantes para los desafíos del mundo digital.</p>
      
      <h3>Nuevas Tecnologías Integradas</h3>
      <ul>
        <li><strong>Desarrollo Web Moderno:</strong> React, Next.js y TypeScript</li>
        <li><strong>Programación Avanzada:</strong> Python y JavaScript ES6+</li>
        <li><strong>Bases de Datos:</strong> MongoDB, MySQL y Firebase</li>
        <li><strong>Cloud Computing:</strong> Fundamentos de AWS y Google Cloud</li>
        <li><strong>Desarrollo Móvil:</strong> React Native</li>
      </ul>

      <h3>Metodologías de Enseñanza Actualizadas</h3>
      <p>Hemos incorporado enfoques pedagógicos modernos que incluyen:</p>
      <ul>
        <li>Aprendizaje basado en proyectos reales</li>
        <li>Colaboración con empresas tecnológicas locales</li>
        <li>Prácticas profesionales supervisadas</li>
        <li>Talleres de emprendimiento tecnológico</li>
      </ul>

      <h3>Beneficios para Nuestros Estudiantes</h3>
      <p>Estas mejoras permitirán a nuestros graduados:</p>
      <ul>
        <li>Acceder a mejores oportunidades laborales</li>
        <li>Continuar estudios universitarios con sólida base técnica</li>
        <li>Desarrollar proyectos tecnológicos innovadores</li>
        <li>Participar en competencias nacionales e internacionales</li>
      </ul>

      <p>Las inscripciones para el nuevo programa ya están abiertas. Contáctanos para más información.</p>
    `,
    author: 'Lic. Carlos Martínez',
    date: '2024-01-15',
    image: '/images/blog/informatica-2024.jpg',
    category: 'Académico',
    readTime: '4 min',
    featured: true
  },
  {
    id: '2',
    slug: 'convenio-universidades-2024',
    title: 'Convenios con Universidades Nacionales',
    excerpt: 'Firmamos acuerdos de articulación con las principales universidades del país para garantizar la continuidad académica de nuestros graduados.',
    content: `
      <h2>Expansión de Oportunidades Académicas</h2>
      
      <p>El Instituto Pompilio Ortega ha establecido convenios de articulación estratégica con prestigiosas universidades nacionales, fortaleciendo el camino educativo de nuestros estudiantes hacia la educación superior.</p>
      
      <h3>Universidades Participantes</h3>
      <div class="university-grid">
        <div class="university-item">
          <h4>Universidad Nacional Autónoma de Honduras (UNAH)</h4>
          <ul>
            <li>Convalidación de hasta 12 materias</li>
            <li>Acceso preferencial a carreras de tecnología</li>
            <li>Becas del 25% para egresados del Instituto</li>
          </ul>
        </div>
        
        <div class="university-item">
          <h4>Universidad Tecnológica Centroamericana (UNITEC)</h4>
          <ul>
            <li>Programas de articulación directa</li>
            <li>Talleres de preparación universitaria</li>
            <li>Descuentos especiales en matrícula</li>
          </ul>
        </div>
        
        <div class="university-item">
          <h4>Universidad Pedagógica Nacional Francisco Morazán (UPNFM)</h4>
          <ul>
            <li>Rutas específicas para carreras educativas</li>
            <li>Pasantías en instituciones educativas</li>
            <li>Programas de formación docente</li>
          </ul>
        </div>
      </div>

      <h3>Ventajas para Nuestros Egresados</h3>
      <ul>
        <li><strong>Ahorro de Tiempo:</strong> Reducción de hasta 1 año en la carrera universitaria</li>
        <li><strong>Ahorro Económico:</strong> Menos materias por cursar significa menor inversión</li>
        <li><strong>Ventaja Académica:</strong> Base técnica sólida para el éxito universitario</li>
        <li><strong>Orientación Profesional:</strong> Asesoramiento continuo en la elección de carrera</li>
      </ul>

      <h3>Proceso de Articulación</h3>
      <ol>
        <li>Asesoramiento vocacional durante el último año</li>
        <li>Preparación de documentos y requisitos</li>
        <li>Gestión de convalidaciones</li>
        <li>Seguimiento durante el primer semestre universitario</li>
      </ol>

      <p>Para más información sobre estos convenios, visita nuestra oficina de orientación estudiantil.</p>
    `,
    author: 'Dra. María González',
    date: '2024-01-10',
    image: '/images/blog/convenio-universidades.jpg',
    category: 'Noticias',
    readTime: '5 min',
    featured: true
  },
  {
    id: '3',
    slug: 'taller-orientacion-vocacional',
    title: 'Taller de Orientación Vocacional Gratuito',
    excerpt: 'Invitamos a todos los estudiantes de secundaria a nuestro taller gratuito de orientación vocacional para descubrir su camino profesional.',
    content: `
      <h2>Descubre Tu Vocación</h2>
      
      <p>El Instituto Pompilio Ortega extiende una cordial invitación a todos los estudiantes de secundaria de la comunidad a participar en nuestro <strong>Taller de Orientación Vocacional Gratuito</strong>. Un espacio diseñado para ayudarte a descubrir tus talentos y definir tu futuro profesional.</p>
      
      <h3>Información del Evento</h3>
      <div class="event-details">
        <p><strong>📅 Fecha:</strong> 25 de Enero, 2024</p>
        <p><strong>⏰ Horario:</strong> 8:00 AM - 12:00 PM</p>
        <p><strong>📍 Lugar:</strong> Auditorio Principal del Instituto Pompilio Ortega</p>
        <p><strong>👥 Dirigido a:</strong> Estudiantes de 9no grado a 2do de Bachillerato</p>
        <p><strong>💰 Costo:</strong> Completamente Gratuito</p>
      </div>

      <h3>Temas que Desarrollaremos</h3>
      <div class="topics-grid">
        <div class="topic-item">
          <h4>🔍 Autoconocimiento</h4>
          <ul>
            <li>Identificación de habilidades y fortalezas</li>
            <li>Test de intereses profesionales</li>
            <li>Análisis de personalidad y vocación</li>
          </ul>
        </div>
        
        <div class="topic-item">
          <h4>🎯 Oportunidades Laborales</h4>
          <ul>
            <li>Campos profesionales con mayor demanda</li>
            <li>Salarios y condiciones laborales</li>
            <li>Tendencias del mercado laboral 2024-2030</li>
          </ul>
        </div>
        
        <div class="topic-item">
          <h4>📊 Test Vocacional</h4>
          <ul>
            <li>Evaluación profesional individual</li>
            <li>Análisis de resultados personalizado</li>
            <li>Recomendaciones de carreras específicas</li>
          </ul>
        </div>
        
        <div class="topic-item">
          <h4>💼 Charlas con Profesionales</h4>
          <ul>
            <li>Ingenieros en Sistemas</li>
            <li>Licenciados en Administración</li>
            <li>Profesionales de la Salud</li>
            <li>Educadores y Pedagogos</li>
          </ul>
        </div>
      </div>

      <h3>Beneficios de Participar</h3>
      <ul>
        <li>📝 Test vocacional gratuito con valor comercial de L. 500</li>
        <li>🎓 Certificado de participación</li>
        <li>📚 Guía de carreras universitarias en Honduras</li>
        <li>🤝 Sesión de preguntas y respuestas con profesionales</li>
        <li>💼 Información sobre becas y financiamiento</li>
      </ul>

      <div class="cta-section">
        <h3>¡Inscríbete Ya!</h3>
        <p>Los cupos son limitados. Reserva tu espacio llamando al <strong>+504 2234-5678</strong> o enviando un WhatsApp al <strong>+504 9876-5432</strong>.</p>
        <p>También puedes registrarte en la oficina de orientación del Instituto.</p>
      </div>
    `,
    author: 'Psic. Ana Rodríguez',
    date: '2024-01-08',
    image: '/images/blog/taller-vocacional.jpg',
    category: 'Eventos',
    readTime: '6 min',
    featured: true
  },
  {
    id: '4',
    slug: 'logros-deportivos-2023',
    title: 'Logros Deportivos Destacados en 2023',
    excerpt: 'Nuestros estudiantes brillan en competencias deportivas a nivel nacional, demostrando excelencia atlética y valores deportivos.',
    content: `
      <h2>Excelencia Deportiva 2023</h2>
      
      <p>El año 2023 marcó un hito en la historia deportiva del Instituto Pompilio Ortega. Nuestros estudiantes-atletas demostraron talento, disciplina y espíritu deportivo en competencias a nivel regional y nacional, obteniendo resultados extraordinarios.</p>
      
      <h3>Fútbol Masculino - Campeones Intercolegial</h3>
      <div class="sport-achievement">
        <h4>🏆 Logros Principales:</h4>
        <ul>
          <li><strong>Campeones Departamentales:</strong> Torneo Intercolegial 2023</li>
          <li><strong>Tercer Lugar Nacional:</strong> Competencia Nacional de Colegios</li>
          <li><strong>Mejor Portero:</strong> Juan Pérez - Reconocimiento individual</li>
          <li><strong>Goleador del Torneo:</strong> Carlos Hernández - 15 goles</li>
        </ul>
        
        <h4>👥 Equipo Destacado:</h4>
        <ul>
          <li><strong>Director Técnico:</strong> Prof. Miguel Torres</li>
          <li><strong>Capitán:</strong> Luis García (12vo Grado)</li>
          <li><strong>Jugadores en Selección:</strong> 3 estudiantes seleccionados para representar el departamento</li>
        </ul>
      </div>

      <h3>Baloncesto Femenino - Subcampeonas Regional</h3>
      <div class="sport-achievement">
        <h4>🏀 Logros del Equipo Femenino:</h4>
        <ul>
          <li><strong>Subcampeonas Regional:</strong> Torneo Regional de Baloncesto</li>
          <li><strong>Mejor Jugadora:</strong> María Fernández - MVP del torneo</li>
          <li><strong>Mejor Defensa:</strong> Ana López - Reconocimiento defensivo</li>
          <li><strong>Invictas en Fase Regular:</strong> 8 partidos, 8 victorias</li>
        </ul>
      </div>

      <h3>Atletismo - Récords Institucionales</h3>
      <div class="sport-achievement">
        <h4>🎽 Destacados en Atletismo:</h4>
        <ul>
          <li><strong>5 Medallas de Oro:</strong> 100m, 200m, 400m, salto largo, relevos 4x100m</li>
          <li><strong>Récord Institucional:</strong> Pedro Martínez - Salto largo (6.85m)</li>
          <li><strong>Clasificación Nacional:</strong> 4 atletas a competencia nacional</li>
          <li><strong>Mejor Atleta Femenina:</strong> Laura González - 3 medallas de oro</li>
        </ul>
      </div>

      <h3>Otros Deportes - Resultados Destacados</h3>
      <ul>
        <li><strong>Voleibol:</strong> Cuarto lugar en torneo regional</li>
        <li><strong>Natación:</strong> 2 medallas de plata en competencia departamental</li>
        <li><strong>Ajedrez:</strong> Campeón departamental - Roberto Sánchez</li>
        <li><strong>Atletismo Adaptado:</strong> 3 medallas de oro en para-atletismo</li>
      </ul>

      <h3>Reconocimientos Especiales</h3>
      <div class="awards">
        <ul>
          <li><strong>Premio al Espíritu Deportivo:</strong> Instituto Pompilio Ortega</li>
          <li><strong>Mejor Director Técnico:</strong> Prof. Miguel Torres - Fútbol</li>
          <li><strong>Deportista del Año:</strong> María Fernández - Baloncesto</li>
          <li><strong>Revelación del Año:</strong> Pedro Martínez - Atletismo</li>
        </ul>
      </div>

      <div class="future-outlook">
        <h3>Perspectivas 2024</h3>
        <p>Para el 2024, estamos:</p>
        <ul>
          <li>Ampliando nuestras instalaciones deportivas</li>
          <li>Implementando nuevos programas de entrenamiento</li>
          <li>Estableciendo alianzas con clubes deportivos profesionales</li>
          <li>Creando becas deportivas para talentos destacados</li>
        </ul>
      </div>

      <p>¡Felicidades a todos nuestros estudiantes-atletas y al cuerpo técnico por estos logros extraordinarios!</p>
    `,
    author: 'Prof. José López',
    date: '2024-01-05',
    image: '/images/blog/logros-deportivos.jpg',
    category: 'Deportes',
    readTime: '7 min'
  },
  {
    id: '5',
    slug: 'tecnologia-educativa-2024',
    title: 'Innovación en Tecnología Educativa',
    excerpt: 'Implementamos nuevas herramientas tecnológicas y plataformas digitales para mejorar la experiencia de aprendizaje de nuestros estudiantes.',
    content: `
      <h2>Revolución Digital en la Educación</h2>
      
      <p>El Instituto Pompilio Ortega da un salto hacia el futuro con la implementación de tecnologías educativas de vanguardia que transformarán la experiencia de aprendizaje de nuestros estudiantes.</p>
      
      <h3>Nuevas Plataformas Digitales</h3>
      <div class="tech-platforms">
        <div class="platform">
          <h4>🎯 Sistema de Gestión de Aprendizaje (LMS)</h4>
          <p>Hemos implementado una plataforma LMS moderna que permite:</p>
          <ul>
            <li>Acceso a materiales las 24/7</li>
            <li>Entrega de tareas en línea</li>
            <li>Comunicación directa con profesores</li>
            <li>Seguimiento de progreso individual</li>
          </ul>
        </div>
        
        <div class="platform">
          <h4>💻 Laboratorios de Computación Actualizados</h4>
          <p>Nuestros laboratorios ahora cuentan con:</p>
          <ul>
            <li>Computadoras de última generación</li>
            <li>Software especializado por carrera</li>
            <li>Acceso a internet de alta velocidad</li>
            <li>Equipos para realidad virtual</li>
          </ul>
        </div>
      </div>

      <h3>Beneficios para los Estudiantes</h3>
      <ul>
        <li><strong>Aprendizaje Personalizado:</strong> Ritmo individual de estudio</li>
        <li><strong>Acceso Remoto:</strong> Continuidad educativa desde cualquier lugar</li>
        <li><strong>Recursos Multimedia:</strong> Videos, simulaciones y contenido interactivo</li>
        <li><strong>Retroalimentación Inmediata:</strong> Evaluaciones y correcciones rápidas</li>
      </ul>
    `,
    author: 'Ing. Roberto Silva',
    date: '2024-01-03',
    image: '/images/blog/tecnologia-educativa.jpg',
    category: 'Tecnología',
    readTime: '4 min'
  }
];