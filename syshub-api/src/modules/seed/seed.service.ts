import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bycrypt from 'bcrypt';

//Entidades
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Rol } from '@app/modules/usuarios/entities/rol.entity';
import { Division } from '@app/modules/carreras/divisiones/entities/divisione.entity';
import { Carrera } from '@app/modules/carreras/entities/carrera.entity';
import { Curso } from '@app/modules/carreras/cursos/entities/curso.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    @InjectRepository(Carrera)
    private readonly carreraRepository: Repository<Carrera>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async onApplicationBootstrap() {
    console.log('Iniciando proceso de Seed...');
    await this.seedRoles();
    await this.seedDivisiones();
    await this.seedCarreras();
    await this.seedAdmin();
    await this.seedAuxiliares();
    await this.seedEstudiantes();
    await this.seedCourses();
    console.log('Proceso de Seed finalized');
  }

  private async seedRoles() {
    const roles = ['administrador', 'auxiliar', 'estudiante'];
    for (const nombre of roles) {
      const existe = await this.rolRepository.findOne({
        where: { nombre_rol: nombre },
      });
      if (!existe) {
        await this.rolRepository.save({ nombre_rol: nombre });
      }
    }
  }

  private async seedDivisiones() {
    const nombre = 'Ingeniería';
    const existe = await this.divisionRepository.findOne({
      where: { nombre_division: nombre },
    });
    if (!existe) {
      await this.divisionRepository.save({ nombre_division: nombre });
    }
  }

  private async seedCarreras() {
    const division = await this.divisionRepository.findOne({
      where: { nombre_division: 'Ingeniería' },
    });
    if (!division) return;

    //Ingeniería en Sistemas, codigo: 129
    const carreraNombre = 'Ingeniería en Sistemas';
    const existe = await this.carreraRepository.findOne({
      where: { codigo_carrera: '129' },
    });

    if (!existe) {
      await this.carreraRepository.save({
        codigo_carrera: '129',
        nombre_carrera: carreraNombre,
        division: division,
      });
    }
  }

  private async seedAdmin() {
    const email = 'admin@gmail.com';
    const existe = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!existe) {
      const rolAdmin = await this.rolRepository.findOne({
        where: { nombre_rol: 'administrador' },
      });

      if (!rolAdmin) {
        throw new Error(
          'No se pudo crear el admin porque el rol "administrador" no existe',
        );
      }

      const password = await bycrypt.hash('admin123', 10);

      const nuevoAdmin = this.usuarioRepository.create({
        nombre_completo: 'Administrador Base',
        email,
        password,
        username: 'admin-0',
        rol: rolAdmin,
      });
      await this.usuarioRepository.save(nuevoAdmin);
    }
  }

  private async seedAuxiliares() {
    const rolAuxiliar = await this.rolRepository.findOne({
      where: { nombre_rol: 'auxiliar' },
    });

    const carrera = await this.carreraRepository.findOne({
      where: { codigo_carrera: '129' },
    });

    if (!rolAuxiliar || !carrera) return;

    for (let i = 1; i <= 10; i++) {
      const email = `auxiliar${i}@gmail.com`;
      const existe = await this.usuarioRepository.findOne({ where: { email } });

      if (!existe) {
        const password = await bycrypt.hash(`aux${i}pass`, 10);
        const nuevoAux = this.usuarioRepository.create({
          nombre_completo: `Auxiliar ${i}`,
          email,
          password,
          username: `aux-${i}`,
          registro_academico: `2024${String(i).padStart(4, '0')}`,
          rol: rolAuxiliar,
          carrera: carrera,
        });
        await this.usuarioRepository.save(nuevoAux);
      }
    }
  }

  private async seedEstudiantes() {
    const rolEstudiante = await this.rolRepository.findOne({
      where: { nombre_rol: 'estudiante' },
    });

    const carrera = await this.carreraRepository.findOne({
      where: { codigo_carrera: '129' },
    });

    if (!rolEstudiante || !carrera) return;

    for (let i = 1; i <= 20; i++) {
      const email = `estudiante${i}@gmail.com`;
      const existe = await this.usuarioRepository.findOne({ where: { email } });

      if (!existe) {
        const password = await bycrypt.hash(`est${i}pass`, 10);
        const nuevoEst = this.usuarioRepository.create({
          nombre_completo: `Estudiante ${i}`,
          email,
          password,
          username: `est-${i}`,
          registro_academico: `2021${String(i).padStart(4, '0')}`,
          rol: rolEstudiante,
          carrera: carrera,
        });
        await this.usuarioRepository.save(nuevoEst);
      }
    }
  }

  private async seedCourses() {
    const carrera = await this.carreraRepository.findOne({
      where: { codigo_carrera: '129' },
    });
    if (!carrera) return;

    const cursosData = [
      { codigo: '3003', nombre: 'Área Social Humanística 1', semestre: 1 },
      { codigo: '3000', nombre: 'Área Matemática Básica 1', semestre: 1 },
      {
        codigo: '3005',
        nombre: 'Técnicas de Estudio e Investigación',
        semestre: 1,
      },
      { codigo: '3082', nombre: 'Deportes 1', semestre: 1 },
      { codigo: '3081', nombre: 'Idioma Técnico 1', semestre: 1 },
      { codigo: '3011', nombre: 'Área Social Humanística 2', semestre: 2 },
      { codigo: '3006', nombre: 'Área Matemática Básica 2', semestre: 2 },
      { codigo: '3231', nombre: 'Matemática para Computación 1', semestre: 2 },
      { codigo: '3007', nombre: 'Física Básica', semestre: 2 },
      { codigo: '3086', nombre: 'Deportes 2', semestre: 2 },
      { codigo: '3085', nombre: 'Idioma Técnico 2', semestre: 2 },
      { codigo: '3232', nombre: 'Lógica de Sistemas', semestre: 3 },
      { codigo: '3233', nombre: 'Matemática para Computación 2', semestre: 3 },
      {
        codigo: '3234',
        nombre: 'Introducción a la Programación y Computación 1',
        semestre: 3,
      },
      { codigo: '3013', nombre: 'Área Matemática Intermedia 1', semestre: 3 },
      { codigo: '3014', nombre: 'Física 1', semestre: 3 },
      { codigo: '3019', nombre: 'Ética Profesional', semestre: 3 },
      { codigo: '3098', nombre: 'Idioma Técnico 3', semestre: 3 },
      {
        codigo: '3235',
        nombre: 'Lenguajes Formales y de Programación',
        semestre: 4,
      },
      {
        codigo: '3236',
        nombre: 'Introducción a la Programación y Computación 2',
        semestre: 4,
      },
      { codigo: '3021', nombre: 'Área Matemática Intermedia 2', semestre: 4 },
      { codigo: '3023', nombre: 'Física 2', semestre: 4 },
      { codigo: '3089', nombre: 'Lógica', semestre: 4 },
      { codigo: '3237', nombre: 'Idioma Técnico 4', semestre: 4 },
      { codigo: '3238', nombre: 'Prácticas Iniciales', semestre: 4 },
      { codigo: '3090', nombre: 'Estadística 1', semestre: 5 },
      {
        codigo: '3239',
        nombre: 'Organización de Lenguajes y Compiladores 1',
        semestre: 5,
      },
      { codigo: '3240', nombre: 'Organización Computacional', semestre: 5 },
      { codigo: '3241', nombre: 'Estructura de Datos', semestre: 5 },
      { codigo: '3028', nombre: 'Matemática Aplicada 1', semestre: 5 },
      { codigo: '3027', nombre: 'Matemática Aplicada 3', semestre: 5 },
      { codigo: '3026', nombre: 'Filosofía de la Ciencia', semestre: 5 },
      { codigo: '3242', nombre: 'Teoría de Sistemas 1', semestre: 6 },
      { codigo: '3243', nombre: 'Investigación de Operaciones 1', semestre: 6 },
      { codigo: '3244', nombre: 'Economía', semestre: 6 },
      {
        codigo: '3245',
        nombre: 'Organización de Lenguajes y Compiladores 2',
        semestre: 6,
      },
      {
        codigo: '3246',
        nombre: 'Arquitectura de Computadoras y Ensambladores 1',
        semestre: 6,
      },
      {
        codigo: '3247',
        nombre: 'Manejo e Implementación de Archivos',
        semestre: 6,
      },
      { codigo: '3036', nombre: 'Matemática Aplicada 4', semestre: 6 },
      { codigo: '3121', nombre: 'Matemática Aplicada 2', semestre: 6 },
      { codigo: '3033', nombre: 'Ingeniería Eléctrica 1', semestre: 6 },
      { codigo: '3248', nombre: 'Teoría de Sistemas 2', semestre: 7 },
      { codigo: '3249', nombre: 'Investigación de Operaciones 2', semestre: 7 },
      { codigo: '3118', nombre: 'Estadística 2', semestre: 7 },
      { codigo: '3250', nombre: 'Sistemas Operativos 1', semestre: 7 },
      {
        codigo: '3251',
        nombre: 'Arquitectura de Computadoras y Ensambladores 2',
        semestre: 7,
      },
      { codigo: '3252', nombre: 'Redes de Computadoras 1', semestre: 7 },
      { codigo: '3253', nombre: 'Sistemas de Bases de Datos 1', semestre: 7 },
      { codigo: '3254', nombre: 'Prácticas Intermedias', semestre: 7 },
      { codigo: '3255', nombre: 'Sistemas Operativos 2', semestre: 8 },
      { codigo: '3256', nombre: 'Redes de Computadoras 2', semestre: 8 },
      { codigo: '3257', nombre: 'Sistemas de Bases de Datos 2', semestre: 8 },
      {
        codigo: '3258',
        nombre: 'Análisis y Diseño de Sistemas 1',
        semestre: 8,
      },
      { codigo: '3259', nombre: 'Seminario de Sistemas 1', semestre: 8 },
      { codigo: '3110', nombre: 'Ingeniería Económica 1', semestre: 8 },
      { codigo: '3260', nombre: 'Modelación y Simulación 1', semestre: 9 },
      {
        codigo: '3261',
        nombre: 'Sistemas Organizacionales y Gerenciales 1',
        semestre: 9,
      },
      { codigo: '3262', nombre: 'Inteligencia Artificial 1', semestre: 9 },
      {
        codigo: '3263',
        nombre: 'Seguridad y Auditoría de Redes de Computadoras',
        semestre: 9,
      },
      {
        codigo: '3264',
        nombre: 'Análisis y Diseño de Sistemas 2',
        semestre: 9,
      },
      { codigo: '3265', nombre: 'Seminario de Sistemas 2', semestre: 9 },
      { codigo: '3266', nombre: 'Sistemas Aplicados 1', semestre: 9 },
      { codigo: '3267', nombre: 'Bases de Datos Avanzadas', semestre: 9 },
      {
        codigo: '3268',
        nombre: 'Prácticas Finales Ingeniería Ciencias y Sistemas',
        semestre: 9,
      },
      { codigo: '3269', nombre: 'Modelación y Simulación 2', semestre: 10 },
      {
        codigo: '3270',
        nombre: 'Sistemas Organizacionales y Gerenciales 2',
        semestre: 10,
      },
      {
        codigo: '3271',
        nombre: 'Emprendedores de Negocios Informáticos',
        semestre: 10,
      },
      { codigo: '3272', nombre: 'Inteligencia Artificial 2', semestre: 10 },
      { codigo: '3273', nombre: 'Redes de Nueva Generación', semestre: 10 },
      { codigo: '3274', nombre: 'Software Avanzado', semestre: 10 },
      { codigo: '3275', nombre: 'Sistemas Aplicados 2', semestre: 10 },
      {
        codigo: '3276',
        nombre: 'Auditoría de Proyectos de Software',
        semestre: 10,
      },
      {
        codigo: '3277',
        nombre: 'Seminario de Investigación EPS Sistemas',
        semestre: 10,
      },
      { codigo: '3278', nombre: 'Seminario de Investigación', semestre: 10 },
    ];

    for (const cursoData of cursosData) {
      const existe = await this.cursoRepository.findOne({
        where: { codigo_curso: cursoData.codigo },
      });

      if (!existe) {
        const nuevoCurso = this.cursoRepository.create({
          codigo_curso: cursoData.codigo,
          nombre_curso: cursoData.nombre,
          semestre: cursoData.semestre,
          carrera: carrera,
        });
        await this.cursoRepository.save(nuevoCurso);
      }
    }
  }
}
